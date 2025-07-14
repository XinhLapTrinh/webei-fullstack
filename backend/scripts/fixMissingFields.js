// updateBrandField.js
require("dotenv").config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI
// 🔐 Thay thế bằng chuỗi kết nối MongoDB Atlas của bạn


// Kết nối MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('✅ Kết nối MongoDB thành công');
    updateProducts();
  })
  .catch((err) => {
    console.error('❌ Lỗi kết nối MongoDB:', err);
  });

// Định nghĩa schema tạm thời
const productSchema = new mongoose.Schema({}, { strict: false });
const Product = mongoose.model('Product', productSchema, 'products'); // 👈 dùng collection 'products'

async function updateProducts() {
  try {
    const result = await Product.updateMany(
      { brand: { $exists: false } },            // Chỉ cập nhật nếu chưa có trường brand
      { $set: { brand: 'Chưa xác định' } }      // Bạn có thể đổi thành 'Apple', 'Samsung', v.v.
    );

    console.log(`✅ Đã cập nhật ${result.modifiedCount} sản phẩm.`);
  } catch (error) {
    console.error('❌ Lỗi khi cập nhật sản phẩm:', error);
  } finally {
    mongoose.disconnect();
  }
}
