import React, { useEffect, useState } from "react";
import {
  Table,
  Input,
  Button,
  Space,
  Popconfirm,
  message,
  Tag,
  Modal,
  Form,
  Select,
  Typography,
  Card,
} from "antd";
import {
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  getAllUsers,
  deleteUserById,
  updateUserById,
} from "../../api/userAPI";
import { useAuth } from "../../context/AuthContext";

const { Title } = Typography;

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const { user } = useAuth();

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers(user.token, searchKeyword);
      setUsers(data);
    } catch (error) {
      message.error(" Lỗi khi tải danh sách người dùng");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchKeyword]);

  const handleDelete = async (userId) => {
    try {
      await deleteUserById(userId, user.token);
      message.success(" Đã xóa người dùng");
      fetchUsers();
    } catch (error) {
      const msg = error.response?.data?.message;
      if (msg === "Chỉ admin toàn quyền mới được xóa người dùng") {
        message.error(" Bạn không có quyền xóa người dùng này");
      } else {
        message.error(" Xóa thất bại");
      }
    }
  };

  const openEditModal = (record) => {
    setEditingUser(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();

      if (
        user.role !== "admin" &&
        values.role !== editingUser.role
      ) {
        message.error(" Bạn không có quyền thay đổi vai trò người dùng!");
        return;
      }

      await updateUserById(editingUser._id, values, user.token);
      message.success(" Cập nhật thành công");
      setIsModalVisible(false);
      fetchUsers();
    } catch (error) {
      const msg = error?.response?.data?.message;
      if (msg === "Chỉ admin toàn quyền mới được sửa vai trò") {
        message.error(" Bạn không có quyền thay đổi vai trò người dùng!");
      } else if (msg === "Email đã tồn tại") {
        message.error(" Email đã tồn tại!");
      } else {
        message.error(" Cập nhật thất bại");
      }
    }
  };

  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => <span style={{ color: "#555" }}>{text}</span>,
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role) =>{
        if (role === 'admin')
          return  <Tag color="red">Admin</Tag>
        else if (role === 'editor')
          return  <Tag color="blue">Editor</Tag>
        else 
          return  <Tag color="green">User</Tag>
      }
        // role === "admin" ? (
        //   <Tag color="red">Admin</Tag>
        // ) : (
        //   <Tag color="blue">User</Tag>
        // ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
            type="primary"
            size="small"
          >
            Sửa
          </Button>
          {user.email === "admin@gmail.com" && (
            <Popconfirm
              title="Bạn có chắc muốn xóa người dùng này không?"
              onConfirm={() => handleDelete(record._id)}
            >
              <Button
                danger
                icon={<DeleteOutlined />}
                size="small"
                type="dashed"
              >
                Xóa
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Card
        bordered={false}
        style={{ borderRadius: "12px", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
      >
        <Title level={3} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <UserOutlined />
          Quản lý người dùng
        </Title>

        <Space style={{ marginBottom: 16 }}>
          <Input
            placeholder="Tìm kiếm theo tên hoặc email"
            prefix={<SearchOutlined />}
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            allowClear
            style={{ width: 300 }}
          />
        </Space>

        <Table
          dataSource={users}
          columns={columns}
          rowKey="_id"
          pagination={{ pageSize: 8 }}
          style={{ marginTop: 16 }}
          bordered
        />
      </Card>

      <Modal
        title="Chỉnh sửa người dùng"
        open={isModalVisible}
        onOk={handleUpdate}
        onCancel={() => setIsModalVisible(false)}
        okText="Lưu"
        cancelText="Hủy"
        style={{ top: 100 }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input />
          </Form.Item>

          {user.role === "admin" && (
            <Form.Item
              label="Vai trò"
              name="role"
              rules={[{ required: true, message: "Chọn vai trò" }]}
            >
              <Select>
                <Select.Option value="user">User</Select.Option>
                <Select.Option value="editor">Editor</Select.Option>
                <Select.Option value="admin">Admin</Select.Option>
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default UserManager;
