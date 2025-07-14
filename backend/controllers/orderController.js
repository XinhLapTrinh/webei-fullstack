const Order = require("../models/orderModel");
const Coupon = require("../models/Coupon")
const Shipping = require("../models/shippingModel");
const Product = require("../models/Product");

// POST /api/orders
const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, couponCode } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "Không có sản phẩm trong đơn hàng" });
    }

    let totalPrice = 0;
    let appliedCoupon = null;
    const detailedItems = [];

    // ✅ Lấy thông tin từng sản phẩm và tính tổng
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Không tìm thấy sản phẩm: ${item.product}` });
      }

      const finalPrice = item.price; // ✅ lấy đúng giá từ client đã xử lý flash sale / discount
        detailedItems.push({
          product: product._id,
          name: product.name,
          image: product.image,
          quantity: item.quantity,
          price: finalPrice,
        });


      totalPrice += finalPrice * item.quantity;
    }

    // ✅ Kiểm tra và áp dụng mã giảm giá
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode });

      if (!coupon) {
        return res.status(400).json({ message: "Mã giảm giá không tồn tại" });
      }
      if (coupon.expiresAt && new Date() > coupon.expiresAt) {
        return res.status(400).json({ message: "Mã giảm giá đã hết hạn" });
      }
      if (coupon.usedCount >= coupon.maxUsage) {
        return res.status(400).json({ message: "Mã giảm giá đã được dùng hết" });
      }

      // ✅ Tính tiền giảm
      let discountAmount = 0;
      if (coupon.discountType === "percent") {
        discountAmount = (totalPrice * coupon.discountValue) / 100;
      } else {
        discountAmount = coupon.discountValue;
      }

      totalPrice -= discountAmount;

      appliedCoupon = {
        code: coupon.code,
        type: coupon.discountType,
        value: coupon.discountValue,
      };

      // ✅ Cập nhật lượt dùng mã
      coupon.usedCount++;
      await coupon.save();
    }

    // ✅ Tạo đơn hàng
    const newOrder = new Order({
      user: req.user._id,
      orderItems: detailedItems,
      shippingAddress,
      totalPrice,
      coupon: appliedCoupon,
      isPaid: true,
      paidAt: Date.now(),
    });

    const savedOrder = await newOrder.save();

    // ✅ Tăng số lượng đã bán
    for (const item of detailedItems) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { sold: item.quantity } },
        { new: true }
      );
    }

    // ✅ Tạo đơn vận chuyển
    await Shipping.create({
      order: savedOrder._id,
      user: req.user._id,
      status: "Chờ xử lý",
    });

    res.status(201).json(savedOrder);
  } catch (err) {
    console.error("❌ Lỗi khi tạo đơn hàng:", err);
    if (!res.headersSent) {
      res.status(500).json({ message: "Lỗi tạo đơn hàng", error: err.message });
    }
  }
};

// GET /api/orders/stats (Doanh thu theo tháng)
const getRevenueStats = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      { $match: { isPaid: true } },
      {
        $group: {
          _id: {
            year: { $year: "$paidAt" },
            month: { $month: "$paidAt" },
          },
          totalRevenue: { $sum: "$totalPrice" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: "Lỗi thống kê doanh thu", error: err.message });
  }
};

// GET /api/orders
const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const orders = await Order.find()
      .sort({ createdAt: -1 }) // ✅ Mới nhất lên đầu
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("user", "name email")
      .populate("orderItems.product", "name image price");

    const total = await Order.countDocuments();

    res.json({
      orders,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Không thể lấy danh sách đơn hàng", error: err.message });
  }
};


const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Không thể lấy đơn hàng", error: err.message });
  }
};


module.exports = {
  createOrder,
  getRevenueStats,
  getAllOrders,
  getMyOrders
};
