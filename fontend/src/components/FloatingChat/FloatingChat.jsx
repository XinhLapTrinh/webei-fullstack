// import React, { useState } from 'react';
// import { Button, Drawer, Badge, Modal, Input } from 'antd';
// import { MessageOutlined } from '@ant-design/icons';
// import ChatBox from '../ChatBox/ChatBox';
// import { useAuth } from '../../context/AuthContext';

// const FloatingChat = () => {
//   const { user } = useAuth();
//   const [open, setOpen] = useState(false);
//   const [guestName, setGuestName] = useState('');
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const username = user?.name || guestName || 'Khách vãng lai';

//   const toggleDrawer = () => {
//     if (user) {
//       setOpen(!open);
//     } else {
//       setIsModalOpen(true); // Nếu chưa đăng nhập thì yêu cầu nhập tên
//     }
//   };

//   const handleConfirmName = () => {
//     if (guestName.trim()) {
//       setIsModalOpen(false);
//       setOpen(true);
//     }
//   };

//   return (
//     <>
//       {/* Nút icon chat trôi góc dưới */}
//       <div
//         style={{
//           position: 'fixed',
//           bottom: 24,
//           right: 24,
//           zIndex: 1000,
//         }}
//       >
//         <Badge dot>
//           <Button
//             type="primary"
//             shape="circle"
//             size="large"
//             icon={<MessageOutlined />}
//             onClick={toggleDrawer}
//           />
//         </Badge>
//       </div>

//       {/* Modal nhập tên nếu chưa đăng nhập */}
//       <Modal
//         open={isModalOpen}
//         title="Xin nhập tên để bắt đầu chat"
//         onOk={handleConfirmName}
//         onCancel={() => setIsModalOpen(false)}
//         okText="Bắt đầu"
//         cancelText="Hủy"
//       >
//         <Input
//           placeholder="Nhập tên của bạn"
//           value={guestName}
//           onChange={(e) => setGuestName(e.target.value)}
//           onPressEnter={handleConfirmName}
//         />
//       </Modal>

//       {/* Drawer chứa khung chat */}
//       <Drawer
//         title="💬 Hỗ trợ trực tuyến"
//         placement="right"
//         onClose={() => setOpen(false)}
//         open={open}
//         width={360}
//       >
//        <ChatBox username={username} room={user?._id || 'guest'} />
//       </Drawer>
//     </>
//   );
// };

// export default FloatingChat;
