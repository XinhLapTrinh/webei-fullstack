const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');
const bcrypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.register = async (req, res) => {
  console.log("req.body:", req.body); // Thử thêm dòng này
  const { name, email, password } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email đã tồn tại' });

    const user = await User.create({ name, email, password });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user),
    });
  } catch (err) {
    res.status(500).json({ message: 'Đăng ký thất bại', error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user),
    });
  } catch (err) {
    res.status(500).json({ message: 'Đăng nhập thất bại', error: err.message });
  }
};

exports.googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    console.log("🟡 Nhận token từ client:", req.body.token);

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        avatar: picture,
        provider: "google",
        password: "GOOGLE_" + Math.random().toString(36).substring(2, 10),
      });
    }

    const jwtToken = generateToken(user);
    res.json({ token: jwtToken, user });
  } catch (err) {
    console.error("Google login error", err);
    res.status(401).json({ message: "Xác thực Google thất bại", error: err.message });
  }
};