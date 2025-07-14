// src/pages/ProductsPage/SortBar.jsx
import React from "react";
import { Select } from "antd";

const SortBar = ({ sort, onChange }) => {
  return (
    <div className="flex justify-between items-center mb-3">
      <h2 className="text-xl font-semibold">Sản phẩm</h2>
      <Select
        value={sort}
        style={{ width: 180 }}
        onChange={onChange}
        options={[
          { value: "newest", label: "Mới nhất" },
          { value: "price_asc", label: "Giá tăng dần" },
          { value: "price_desc", label: "Giá giảm dần" },
          { value: "name_asc", label: "Tên A-Z" },
          { value: "name_desc", label: "Tên Z-A" },
        ]}
      />
    </div>
  );
};

export default SortBar;
