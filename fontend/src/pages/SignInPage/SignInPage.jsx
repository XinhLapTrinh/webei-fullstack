
import React, { useState } from "react";
import { Form, Input, Button, Typography, message, Card } from "antd";
import styled from "styled-components";
import { loginUser } from "../../api/authAPI";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Container = styled.div`
  max-width: 400px;
  margin: 80px auto;
`;

const StyledCard = styled(Card)`
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border-radius: 12px;
`;

const SignInPage = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const data = await loginUser(values); // { user, token }
      login(data); // ✅ truyền toàn bộ user có token bên trong
      message.success("Đăng nhập thành công");
      navigate("/");
    } catch (err) {
      message.error(err?.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <StyledCard title="Đăng nhập tài khoản">
        <Form layout="vertical" onFinish={onFinish}>
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
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
        <Typography.Text>
          Bạn chưa có tài khoản? <a href="/register">Đăng ký</a>
        </Typography.Text>
      </StyledCard>
    </Container>
  );
};

export default SignInPage;
