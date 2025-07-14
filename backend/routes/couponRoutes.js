const express = require("express");
const router = express.Router();
const couponController = require("../controllers/couponController");
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");

// Public
router.get("/",protect,authorizeRoles('admin','editor'), couponController.getAllCoupons);
router.post("/validate", couponController.validateCoupon);

// Admin
router.post("/",protect,authorizeRoles('admin','editor'), couponController.createCoupon);
router.put("/:id",protect,authorizeRoles('admin','editor'), couponController.updateCoupon); // Nếu dùng chung create/update
router.delete("/:id",protect,authorizeRoles('admin','editor'), couponController.deleteCoupon);

module.exports = router;
