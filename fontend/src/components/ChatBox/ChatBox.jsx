// // src/components/ChatBox/ChatBox.jsx
// import React, { useEffect, useState, useRef } from 'react';
// import { Input, Button, Avatar, Typography, Card } from 'antd';
// import io from 'socket.io-client';
// import { UserOutlined, RobotOutlined } from '@ant-design/icons';
// import { getChatMessages } from '../../api/chatAPI';
// import { useAuth } from '../../context/AuthContext';

// const socket = io('http://localhost:3001'); // hoặc process.env.CHAT_SERVER_URL

// const ChatBox = () => {
//   const { user } = useAuth();
//   const username = user?.name || 'Guest';
//   const room = user?._id || 'guest_' + username;

//   const [message, setMessage] = useState('');
//   const [chat, setChat] = useState([]);
//   const listRef = useRef(null);

//   useEffect(() => {
//     const fetchHistory = async () => {
//       try {
//         const history = await getChatMessages(room);
//         setChat(history);
//       } catch (err) {
//         console.error('Lỗi khi tải lịch sử chat:', err);
//       }
//     };

//     fetchHistory();

//     socket.emit('join_room', room);
//     socket.on('receive_message', (data) => {
//       setChat((prev) => [...prev, data]);
//     });

//     return () => socket.off('receive_message');
//   }, [room]);

//   useEffect(() => {
//     if (listRef.current) {
//       listRef.current.scrollTop = listRef.current.scrollHeight;
//     }
//   }, [chat]);

//   const sendMessage = () => {
//     if (message.trim()) {
//       const msgData = {
//         sender: username,
//         senderRole: user?.role || 'user',
//         content: message,
//         room,
//         timestamp: new Date(),
//         receiverRoles: ['admin', 'editor'],
//       };
//       socket.emit('send_message', msgData);
//       setMessage('');
//     }
//   };

//   const renderMessage = (item) => {
//     const isCurrentUser = item.sender === username;

//     return (
//       <div
//         key={item._id || item.timestamp}
//         style={{
//           display: 'flex',
//           justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
//           marginBottom: 10,
//         }}
//       >
//         {!isCurrentUser && (
//           <Avatar icon={<UserOutlined />} style={{ marginRight: 8 }} />
//         )}
//         <div
//           style={{
//             background: isCurrentUser ? '#1890ff' : '#f0f0f0',
//             color: isCurrentUser ? 'white' : 'black',
//             padding: '8px 12px',
//             borderRadius: 16,
//             maxWidth: '65%',
//             wordBreak: 'break-word',
//           }}
//         >
//           {item.content}
//         </div>
//         {isCurrentUser && (
//           <Avatar icon={<RobotOutlined />} style={{ marginLeft: 8 }} />
//         )}
//       </div>
//     );
//   };

//   return (
//     <Card
//       title={<Typography.Text strong>💬 Chat hỗ trợ</Typography.Text>}
//       bodyStyle={{ display: 'flex', flexDirection: 'column', height: 400 }}
//     >
//       <div
//         ref={listRef}
//         style={{ flex: 1, overflowY: 'auto', padding: '0 8px' }}
//       >
//         {chat.map(renderMessage)}
//       </div>
//       <div style={{ marginTop: 8 }}>
//         <Input.Group compact>
//           <Input
//             style={{ width: '80%' }}
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             onPressEnter={sendMessage}
//             placeholder="Nhập tin nhắn..."
//           />
//           <Button type="primary" onClick={sendMessage}>
//             Gửi
//           </Button>
//         </Input.Group>
//       </div>
//     </Card>
//   );
// };

// export default ChatBox;
