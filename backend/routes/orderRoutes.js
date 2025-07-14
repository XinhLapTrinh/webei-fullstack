const express = require("express");
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getRevenueStats,
  getMyOrders
} = require("../controllers/orderController");

const { protect, authorizeRoles } = require("../middlewares/authMiddleware");

// Đặt hàng
router.post("/", protect, createOrder);

// Thống kê doanh thu
router.get("/stats", protect, authorizeRoles('admin', 'editor'), getRevenueStats);

// Lấy danh sách đơn hàng (admin)
router.get("/", protect, authorizeRoles('admin', 'editor'), getAllOrders);

router.get("/my", protect, getMyOrders);


module.exports = router;
