// backend/routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Lấy lịch sử tin nhắn theo room
router.get('/:room', async (req, res) => {
  try {
    const messages = await Message.find({ room: req.params.room }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server khi lấy tin nhắn' });
  }
});

module.exports = router;
