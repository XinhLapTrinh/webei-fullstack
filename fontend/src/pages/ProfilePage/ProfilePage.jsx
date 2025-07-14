import React, { useEffect, useState } from "react";
import {
  Typography,
  Descriptions,
  Table,
  Spin,
  message,
  Button,
  Upload,
  Avatar,
  Modal,
  Row,
  Col,
  Input,
  Divider,
} from "antd";
import {
  UploadOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const ProfilePage = () => {
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
  });

  // Lấy lịch sử đơn hàng
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("/api/orders/my", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setOrders(res.data);
      } catch (err) {
        message.error("Không thể tải danh sách đơn hàng.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) fetchOrders();
  }, [user]);

  // Cập nhật avatar
  const handleAvatarChange = async (info) => {
  const file = info.file.originFileObj;
  const formData = new FormData();
  formData.append("avatar", file);

  try {
    const res = await axios.put(`/api/users/me/avatar`, formData, {
      headers: {
        Authorization: `Bearer ${user.token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    message.success("Cập nhật ảnh đại diện thành công");
    setAvatar(res.data.avatar);
    const updatedUser = { ...user, avatar: res.data.avatar };
    sessionStorage.setItem("user", JSON.stringify(updatedUser));
    window.location.reload();
  } catch (err) {
    console.error(err);
    message.error("Không thể cập nhật ảnh đại diện");
  }
};


  // Cập nhật thông tin người dùng
  const handleSaveProfile = async () => {
  try {
    const res = await axios.put("/api/users/me", formValues, {
      headers: { Authorization: `Bearer ${user.token}` },
    });

    const updatedUser = {
      ...user,
      name: res.data.name,
      email: res.data.email,
    };

    // Cập nhật user trong sessionStorage và context
    sessionStorage.setItem("user", JSON.stringify(updatedUser));
    if (typeof setUser === "function") setUser(updatedUser);

    setFormValues({
      name: res.data.name,
      email: res.data.email,
      currentPassword: "",
      newPassword: "",
    });

    setIsEditing(false);
    message.success("Cập nhật thông tin thành công");
  } catch (err) {
    message.error(err.response?.data?.message || "Cập nhật thất bại");
  }
};


  const handleLogout = () => {
    Modal.confirm({
      title: "Xác nhận đăng xuất",
      content: "Bạn chắc chắn muốn đăng xuất?",
      okText: "Đăng xuất",
      cancelText: "Hủy",
      onOk: () => {
        logout();
        navigate("/login");
      },
    });
  };

  const orderColumns = [
    {
      title: "Mã đơn",
      dataIndex: "_id",
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      render: (price) => `$${price.toLocaleString()}`,
    },
    {
      title: "Trạng thái",
      dataIndex: "isPaid",
      render: (paid) =>
        paid ? <span style={{ color: "green" }}>Đã thanh toán</span> : "Chưa",
    },
    {
      title: "Ngày đặt",
      dataIndex: "createdAt",
      render: (date) => moment(date).format("DD/MM/YYYY"),
    },
  ];

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <Title level={3}>Hồ sơ cá nhân</Title>

      <Row gutter={[24, 24]} align="middle">
        <Col xs={24} md={8} style={{ textAlign: "center" }}>
          <Avatar
            size={120}
            src={avatar || "https://i.pravatar.cc/150"}
            icon={<UserOutlined />}
          />
          <Upload
            showUploadList={false}
            customRequest={() => {}}
            onChange={handleAvatarChange}
          >
            <Button icon={<UploadOutlined />} style={{ marginTop: 16 }}>
              Đổi ảnh đại diện
            </Button>
          </Upload>
          <Button
            icon={<LogoutOutlined />}
            danger
            onClick={handleLogout}
            style={{ marginTop: 12 }}
          >
            Đăng xuất
          </Button>
        </Col>

        <Col xs={24} md={16}>
          <Descriptions
            bordered
            column={1}
            size="middle"
            labelStyle={{ fontWeight: 600 }}
          >
            <Descriptions.Item label="Họ tên">
              {isEditing ? (
                <Input
                  value={formValues.name}
                  onChange={(e) =>
                    setFormValues({ ...formValues, name: e.target.value })
                  }
                />
              ) : (
                user?.name
              )}
            </Descriptions.Item>

            <Descriptions.Item label="Email">
              {isEditing ? (
                <Input
                  value={formValues.email}
                  onChange={(e) =>
                    setFormValues({ ...formValues, email: e.target.value })
                  }
                />
              ) : (
                user?.email
              )}
            </Descriptions.Item>

            <Descriptions.Item label="Vai trò">{user?.role}</Descriptions.Item>

            <Descriptions.Item label="Ngày tham gia">
              {moment(user?.createdAt).format("DD/MM/YYYY")}
            </Descriptions.Item>

            {isEditing && (
              <>
                <Descriptions.Item label="Mật khẩu hiện tại">
                  <Input.Password
                    value={formValues.currentPassword}
                    onChange={(e) =>
                      setFormValues({
                        ...formValues,
                        currentPassword: e.target.value,
                      })
                    }
                  />
                </Descriptions.Item>

                <Descriptions.Item label="Mật khẩu mới">
                  <Input.Password
                    value={formValues.newPassword}
                    onChange={(e) =>
                      setFormValues({
                        ...formValues,
                        newPassword: e.target.value,
                      })
                    }
                  />
                </Descriptions.Item>
              </>
            )}
          </Descriptions>

          {!isEditing ? (
            <Button
              type="primary"
              onClick={() => setIsEditing(true)}
              style={{ marginTop: 16 }}
            >
              Chỉnh sửa thông tin
            </Button>
          ) : (
            <div style={{ marginTop: 16 }}>
              <Button
                type="primary"
                onClick={handleSaveProfile}
                style={{ marginRight: 8 }}
              >
                Lưu
              </Button>
              <Button
                onClick={() => {
                  setIsEditing(false);
                  setFormValues({
                    name: user?.name,
                    email: user?.email,
                    currentPassword: "",
                    newPassword: "",
                  });
                }}
              >
                Hủy
              </Button>
            </div>
          )}
        </Col>
      </Row>

      <Divider />

      <Title level={4}>Lịch sử đơn hàng</Title>

      {loading ? (
        <Spin />
      ) : (
        <Table
          dataSource={orders}
          columns={orderColumns}
          rowKey="_id"
          pagination={{ pageSize: 5 }}
          scroll={{ x: true }}
        />
      )}
    </div>
  );
};

export default ProfilePage;
