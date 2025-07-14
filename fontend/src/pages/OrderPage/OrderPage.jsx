import React, { useState } from "react";
import {
  Table,
  Button,
  Typography,
  Modal,
  message,
  Form,
  Input,
  Divider,
} from "antd";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { validateCoupon } from "../../api/couponAPI";
import axios from "axios";

const { Title } = Typography;

const OrderPage = () => {
  const [coupon, setCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponCodeInput, setCouponCodeInput] = useState("");

  const { cartItems, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // ✅ Hàm tính giá hiệu lực (flash sale nếu có)
  const getEffectivePrice = (item) => {
    const now = new Date();
    const isFlashSaleActive =
      item.flashSale?.isActive &&
      new Date(item.flashSale.startTime) <= now &&
      new Date(item.flashSale.endTime) >= now;

    return isFlashSaleActive ? Number(item.flashSale.price) : Number(item.price);
  };

  // ✅ Tính tổng
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + getEffectivePrice(item) * item.quantity,
    0
  );
  const finalPrice = totalPrice - discountAmount;

  const columns = [
    { title: "Sản phẩm", dataIndex: "name", key: "name" },
    {
      title: "Giá",
      key: "price",
      render: (_, record) => `${getEffectivePrice(record).toLocaleString()}₫`,
    },
    { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
    {
      title: "Tổng",
      key: "total",
      render: (_, record) =>
        `${(getEffectivePrice(record) * record.quantity).toLocaleString()}₫`,
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

  const handleBack = () => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn rời khỏi trang?",
      content: "Giỏ hàng sẽ bị xóa nếu bạn quay lại.",
      okText: "Đồng ý",
      cancelText: "Hủy",
      onOk: () => {
        clearCart();
        navigate(-1);
      },
    });
  };

  const handleApplyCoupon = async () => {
    try {
      const res = await validateCoupon(
        {
          code: couponCodeInput,
          orderTotal: totalPrice,
        },
        user.token
      );

      setCoupon(res.coupon);

      let discount = 0;
      if (res.coupon.discountType === "percent") {
        discount = (totalPrice * res.coupon.discountValue) / 100;
      } else if (res.coupon.discountType === "fixed") {
        discount = res.coupon.discountValue;
      }

      setDiscountAmount(discount);
      message.success("🎉 Mã giảm giá đã áp dụng!");
    } catch (err) {
      setCoupon(null);
      setDiscountAmount(0);
      message.error(err?.response?.data?.error || "Mã giảm giá không hợp lệ");
    }
  };

  const handlePay = async () => {
    try {
      const values = await form.validateFields();
      if (!user?.token) {
        return Modal.error({
          title: "Lỗi xác thực",
          content: "Bạn chưa đăng nhập. Vui lòng đăng nhập lại.",
        });
      }

      setLoading(true);

      await axios.post(
        "/api/orders",
        {
          orderItems: cartItems.map((item) => ({
            product: item.id,
            name: item.name,
            quantity: item.quantity,
            price: getEffectivePrice(item),
            image: item.image,
          })),
          shippingAddress: values,
          couponCode: coupon?.code || null,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      Modal.success({
        title: "Thanh toán thành công!",
        content: "Cảm ơn bạn đã mua hàng.",
        onOk: () => {
          clearCart();
          navigate("/");
        },
      });
    } catch (err) {
      console.error("❌ Lỗi thanh toán:", err);
      message.error("Thanh toán thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "30px 50px" }}>
      <Title level={3}>Đơn hàng của bạn</Title>

      <Button type="default" onClick={handleBack} style={{ marginBottom: 20 }}>
        ← Quay lại
      </Button>

      <Table
        dataSource={cartItems}
        columns={columns}
        rowKey="id"
        pagination={false}
      />

      <Divider />

      <Title level={4}>Thông tin giao hàng</Title>
      <Form
        form={form}
        layout="vertical"
        style={{ maxWidth: 600, marginBottom: 24 }}
      >
        <Form.Item
          label="Họ và tên"
          name="fullName"
          rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Địa chỉ"
          name="address"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Thành phố" name="city">
          <Input />
        </Form.Item>
        <Form.Item label="Quận / Huyện" name="district">
          <Input />
        </Form.Item>
        <Form.Item label="Mã bưu điện" name="postalCode">
          <Input />
        </Form.Item>
      </Form>

      <div style={{ marginTop: 20, textAlign: "right" }}>
        <Title level={4}>Tổng tiền: {totalPrice.toLocaleString()}₫</Title>

        {coupon && discountAmount > 0 && (
          <Title level={4} type="success">
            Tổng sau giảm: {finalPrice.toLocaleString()}₫
          </Title>
        )}

        <div style={{ marginBottom: 16 }}>
          <Input
            placeholder="Nhập mã giảm giá"
            value={couponCodeInput}
            onChange={(e) => setCouponCodeInput(e.target.value)}
            style={{ width: 200, marginRight: 8 }}
          />
          <Button onClick={handleApplyCoupon}>Áp dụng</Button>

          {coupon && (
            <div style={{ color: "green", marginTop: 8 }}>
              ✔ Đã áp dụng mã <strong>{coupon.code}</strong> -{" "}
              {coupon.discountType === "percent"
                ? `${coupon.discountValue}%`
                : `-${coupon.discountValue.toLocaleString()}₫`}
            </div>
          )}
        </div>

        <Button type="primary" loading={loading} onClick={handlePay}>
          Thanh toán ngay
        </Button>
      </div>
    </div>
  );
};

export default OrderPage;
