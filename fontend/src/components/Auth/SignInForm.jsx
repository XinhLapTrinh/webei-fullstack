// src/components/Auth/SignInForm.jsx
import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { loginWithGoogle, loginUser } from "../../api/authAPI";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

const SignInForm = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const { login, setAuthData } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const data = await loginUser(values);
      login(data);
      message.success("Đăng nhập thành công!");
      onSuccess(); // đóng modal
      // Điều hướng theo quyền
      if (data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      message.error(err.response?.data?.message || "Đăng nhập thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
  try {
    const token = credentialResponse.credential;
    const data = await loginWithGoogle(token); // giống loginUser
    login(data); // xử lý giống local login
    message.success("Đăng nhập Google thành công");

    onSuccess(); // đóng modal

    if (data.user?.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  } catch (err) {
    message.error("Đăng nhập Google thất bại");
  }
};


  return (
    <Form
      layout="vertical"
      onFinish={onFinish}
      style={{ maxWidth: 350, margin: "0 auto" }}
    >
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
        <Input.Password size="large" placeholder="Nhập mật khẩu" />
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
          Đăng nhập
        </Button>
      </Form.Item>
      <div style={{ textAlign: "center", marginTop: 20 }}>
        <GoogleLogin onSuccess={handleGoogleLogin} onError={() => message.error("Đăng nhập thất bại")} />
      </div>
    </Form>
  

  );
};

export default SignInForm;
