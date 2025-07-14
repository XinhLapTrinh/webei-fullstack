import React, { useState } from "react";
import { Form, Input, Button, Typography, message, Card } from "antd";
import styled from "styled-components";
import { registerUser } from "../../api/authAPI";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  max-width: 400px;
  margin: 80px auto;
`;

const StyledCard = styled(Card)`
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border-radius: 12px;
`;

const SignUpPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await registerUser(values);
      message.success("Đăng ký thành công. Vui lòng đăng nhập.");
      navigate("/login");
    } catch (err) {
      message.error(err?.response?.data?.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <StyledCard title="Tạo tài khoản mới">
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Họ tên"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Vui lòng nhập email" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
            >
              Đăng ký
            </Button>
          </Form.Item>
        </Form>
        <Typography.Text>
          Đã có tài khoản? <a href="/login">Đăng nhập</a>
        </Typography.Text>
      </StyledCard>
    </Container>
  );
};

export default SignUpPage;
