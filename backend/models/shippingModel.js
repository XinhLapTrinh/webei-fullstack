const mongoose = require("mongoose");

const shippingSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    status: {
      type: String,
      enum: ["Chờ xử lý", "Đang vận chuyển", "Đã giao", "Đã hủy"],
      default: "Chờ xử lý",
    },
    carrier: { type: String }, // Đơn vị vận chuyển
    trackingNumber: { type: String },
    estimatedDelivery: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Shipping", shippingSchema);
