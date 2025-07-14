import React, { useState, useEffect } from "react";
import { Input, Row, Col, Card, Empty, Spin } from "antd";
import { debounce } from "lodash";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../../api/productAPI"; // <-- import API thật

const SearchLiveComponent = () => {
  const [value, setValue] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = debounce(async (keyword) => {
    try {
      setLoading(true);
      const res = await getProducts(keyword); // Gọi backend: /api/products?search=...
      const data = res.products || res;
      setResults(data);
    } catch (err) {
      console.error("❌ Lỗi tìm kiếm:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, 400);

  useEffect(() => {
    if (value.trim()) {
      handleSearch(value.trim());
    } else {
      setResults([]);
    }

    return () => handleSearch.cancel();
  }, [value]);

  const handleClickProduct = (id) => {
    navigate(`/product-details/${id}`);
  };

  return (
    <div style={{ padding: 20 }}>
      <Input
        size="large"
        placeholder="Tìm kiếm sản phẩm..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        allowClear
      />

      <div style={{ marginTop: 24 }}>
        {loading ? (
          <div style={{ textAlign: "center", marginTop: 60 }}>
            <Spin size="large" tip="Đang tìm kiếm..." />
          </div>
        ) : results.length === 0 ? (
          value.trim() !== "" ? (
            <Empty description="Không tìm thấy sản phẩm phù hợp" />
          ) : null
        ) : (
          <Row gutter={[16, 16]}>
            {results.map((product) => (
              <Col xs={24} sm={12} md={8} lg={6} key={product._id}>
                <Card
                  hoverable
                  onClick={() => handleClickProduct(product._id)}
                  cover={
                    <img
                      alt={product.name}
                      src={`http://localhost:5000/uploads/${product.images?.[0]}`}
                      style={{ height: 200, objectFit: "cover" }}
                    />
                  }
                >
                  <Card.Meta
                    title={product.name}
                    description={`Giá: ${product.price.toLocaleString("vi-VN")} ₫`}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
};

export default SearchLiveComponent;
