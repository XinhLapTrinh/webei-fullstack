import React, { useEffect, useState } from "react";
import { Table, Typography, Tag, Pagination, message } from "antd";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import dayjs from "dayjs";

const { Title } = Typography;

const OrderManager = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalOrders, setTotalOrders] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/orders?page=${page}&limit=${pageSize}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      setOrders(res.data.orders);
      setTotalOrders(res.data.total);
    } catch (err) {
      console.error("Lỗi khi tải đơn hàng:", err);
      message.error("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) fetchOrders(currentPage);
  }, [user, currentPage]);

  const columns = [
    {
      title: "STT",
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
      width: 70,
    },
    {
      title: "Khách hàng",
      dataIndex: ["user", "name"],
    },
    {
      title: "Email",
      dataIndex: ["user", "email"],
    },
    {
      title: "Sản phẩm",
      dataIndex: "orderItems",
      render: (items) =>
        items.map((item) => {
          const priceNote =
            item.product?.price && item.product.price < item.price ? (
              <Tag color="red" style={{ marginLeft: 8 }}>
                Đã giảm giá
              </Tag>
            ) : null;

          return (
            <div key={item.product?._id || item.name}>
              {item.name} x{item.quantity} {priceNote}
            </div>
          );
        }),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      render: (text) => `${text.toLocaleString()}₫`,
    },
    {
      title: "Ngày đặt",
      dataIndex: "createdAt",
      render: (date) => dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
  ];

  return (
    <div style={{ padding: 30 }}>
      <Title level={3}>Quản lý đơn hàng</Title>

      <Table
        columns={columns}
        dataSource={orders}
        loading={loading}
        rowKey="_id"
        pagination={false}
      />

      <div style={{ textAlign: "right", marginTop: 16 }}>
        <Pagination
          current={currentPage}
          total={totalOrders}
          pageSize={pageSize}
          onChange={(page) => setCurrentPage(page)}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
};

export default OrderManager;
