import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Table,
  Button,
  Form,
  Input,
  DatePicker,
  InputNumber,
  Modal,
  message,
} from "antd";
import dayjs from "dayjs";
import {
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from "../../api/couponAPI";

const CouponManager = () => {
  const { user } = useAuth();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [form] = Form.useForm();

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const data = await getAllCoupons(user.token);
      setCoupons(data);
    } catch (err) {
      message.error("Lỗi khi lấy danh sách mã giảm giá");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) fetchCoupons();
  }, [user]);

  const onFinish = async (values) => {
    try {
      const payload = {
        code: values.code,
        discountType: "percent",
        discountValue: values.discountPercent,
        maxUsage: values.usageLimit,
        expiresAt: values.expiryDate.toISOString(),
      };

      if (editingCoupon) {
        await updateCoupon(editingCoupon._id, payload, user.token);
        message.success("Cập nhật thành công");
      } else {
        await createCoupon(payload, user.token);
        message.success("Tạo mã thành công");
      }

      form.resetFields();
      setEditingCoupon(null);
      fetchCoupons();
    } catch (err) {
      message.error("Lỗi xử lý mã giảm giá");
    }
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Xoá mã giảm giá?",
      onOk: async () => {
        try {
          await deleteCoupon(id, user.token);
          message.success("Đã xoá mã");
          fetchCoupons();
        } catch {
          message.error("Xoá thất bại");
        }
      },
    });
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    form.setFieldsValue({
      code: coupon.code,
      discountPercent: coupon.discountValue,
      usageLimit: coupon.maxUsage,
      expiryDate: dayjs(coupon.expiresAt),
    });
  };

  const columns = [
    { title: "Mã", dataIndex: "code" },
    { title: "Giảm (%)", dataIndex: "discountValue" },
    { title: "Số lần dùng", dataIndex: "maxUsage" },
    {
      title: "Hết hạn",
      dataIndex: "expiresAt",
      render: (d) => dayjs(d).format("DD/MM/YYYY"),
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <>
          <Button onClick={() => handleEdit(record)} style={{ marginRight: 8 }}>
            Sửa
          </Button>
          <Button danger onClick={() => handleDelete(record._id)}>
            Xoá
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 30 }}>
      <h2>Quản lý mã giảm giá</h2>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        style={{ maxWidth: 500, marginBottom: 30 }}
      >
        <Form.Item
          name="code"
          label="Mã giảm giá"
          rules={[{ required: true, message: "Nhập mã giảm giá" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="discountPercent"
          label="Phần trăm giảm (%)"
          rules={[{ required: true, message: "Nhập phần trăm giảm" }]}
        >
          <InputNumber min={1} max={100} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="usageLimit"
          label="Giới hạn số lần sử dụng"
          rules={[{ required: true, message: "Nhập số lần dùng" }]}
        >
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="expiryDate"
          label="Ngày hết hạn"
          rules={[{ required: true, message: "Chọn ngày hết hạn" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {editingCoupon ? "Cập nhật" : "Tạo mã"}
          </Button>
          {editingCoupon && (
            <Button
              onClick={() => {
                setEditingCoupon(null);
                form.resetFields();
              }}
              style={{ marginLeft: 8 }}
            >
              Huỷ
            </Button>
          )}
        </Form.Item>
      </Form>

      <Table
        dataSource={coupons}
        columns={columns}
        rowKey="_id"
        loading={loading}
      />
    </div>
  );
};

export default CouponManager;
