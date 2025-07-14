import React, { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Typography,
  Button,
  Modal,
  Select,
  Input,
  DatePicker,
  Spin,
  message,
} from "antd";
import axios from "axios";
import moment from "moment";
import { useAuth } from "../../context/AuthContext";

const { Title } = Typography;
const { Option } = Select;

const statusOptions = ["Chờ xử lý", "Đang vận chuyển", "Đã giao", "Đã hủy"];

const ShippingManager = () => {
  const [shippings, setShippings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingShipping, setEditingShipping] = useState(null);
  const [formValues, setFormValues] = useState({});
  const { user } = useAuth();

  const fetchShippings = async () => {
    try {
      const res = await axios.get("/api/shippings", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setShippings(res.data);
    } catch (err) {
      message.error("Không thể lấy danh sách vận chuyển");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShippings();
  }, []);

  const handleUpdateClick = (record) => {
    setEditingShipping(record);
    setFormValues({
      status: record.status,
      carrier: record.carrier,
      trackingNumber: record.trackingNumber,
      estimatedDelivery: record.estimatedDelivery
        ? moment(record.estimatedDelivery)
        : null,
    });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `/api/shippings/${editingShipping._id}`,
        {
          ...formValues,
          estimatedDelivery: formValues.estimatedDelivery?.toISOString(),
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      message.success("Cập nhật thành công");
      setEditingShipping(null);
      fetchShippings();
    } catch (err) {
      message.error("Cập nhật thất bại");
    }
  };

  const columns = [
    {
      title: "Người đặt",
      dataIndex: ["order", "user"],
      render: (user) => user?.name || "Không rõ",
    },
    {
      title: "Tổng tiền",
      dataIndex: ["order", "totalPrice"],
      render: (price) => price?.toLocaleString() + "₫",
    },
    {
      title: "Địa chỉ",
      dataIndex: ["order", "shippingAddress"],
      render: (addr) =>
        addr
          ? `${addr.fullName}, ${addr.address}, ${addr.district}, ${addr.city}`
          : "Không rõ",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => {
        let color = "gray";
        if (status === "Đã giao") color = "green";
        else if (status === "Đang vận chuyển") color = "blue";
        else if (status === "Đã hủy") color = "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Đơn vị",
      dataIndex: "carrier",
    },
    {
      title: "Mã vận đơn",
      dataIndex: "trackingNumber",
    },
    {
      title: "Ngày giao dự kiến",
      dataIndex: "estimatedDelivery",
      render: (date) =>
        date ? moment(date).format("DD/MM/YYYY") : "Chưa xác định",
    },
    {
      title: "Cập nhật",
      render: (_, record) => (
        <Button type="link" onClick={() => handleUpdateClick(record)}>
          Cập nhật
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Quản lý vận chuyển</Title>
      {loading ? (
        <Spin />
      ) : (
        <Table
          columns={columns}
          dataSource={shippings}
          rowKey="_id"
          scroll={{ x: true }}
        />
      )}

      <Modal
        open={!!editingShipping}
        title="Cập nhật vận chuyển"
        onCancel={() => setEditingShipping(null)}
        onOk={handleUpdate}
        okText="Lưu"
        cancelText="Hủy"
      >
        <div style={{ marginBottom: 10 }}>
          <label>Trạng thái:</label>
          <Select
            value={formValues.status}
            onChange={(val) => setFormValues({ ...formValues, status: val })}
            style={{ width: "100%" }}
          >
            {statusOptions.map((status) => (
              <Option key={status} value={status}>
                {status}
              </Option>
            ))}
          </Select>
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Đơn vị vận chuyển:</label>
          <Input
            value={formValues.carrier}
            onChange={(e) =>
              setFormValues({ ...formValues, carrier: e.target.value })
            }
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Mã vận đơn:</label>
          <Input
            value={formValues.trackingNumber}
            onChange={(e) =>
              setFormValues({ ...formValues, trackingNumber: e.target.value })
            }
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Ngày giao dự kiến:</label>
          <DatePicker
            value={formValues.estimatedDelivery}
            onChange={(date) =>
              setFormValues({ ...formValues, estimatedDelivery: date })
            }
            style={{ width: "100%" }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default ShippingManager;
