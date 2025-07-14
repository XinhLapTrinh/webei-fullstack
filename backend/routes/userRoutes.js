// backend/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  deleteUser,
  updateUser,
  updateAvatar,
  updateProfile
} = require("../controllers/userController");
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");
// Chỉ admin được quyền xem toàn bộ danh sách & xóa user
router.route("/").get(protect, authorizeRoles('admin'), getAllUsers);
router.route("/:id").delete(protect, authorizeRoles('admin'), deleteUser);
router.put("/me", protect, updateProfile)
router.put("/me/avatar", protect, upload.single("avatar"), updateAvatar);
router.route("/:id").put(protect, authorizeRoles('admin'), updateUser); 


module.exports = router