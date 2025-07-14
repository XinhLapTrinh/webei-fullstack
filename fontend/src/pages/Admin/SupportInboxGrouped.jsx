// src/pages/Admin/SupportInboxGrouped.jsx
import React, { useEffect, useState } from 'react';
import {
  Card, List, Typography, Avatar, Tag,
  Drawer, Space, Input, Button, message as antMessage
} from 'antd';
import { UserOutlined, MessageOutlined } from '@ant-design/icons';
import io from 'socket.io-client';
import { groupBy } from 'lodash';
import { useAuth } from '../../context/AuthContext';

const socket = io('http://localhost:3001');

const SupportInboxGrouped = () => {
  const { user: currentUser } = useAuth();

  const [messages, setMessages] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [open, setOpen] = useState(false);
  const [reply, setReply] = useState('');

  useEffect(() => {
    socket.on('receive_message_support', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off('receive_message_support');
  }, []);

  const grouped = groupBy(messages, 'room');

  const openRoom = (room) => {
    setSelectedRoom(grouped[room]);
    setOpen(true);
  };

  const handleSendReply = () => {
    if (!reply.trim()) return;
    const room = selectedRoom[0].room;

    const replyData = {
      sender: currentUser?.name || 'admin',
      senderRole: currentUser?.role || 'admin',
      content: reply,
      room,
      timestamp: new Date(),
      receiverRoles: ['user'], // gửi về client user
    };

    socket.emit('send_message', replyData);
    setMessages((prev) => [...prev, replyData]);
    setReply('');
    antMessage.success('Đã gửi phản hồi');
  };

  return (
    <Card
      title={
        <Space>
          <MessageOutlined />
          <Typography.Title level={4} style={{ margin: 0 }}>
            Danh sách người dùng
          </Typography.Title>
        </Space>
      }
      style={{ maxWidth: 800, margin: '24px auto' }}
    >
      <List
        itemLayout="horizontal"
        dataSource={Object.entries(grouped)}
        renderItem={([room, msgs]) => {
          const lastMsg = msgs[msgs.length - 1];
          return (
            <List.Item onClick={() => openRoom(room)} style={{ cursor: 'pointer' }}>
              <List.Item.Meta
                avatar={<Avatar icon={<UserOutlined />} />}
                title={
                  <Space>
                    <Typography.Text strong>{lastMsg.sender}</Typography.Text>
                    <Tag color="blue">{room}</Tag>
                    <Typography.Text type="secondary">
                      {new Date(lastMsg.timestamp).toLocaleTimeString()}
                    </Typography.Text>
                  </Space>
                }
                description={lastMsg.content}
              />
            </List.Item>
          );
        }}
      />

      <Drawer
        title={`Lịch sử chat với ${selectedRoom?.[0]?.sender}`}
        placement="right"
        width={400}
        onClose={() => setOpen(false)}
        open={open}
        footer={
          <Space style={{ width: '100%' }}>
            <Input
              placeholder="Nhập phản hồi..."
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              onPressEnter={handleSendReply}
              style={{ flex: 1 }}
            />
            <Button type="primary" onClick={handleSendReply}>
              Gửi
            </Button>
          </Space>
        }
      >
        {selectedRoom?.map((msg, index) => (
          <div key={index} style={{ marginBottom: 12 }}>
            <Typography.Text strong>{msg.sender}</Typography.Text>
            <Typography.Paragraph>{msg.content}</Typography.Paragraph>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {new Date(msg.timestamp).toLocaleString()}
            </Typography.Text>
            <hr />
          </div>
        ))}
      </Drawer>
    </Card>
  );
};

export default SupportInboxGrouped;
