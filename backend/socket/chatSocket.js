// const Message = require('../models/Message');

// module.exports = function (io) {
//   io.on('connection', (socket) => {
//     socket.on('send_message', async (data) => {
//       const message = new Message({
//         sender: data.sender,
//         content: data.content,
//         room: data.room,
//         timestamp: data.timestamp || new Date(),
//         senderRole: data.senderRole || 'user',
//         receiverRoles: data.receiverRoles || ['admin', 'editor'],
//       });

//       await message.save();

//       if (message.receiverRoles.includes('admin') || message.receiverRoles.includes('editor')) {
//         io.emit('receive_message_support', message); // gửi cho admin/editor
//       } else {
//         io.to(message.room).emit('receive_message', message); // gửi lại cho user
//       }
//     });

//     socket.on('join_room', (room) => {
//       socket.join(room);
//     });
//   });
// };

