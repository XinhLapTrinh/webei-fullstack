import React, { useEffect, useState } from "react";
import { Typography, Radio, Space, Spin, Divider, Slider } from "antd";
import { getCategories } from "../../api/productAPI";

const { Title } = Typography;

const FilterSidebar = ({ selectedCategory, priceRange, onCategoryChange, onPriceChange }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [internalPrice, setInternalPrice] = useState([0, 200000000]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        // Nếu là response.data = ["Laptop", "Phone"]
        console.log("📦 Danh mục trả về từ API:", response.data);
        setCategories(response || []);
      } catch (error) {
        console.error("❌ Lỗi khi lấy danh mục:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

 useEffect(() => {
  if (priceRange && Array.isArray(priceRange)) {
    setInternalPrice(priceRange);
  }
}, [priceRange]);


  const handleAfterChange = ([min, max]) => {
  onPriceChange({ price_gte: min, price_lte: max });
};

  if (loading) return <Spin size="small" />;

  return (
    <div style={{ padding: "16px" }}>
      <Title level={5}>Danh mục</Title>
      <Radio.Group
        onChange={(e) => onCategoryChange(e.target.value)}
        value={selectedCategory}
      >
        <Space direction="vertical">
          <Radio value="">Tất cả</Radio>
          {categories.length > 0 &&
            categories.map((cat) => (
              <Radio key={cat} value={cat}>
                {cat}
              </Radio>
            ))}
        </Space>
      </Radio.Group>

      <Divider />

      <Title level={5}>Khoảng giá</Title>
      <Slider
        range
        min={0}
        max={20000000}
        step={500000}
        value={internalPrice}
        onChange={setInternalPrice}
        onAfterChange={handleAfterChange}
        tooltip={{ formatter: (value) => `${value.toLocaleString()}₫` }}
      />
      <div>
        Từ{" "}
        <strong>{internalPrice[0].toLocaleString()}₫</strong> đến{" "}
        <strong>{internalPrice[1].toLocaleString()}₫</strong>
      </div>
    </div>
  );
};

export default FilterSidebar;
