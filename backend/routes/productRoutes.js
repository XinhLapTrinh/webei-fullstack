const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Middleware phân quyền
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");

// Khởi tạo thư mục uploads nếu chưa có
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Cấu hình Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  },
});
const upload = multer({ storage });

/* ✅ Route API */

// Public
router.get("/flashsale", productController.getFlashSaleProducts);
router.get("/", productController.getAll);
router.get("/categories", productController.getCategories);
router.get("/newest",productController.getNewestProduct)
router.get("/:id", productController.getById);



// Admin Protected
router.post(
  "/",
  protect,
  authorizeRoles('admin', 'editor'),
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "subImages", maxCount: 10 },
  ]),
  productController.create
);
router.put(
  "/:id",
  protect,
  authorizeRoles('admin', 'editor'),
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "subImages", maxCount: 10 },
  ]),
  productController.update
);
router.post('/:id/reviews', protect, productController.addReviews);

router.delete("/:id", protect, authorizeRoles('admin','editor'), productController.remove);




module.exports = router;
