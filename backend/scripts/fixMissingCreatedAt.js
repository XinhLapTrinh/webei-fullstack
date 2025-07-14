const mongoose = require("mongoose");
const Product = require("../models/Product");
require("dotenv").config(); // Load biến môi trường từ .env

const MONGO_URI = process.env.MONGO_URI;

// Kết nối MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const fixMissingCreatedAt = async () => {
  try {
    const products = await Product.find({ createdAt: { $exists: false } });

    for (let product of products) {
      const timestamp = product._id.getTimestamp(); // Lấy timestamp từ _id
      product.createdAt = timestamp;
      product.updatedAt = timestamp;
      
      await product.save();
      console.log(`✅ Đã cập nhật sản phẩm: ${product.name}`);
    }

    console.log("✔️ Hoàn tất cập nhật tất cả sản phẩm thiếu createdAt.");
  } catch (error) {
    console.error("❌ Lỗi:", error);
  } finally {
    mongoose.disconnect(); // Đảm bảo ngắt kết nối sau khi hoàn thành
  }
};

fixMissingCreatedAt();
