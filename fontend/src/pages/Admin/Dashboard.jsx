// src/pages/Admin/Dashboard.jsx
import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Spin,
  Row,
  Col,
  Statistic,
  message,
} from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import {
  DollarCircleOutlined,
  ShoppingCartOutlined,
  LineChartOutlined,
} from "@ant-design/icons";

const { Title } = Typography;
const EXCHANGE_RATE = 24000;

const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const totalRevenue =
    stats.reduce((sum, item) => sum + item.revenue, 0) / EXCHANGE_RATE;
  const totalOrders = stats.reduce((sum, item) => sum + item.count, 0);

  const formatUSD = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user || !user.token) {
        return message.error("Bạn chưa đăng nhập");
      }

      try {
        const res = await axios.get("/api/orders/stats", {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        const formatted = res.data.map((item) => ({
          name: `${item._id.month}/${item._id.year}`,
          revenue: item.totalRevenue,
          count: item.count,
        }));

        setStats(formatted);
      } catch (err) {
        console.error("Lỗi khi tải thống kê:", err);
        message.error("Không thể tải dữ liệu thống kê");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>📊 Bảng điều khiển</Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Card bordered={false}>
            <Statistic
              title="Tổng doanh thu"
              value={totalRevenue}
              prefix={<DollarCircleOutlined />}
              valueStyle={{ color: "#3f8600" }}
              precision={2}
              suffix="USD"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card bordered={false}>
            <Statistic
              title="Tổng đơn hàng"
              value={totalOrders}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card bordered={false}>
            <Statistic
              title="Tháng hoạt động"
              value={stats.length}
              prefix={<LineChartOutlined />}
              valueStyle={{ color: "#fa541c" }}
              suffix="tháng"
            />
          </Card>
        </Col>
      </Row>

      <Card
        title="Biểu đồ doanh thu theo tháng (USD)"
        style={{ marginTop: 24 }}
        bordered={false}
      >
        {loading ? (
          <Spin />
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={stats.map((item) => ({
                ...item,
                revenueUSD: item.revenue / EXCHANGE_RATE,
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(value) =>
                  formatUSD(parseFloat(value.toFixed(2)))
                }
              />
              <Bar dataKey="revenueUSD" fill="#1890ff" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
