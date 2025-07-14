const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const { protect } = require("../middlewares/authMiddleware");

router.get("/", protect, async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user._id }).populate("items.productId");
  res.json(cart || { items: [] });
});

router.post("/", protect, async (req, res) => {
  const { productId, quantity } = req.body;
  let cart = await Cart.findOne({ userId: req.user._id });

  if (!cart) cart = new Cart({ userId: req.user._id, items: [] });

  const index = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (index >= 0) {
    cart.items[index].quantity += quantity;
  } else {
    cart.items.push({ productId, quantity });
  }

  await cart.save();
  const populatedCart = await Cart.findById(cart._id).populate("items.productId");
  res.json(populatedCart);
});

router.delete("/", protect, async (req, res) => {
  await Cart.findOneAndDelete({ userId: req.user._id });
  res.json({ message: "Cart cleared" });
});

module.exports = router;
