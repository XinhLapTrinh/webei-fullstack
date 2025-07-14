const mongoose = require('mongoose');
require('dotenv').config(); // Load biến môi trường từ .env

const Product = require('../models/Product'); // Đường dẫn đến model Product

const MONGO_URI = process.env.MONGO_URI;

// Kết nối MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const updateStatus = async () => {
  try {
    // Lấy tất cả sản phẩm
    const products = await Product.find({});

    for (let product of products) {
      let updated = false;

      // Nếu không có giá trị `status`, gán giá trị mặc định "in stock"
      if (!product.status) {
        product.status = 'in stock';
        updated = true;
      }

      // Lưu lại sản phẩm nếu có thay đổi
      if (updated) {
        await product.save();
        console.log(`✅ Đã cập nhật sản phẩm: ${product.name}`);
      }
    }

    console.log("✔️ Hoàn tất cập nhật tất cả sản phẩm.");
  } catch (error) {
    console.error("❌ Lỗi:", error);
  } finally {
    mongoose.disconnect();
  }
};

updateStatus();
