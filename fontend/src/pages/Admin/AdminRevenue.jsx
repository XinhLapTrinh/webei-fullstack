import React, { useEffect, useState } from "react";
import { Card, Typography, Spin } from "antd";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";

const { Title } = Typography;

const AdminRevenue = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("/api/orders/stats");
        const formatted = res.data.map((item) => ({
          name: `${item._id.month}/${item._id.year}`,
          revenue: item.totalRevenue,
        }));
        setData(formatted);
      } catch (err) {
        console.error("Lỗi tải thống kê:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <Card style={{ margin: 20 }}>
      <Title level={3}>Thống kê doanh thu</Title>
      {loading ? (
        <Spin />
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => `${value.toLocaleString()}₫`} />
            <Bar dataKey="revenue" fill="#1890ff" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
};

export default AdminRevenue;
