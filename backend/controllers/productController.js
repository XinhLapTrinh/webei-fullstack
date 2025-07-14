const Product = require("../models/Product");
const fs = require("fs");
const path = require("path");
const { getEffectivePrice } = require("../utils/calculateFlashPrice");


/** 🔎 Chuẩn hoá tiếng Việt không dấu */
const normalize = (str) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, " ")
    .toLowerCase()
    .trim();

/** 📦 Lấy tất cả sản phẩm (phân trang, lọc, tìm kiếm) */
exports.getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;

    const noPagination = req.query.noPagination === "true";

    const keyword = req.query.keyword || "";
    const category = req.query.category || "";
    const sort = req.query.sort || "newest";

    const normalizedKeyword = normalize(keyword);
    const filter = {};

    if (normalizedKeyword) {
      const keywords = normalizedKeyword.split(" ").filter(Boolean);
      filter.$and = keywords.map((word) => ({
        nameUnsigned: { $regex: word, $options: "i" },
      }));
    }

    if (req.query.category) {
      filter.category = Array.isArray(req.query.category)
        ? { $in: req.query.category }
        : req.query.category;
    }

    if (req.query.price_gte || req.query.price_lte) {
      filter.price = {};
      if (req.query.price_gte) filter.price.$gte = parseFloat(req.query.price_gte);
      if (req.query.price_lte) filter.price.$lte = parseFloat(req.query.price_lte);
    }

    if (req.query.rating_gte) {
      filter.rating = { $gte: parseFloat(req.query.rating_gte) };
    }

    let sortOption = {};
    switch (sort) {
      case "price_asc":
        sortOption.price = 1;
        break;
      case "price_desc":
        sortOption.price = -1;
        break;
      case "name_asc":
        sortOption.name = 1;
        break;
      case "name_desc":
        sortOption.name = -1;
        break;
      default:
        sortOption.createdAt = -1;
    }

    // Nếu có noPagination=true thì bỏ skip & limit
    const total = await Product.countDocuments(filter);
    const productsQuery = Product.find(filter).sort(sortOption);

    if (!noPagination) {
      productsQuery.skip((page - 1) * limit).limit(limit);
    }

    const products = await productsQuery;

    res.status(200).json({
      products,
      total,
      currentPage: noPagination ? 1 : page,
      totalPages: noPagination ? 1 : Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("❌ Lỗi getAll:", error);
    res.status(500).json({ message: "Lỗi khi lấy sản phẩm", error });
  }
};


/** 📂 Lấy danh mục */
exports.getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    res.json(categories);
  } catch (error) {
    console.error("❌ Lỗi lấy danh mục:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

/** ➕ Tạo sản phẩm mới */
exports.create = async (req, res) => {
  try {
    const { name, price, discount, rating, description, category, brand } = req.body;

    let mainImage = "";
    let subImages = [];

    let specifications = [];
    if (req.body.specifications) {
      specifications = JSON.parse(req.body.specifications);
    }

    if (req.files) {
      if (req.files.mainImage?.[0]) {
        mainImage = req.files.mainImage[0].filename;
      }
      if (req.files.subImages) {
        subImages = req.files.subImages.map((file) => file.filename);
      }
    }

    let flashSale = null;
      if (req.body.flashSale) {
        try {
          flashSale = JSON.parse(req.body.flashSale);
        } catch (err) {
          console.warn("⚠️ Không thể parse flashSale:", err);
        }
      }

      const newProduct = new Product({
        name,
        price,
        brand,
        discount,
        rating,
        description,
        category,
        specifications,
        mainImage,
        subImages,
        flashSale,
        nameUnsigned: normalize(name),
      });


    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("❌ Error creating product:", error);
    res.status(500).json({ message: "Lỗi khi tạo sản phẩm" });
  }
};

/** ✏️ Cập nhật sản phẩm */
exports.update = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Không tìm thấy sản phẩm" });

    const fields = ["name", "price", "discount", "rating", "category", "description","brand"];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        const isNumber = ["price", "discount", "rating"].includes(field);
        product[field] = isNumber ? Number(req.body[field]) : req.body[field];
      }
    });

    const specs = [];
    const keys = Object.keys(req.body);
    const specKeys = keys.filter((k) => k.startsWith("specifications["));
    const indexes = [...new Set(specKeys.map((k) => k.match(/specifications\[(\d+)\]/)?.[1]))];
    indexes.forEach((i) => {
      const name = req.body[`specifications[${i}][name]`];
      const value = req.body[`specifications[${i}][value]`];
      if (name && value !== undefined) {
        specs.push({ name, value });
      }
    });
    if (specs.length > 0) product.specifications = specs;

    if (req.files?.mainImage?.[0]) {
      product.mainImage = req.files.mainImage[0].filename;
    } else if (req.body.mainImageUrl) {
      product.mainImage = req.body.mainImageUrl;
    }

    const subImages = [];
    if (req.body.subImageUrls) {
      if (Array.isArray(req.body.subImageUrls)) {
        subImages.push(...req.body.subImageUrls);
      } else {
        subImages.push(req.body.subImageUrls);
      }
    }
    if (req.files?.subImages?.length > 0) {
      subImages.push(...req.files.subImages.map((f) => f.filename));
    }
    product.subImages = subImages;


    if (req.body.flashSale) {
      try {
        const flash = JSON.parse(req.body.flashSale);

        let flashPrice = flash.price || 0;

        // ✅ Ưu tiên discountPercent nếu có
        if (flash.discountPercent && product.price) {
          flashPrice = Math.round(product.price * (1 - flash.discountPercent / 100));
        }

        product.flashSale = {
          isActive: !!flash.isActive,
          price: flashPrice,
          discountPercent: flash.discountPercent || 0,
          startTime: flash.startTime,
          endTime: flash.endTime,
        };
      } catch (err) {
        console.warn("⚠️ Không thể parse flashSale:", err);
      }
    }



    await product.save();
    res.json({ message: "✔️ Cập nhật thành công", product });
  } catch (err) {
    console.error("❌ Update error:", err);
    res.status(500).json({ error: "Lỗi cập nhật", detail: err.message });
  }
};

/** ❌ Xóa sản phẩm */
exports.remove = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ error: "Not found" });

  if (product.mainImage) {
    const mainImagePath = path.join(__dirname, "../uploads", product.mainImage);
    if (fs.existsSync(mainImagePath)) fs.unlinkSync(mainImagePath);
  }

  if (Array.isArray(product.subImages)) {
    product.subImages.forEach((img) => {
      const subImagePath = path.join(__dirname, "../uploads", img);
      if (fs.existsSync(subImagePath)) fs.unlinkSync(subImagePath);
    });
  }

  res.json({ success: true });
};

/** 📄 Lấy sản phẩm theo ID (kèm phân trang review) */
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;

    const product = await Product.findById(id).lean();
    if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

    const totalReviews = product.reviews?.length || 0;
    const startIndex = (page - 1) * limit;
    const paginatedReviews = product.reviews?.slice(startIndex, startIndex + limit) || [];

    res.json({
      ...product,
      reviews: paginatedReviews,
      numReviews: totalReviews,
    });
  } catch (err) {
    console.error("❌ Lỗi getById:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

/** 📝 Thêm đánh giá sản phẩm */
exports.addReviews = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      return res.status(400).json({ message: "Bạn đã đánh giá sản phẩm này" });
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Đã thêm đánh giá" });
  } catch (err) {
    console.error("❌ Lỗi addReview:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

exports.productList = async (req, res) => {
  const products = await Product.find();
  const result = products.map((p) => ({
    ...p.toObject(),
    effectivePrice: getEffectivePrice(p),
  }));
  res.json(result);
};

// GET /api/products/flashsale
exports.getFlashSaleProducts = async (req, res) => {
  try {
    const now = new Date();
    const products = await Product.find({
      "flashSale.isActive": true,
      "flashSale.startTime": { $lte: now },
      "flashSale.endTime": { $gte: now },
      status: 'in stock'
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Lỗi server" });
  }
};

exports.getNewestProduct = async (req, res) => {
  try {
    const products = await Product.find({})
      .sort({ createdAt: -1 })  // Sắp xếp theo ngày tạo (mới nhất trước)
      .limit(8); // Lấy tối đa 8 sản phẩm mới nhất
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy sản phẩm mới nhất', error: err });
  }
}