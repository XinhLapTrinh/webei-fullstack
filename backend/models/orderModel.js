const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: { type: String, required: true },
    image: String,
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }, // Đây là giá đã giảm nếu có
  },
  { _id: false }
);

const shippingAddressSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    district: { type: String },
    postalCode: { type: String },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderItems: [orderItemSchema],
    shippingAddress: shippingAddressSchema,

    // ✅ Tổng giá đã áp dụng giảm giá
    totalPrice: { type: Number, required: true },

    // ✅ Thông tin mã giảm giá (nếu có)
    coupon: {
      code: String,
      type: { type: String, enum: ["percent", "fixed"] },
      value: Number,
    },

    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },

    status: {
      type: String,
      enum: ["Chờ xử lý", "Đang giao", "Đã giao"],
      default: "Chờ xử lý",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
