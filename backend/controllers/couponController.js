const Coupon = require("../models/Coupon");

exports.createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json(coupon);
  } catch (err) {
    console.error("❌ Lỗi tạo mã:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.validateCoupon = async (req, res) => {
  const { code, orderTotal } = req.body;

  try {
    const coupon = await Coupon.findOne({ code });

    if (!coupon) return res.status(404).json({ error: "Mã không tồn tại" });
    if (coupon.expiresAt && new Date() > coupon.expiresAt)
      return res.status(400).json({ error: "Mã đã hết hạn" });
    if (coupon.usedCount >= coupon.maxUses)
      return res.status(400).json({ error: "Mã đã được dùng hết" });
    if (orderTotal < coupon.minOrder)
      return res.status(400).json({ error: `Áp dụng cho đơn từ ${coupon.minOrder}₫` });

    res.json({ success: true, coupon });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// controllers/couponController.js
exports.updateCoupon = async (req, res) => {
  try {
    const updated = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ error: "Không tìm thấy mã" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.deleteCoupon = async (req, res) => {
  try {
    const deleted = await Coupon.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Không tìm thấy mã" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
