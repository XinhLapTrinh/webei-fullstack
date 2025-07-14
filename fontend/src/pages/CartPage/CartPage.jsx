import React from "react";
import { useCart } from "../../context/CartContext";
import { Table, Button, Typography, InputNumber, Image } from "antd";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const CartPage = () => {
  const {
    cartItems,
    removeFromCart,
    clearCart,
    updateQuantity,
  } = useCart();
  const navigate = useNavigate();

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (img) => (
        <Image
          src={img}
          alt="product"
          width={60}
          height={60}
          style={{ objectFit: "contain", border: "1px solid #eee" }}
        />
      ),
    },
    {
      title: "Sản phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (text) => `${text.toLocaleString()}₫`,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity, record) => (
        <InputNumber
          min={1}
          max={100}
          value={quantity}
          onChange={(value) => updateQuantity(record.id, value)}
        />
      ),
    },
    {
      title: "Tổng",
      key: "total",
      render: (_, record) =>
        `${(record.price * record.quantity).toLocaleString()}₫`,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Button danger onClick={() => removeFromCart(record.id)}>
          Xoá
        </Button>
      ),
    },
  ];

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div style={{ padding: "30px 50px" }}>
      <Title level={3}>Giỏ hàng của bạn</Title>

      <Table
        dataSource={cartItems}
        columns={columns}
        rowKey="id"
        pagination={false}
        locale={{ emptyText: "Giỏ hàng đang trống" }}
      />

      {cartItems.length > 0 && (
        <div style={{ marginTop: 20, textAlign: "right" }}>
          <Title level={4}>Tổng tiền: {totalPrice.toLocaleString()}₫</Title>
          <Button
            type="primary"
            onClick={() => navigate("/order")}
            style={{ marginRight: 8 }}
          >
            Thanh toán
          </Button>
          <Button danger onClick={clearCart}>
            Xoá toàn bộ
          </Button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
