import React, { useMemo } from "react";
import { Card, Typography, Divider, Checkbox, Radio, Button } from "antd";
import TypeProduct from "../TypeProduct/TypeProduct";

const { Title } = Typography;

// Hàm chuyển mảng giá thành key cho radio (giúp chọn đúng radio khi reload)
const getPriceKey = ([min, max]) => {
  if (min === 0 && max === 2000000) return "below2";
  if (min === 2000000 && max === 5000000) return "2to5";
  if (min === 5000000 && max === 10000000) return "5to10";
  if (min === 10000000 && max >= 100000000) return "above10";
  return "all";
};

const NavbarComponent = ({
  products,
  selectedCategories,
  setSelectedCategories,
  priceFilter,
  setPriceFilter,
}) => {
  // ✅ Chuyển useMemo vào bên trong component
  const categories = useMemo(() => {
    const set = new Set();
    products.forEach((p) => p.category && set.add(p.category));
    return Array.from(set);
  }, [products]);

  return (
    <Card bordered style={{ borderRadius: 10 }}>
      <Title level={5}>Danh mục</Title>
      <Divider style={{ margin: "8px 0" }} />

      {/* <strong>Danh mục:</strong> */}
      {
        categories.map((categorie)=> (
          <TypeProduct key={categorie} name={categorie} slug={categorie.toLowerCase().replace(/\s+/g, "-")}/>
        ))
      }
      <div style={{ margin: "16px 0 12px" }}>
        <strong>Lọc theo giá:</strong>
        <Radio.Group
          value={getPriceKey(priceFilter)}
          onChange={(e) => {
            const val = e.target.value;
            switch (val) {
              case "below2":
                setPriceFilter([0, 2000000]);
                break;
              case "2to5":
                setPriceFilter([2000000, 5000000]);
                break;
              case "5to10":
                setPriceFilter([5000000, 10000000]);
                break;
              case "above10":
                setPriceFilter([10000000, 100000000]);
                break;
              default:
                setPriceFilter([0, 100000000]);
            }
          }}
          style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}
        >
          <Radio value="all">Tất cả</Radio>
          <Radio value="below2">Dưới 2 triệu</Radio>
          <Radio value="2to5">2 - 5 triệu</Radio>
          <Radio value="5to10">5 - 10 triệu</Radio>
          <Radio value="above10">Trên 10 triệu</Radio>
        </Radio.Group>
      </div>
    </Card>
  );
};

export default NavbarComponent;
