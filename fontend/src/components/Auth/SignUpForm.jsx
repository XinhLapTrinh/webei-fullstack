// src/components/Auth/SignUpForm.jsx
import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { registerUser } from "../../api/authAPI";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const SignUpForm = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const data = await registerUser(values);
      login(data);
      message.success("Đăng ký thành công!");
      onSuccess();
      navigate("/");
    } catch (err) {
      message.error(err.response?.data?.message || "Đăng ký thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      layout="vertical"
      onFinish={onFinish}
      style={{ maxWidth: 350, margin: "0 auto" }}
    >
      <Form.Item
        label="Họ tên"
        name="name"
        rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
      >
        <Input size="large" placeholder="Nhập họ tên" />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: "Vui lòng nhập email!" },
          { type: "email", message: "Email không hợp lệ!" },
        ]}
      >
        <Input size="large" placeholder="Nhập email" />
      </Form.Item>

      <Form.Item
        label="Mật khẩu"
        name="password"
        rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
      >
        <Input.Password size="large" placeholder="Tạo mật khẩu" />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          block
          size="large"
          loading={loading}
          style={{ borderRadius: 4 }}
        >
          Đăng ký
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SignUpForm;
