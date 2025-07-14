const Shipping = require("../models/shippingModel");

const getAllShippings = async (req, res) => {
  try {
    const shippings = await Shipping.find()
      .populate({
        path: "order",
        populate: { path: "user", select: "name email" },
      });
    res.json(shippings);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách vận chuyển", error: err.message });
  }
};

const updateShipping = async (req, res) => {
  try {
    const { status, carrier, trackingNumber, estimatedDelivery } = req.body;
    const shipping = await Shipping.findById(req.params.id);
    if (!shipping) return res.status(404).json({ message: "Không tìm thấy thông tin vận chuyển" });

    shipping.status = status || shipping.status;
    shipping.carrier = carrier || shipping.carrier;
    shipping.trackingNumber = trackingNumber || shipping.trackingNumber;
    shipping.estimatedDelivery = estimatedDelivery || shipping.estimatedDelivery;

    const updated = await shipping.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Cập nhật vận chuyển thất bại", error: err.message });
  }
};

module.exports = { getAllShippings, updateShipping };
