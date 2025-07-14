import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Space,
  Popconfirm,
  message,
  Image,
  DatePicker,
  Checkbox,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../api/productAPI";
import UploadImageField from "../../components/UploadImageField/UploadImageField";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getProducts({
        search,
        page: currentPage,
        limit: 5,
      });

      const processedProducts = data.products.map((p) => {
        const baseUrl = "/uploads/";
        return {
          ...p,
          mainImage: p.mainImage ? baseUrl + p.mainImage : null,
          subImages: p.subImages?.map((img) => baseUrl + img) || [],
        };
      });

      setProducts(processedProducts || []);
      setTotal(data.total || 0);
    } catch (err) {
      message.error("Lỗi tải sản phẩm");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [search, currentPage]);

  const toFullUrl = (url) => {
    return url?.startsWith("http") ? url : `${API_BASE}${url}`;
  };

  const handleOpen = (record = null) => {
    form.resetFields();
    setEditing(record);

    if (record) {
      form.setFieldsValue({
        ...record,
        mainImage: record.mainImage
          ? [
              {
                uid: "-1",
                name: "main.jpg",
                status: "done",
                url: toFullUrl(record.mainImage),
              },
            ]
          : [],
        subImages:
          record.subImages?.map((url, i) => ({
            uid: `-${i + 1}`,
            name: `sub-${i + 1}.jpg`,
            status: "done",
            url: toFullUrl(url),
          })) || [],
      });

      if (record?.flashSale) {
        const flash = record.flashSale;
        const discountPercent =
          record.price && flash.price
            ? Math.round((1 - flash.price / record.price) * 100)
            : 0;

        form.setFieldsValue({
          flashSale: {
            ...flash,
            discountPercent,
            startTime: flash.startTime ? dayjs(flash.startTime) : null,
            endTime: flash.endTime ? dayjs(flash.endTime) : null,
          },
        });
      }
    }

    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteProduct(id);
      if (res?.status === 200 || res?.success || res?._id) {
        message.success("Xóa thành công");
        fetchData();
      } else {
        throw new Error("Xóa thất bại ở backend");
      }
    } catch (err) {
      console.error("Delete error:", err);
      message.error("Xóa thất bại");
    }
  };

  const handleSubmit = async (values) => {
    const formData = new FormData();

    const fields = [
      "name",
      "price",
      "discount",
      "rating",
      "category",
      "description",
      "brand"
    ];
    fields.forEach((key) => {
      if (values[key] !== undefined && values[key] !== null) {
        formData.append(key, values[key]);
      }
    });

    const mainImageFile = values.mainImage?.[0];
    if (mainImageFile?.originFileObj instanceof File) {
      formData.append("mainImage", mainImageFile.originFileObj);
    }

    if (values.subImages?.length) {
      values.subImages.forEach((file) => {
        if (file.originFileObj instanceof File) {
          formData.append("subImages", file.originFileObj);
        }
      });
    }

    if (values.specifications?.length) {
      formData.append("specifications", JSON.stringify(values.specifications));
    }

    // ✅ Flash Sale
    if (values.flashSale) {
      const flash = values.flashSale;
      let flashPrice = 0;

      if (flash.isActive && flash.discountPercent && values.price) {
        flashPrice = values.price * (1 - flash.discountPercent / 100);
      }

      formData.append(
        "flashSale",
        JSON.stringify({
          isActive: flash.isActive || false,
          discountPercent: flash.discountPercent || 0,
          price: Math.round(flashPrice),
          startTime: flash.startTime,
          endTime: flash.endTime,
        })
      );
    }

    try {
      if (editing) {
        await updateProduct(editing._id, formData);
        message.success("Cập nhật sản phẩm thành công");
      } else {
        await createProduct(formData);
        message.success("Thêm sản phẩm thành công");
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      message.error("Thao tác thất bại");
    }
  };

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "mainImage",
      render: (url) => (
        <Image
          src={toFullUrl(url)}
          width={60}
          height={60}
          style={{ objectFit: "cover", borderRadius: 4 }}
        />
      ),
    },
    { title: "Tên", dataIndex: "name" },
    {
      title: "Giá",
      dataIndex: "price",
      render: (v) => v?.toLocaleString("vi-VN") + "₫",
    },
    {
      title: "Giảm giá",
      dataIndex: "discount",
      render: (v) => `${v || 0}%`,
    },
    { title: "Danh mục", dataIndex: "category" },
    {
      title: "Thao tác",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleOpen(record)} />
          <Popconfirm
            title="Xác nhận xóa?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>Quản lý sản phẩm</h2>

      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm kiếm sản phẩm..."
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          allowClear
          style={{ width: 300 }}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => handleOpen()}
        >
          Thêm sản phẩm
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={products}
        rowKey="_id"
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: 5,
          total: total,
          onChange: (page) => setCurrentPage(page),
        }}
      />

      <Modal
        open={modalOpen}
        title={editing ? "Sửa sản phẩm" : "Thêm sản phẩm"}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        okText="Lưu"
        destroyOnClose
        width={800}
      >
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="brand" label="Thương hiệu" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Giá" rules={[{ required: true }]}>
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="discount" label="Giảm giá (%)">
            <InputNumber min={0} max={100} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name={["flashSale", "discountPercent"]} label="Giảm giá Flash Sale (%)">
            <InputNumber min={0} max={100} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="rating" label="Đánh giá">
            <InputNumber min={0} max={5} step={0.1} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="category" label="Danh mục">
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} />
          </Form.Item>

          {/* ⚡ Flash Sale */}
          <Form.Item name={["flashSale", "isActive"]} valuePropName="checked">
            <Checkbox>Kích hoạt Flash Sale</Checkbox>
          </Form.Item>
          <Form.Item name={["flashSale", "startTime"]} label="Thời gian bắt đầu">
            <DatePicker showTime style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name={["flashSale", "endTime"]} label="Thời gian kết thúc">
            <DatePicker showTime style={{ width: "100%" }} />
          </Form.Item>

          <Form.List name="specifications">
            {(fields, { add, remove }) => (
              <div>
                <label>
                  <b>Thông số kỹ thuật</b>
                </label>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{ display: "flex", marginBottom: 8 }}
                    align="start"
                  >
                    <Form.Item
                      {...restField}
                      name={[name, "name"]}
                      rules={[{ required: true, message: "Tên thông số?" }]}
                    >
                      <Input placeholder="Tên (e.g. CPU, Tác giả...)" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "value"]}
                      rules={[{ required: true, message: "Giá trị?" }]}
                    >
                      <Input placeholder="Giá trị (e.g. Intel i5, Nguyễn Nhật Ánh)" />
                    </Form.Item>
                    <Button danger onClick={() => remove(name)}>
                      Xoá
                    </Button>
                  </Space>
                ))}
                <Button type="dashed" onClick={() => add()} block>
                  + Thêm thông số
                </Button>
              </div>
            )}
          </Form.List>

          <Form.Item name="mainImage" label="Ảnh chính">
            <UploadImageField max={1} />
          </Form.Item>
          <Form.Item name="subImages" label="Ảnh phụ">
            <UploadImageField max={10} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductManager;
