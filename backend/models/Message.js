// // backend/models/Message.js
// const mongoose = require('mongoose');

// const messageSchema = new mongoose.Schema({
//   sender: String,
//   senderRole: { type: String, default: 'user' },
//   content: String,
//   room: String,
//   timestamp: { type: Date, default: Date.now },
//   receiverRoles: [String], // để phân biệt gửi cho user, admin, editor
// });

// module.exports = mongoose.model('Message', messageSchema);
