// backend/controllers/userController.js
const User = require("../models/userModel");
const bcrypt = require('bcryptjs');

// @desc    Lấy danh sách người dùng (có tìm kiếm)
// @route   GET /api/users?search=abc
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};

    const users = await User.find(keyword).select("-password");
    res.json(users);
  } catch (error) {
    console.error("Lỗi getAllUsers:", error);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách người dùng" });
  }
};

// @desc    Xóa người dùng
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const requester = req.user;

    if (requester.role !== "admin") {
      return res.status(403).json({ message: "Chỉ admin mới có quyền" });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "Đã xóa người dùng thành công" });
  } catch (error) {
    console.error("Lỗi khi xóa người dùng:", error);
    res.status(500).json({ message: "Lỗi khi xóa người dùng" });
  }
};


const updateUser = async (req, res) => {
  try {
    const requester = req.user;

    if (requester.role !== "admin") {
      return res.status(403).json({ message: "Chỉ admin mới có quyền" });
    }

    const user = await User.findById(req.params.id); // user bị sửa
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });


    // ✅ Chỉ admin toàn quyền được sửa role
    if (
      requester.role !== "admin" &&
      req.body.role &&
      req.body.role !== user.role
    ) {
      return res.status(403).json({ message: "Chỉ admin toàn quyền mới được sửa vai trò" });
    }

    // Kiểm tra trùng email
    if (req.body.email && req.body.email !== user.email) {
      const emailExists = await User.findOne({ email: req.body.email });
      if (emailExists) {
        return res.status(400).json({ message: "Email đã tồn tại" });
      }
      user.email = req.body.email;
    }

    user.name = req.body.name || user.name;
    if (req.body.role) user.role = req.body.role;

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật người dùng" });
  }
};

// controllers/userController.js
const updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Không có file được tải lên" });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });

    user.avatar = `/uploads/${req.file.filename}`;
    await user.save();

    res.json({ avatar: user.avatar });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi cập nhật ảnh đại diện", error: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "Người dùng không tồn tại" });

    const { name, email, currentPassword, newPassword } = req.body;

    // ✅ Nếu đổi email, kiểm tra trùng
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: "Email đã tồn tại" });
      }
      user.email = email;
    }

    user.name = name || user.name;

    // ✅ Nếu đổi mật khẩu
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: "Vui lòng nhập mật khẩu hiện tại" });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Mật khẩu hiện tại không đúng" });
      }

      user.password = newPassword
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi cập nhật thông tin cá nhân" });
  }
};


module.exports = {
  getAllUsers,
  deleteUser,
  updateUser,
  updateAvatar,
  updateProfile
};
