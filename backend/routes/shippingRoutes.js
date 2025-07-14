const express = require("express");
const router = express.Router();
const {
  updateShipping,
  getAllShippings,
} = require("../controllers/shippingController");

const { protect, authorizeRoles } = require("../middlewares/authMiddleware");

router.put("/:id", protect, authorizeRoles('admin', 'editor'), updateShipping);
router.get("/", protect, authorizeRoles('admin', 'editor'), getAllShippings);

module.exports = router;
