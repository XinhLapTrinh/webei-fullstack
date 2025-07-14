// src/pages/ProductsPage/TagFilterBar.jsx
import React from "react";
import { Tag, Button } from "antd";

const TagFilterBar = ({ keyword, category, onClear }) => {
  if (!keyword && !category) return null;

  return (
    <div className="mb-3 flex items-center gap-2 flex-wrap">
      {keyword && <Tag color="blue">Từ khóa: {keyword}</Tag>}
      {category && <Tag color="green">Danh mục: {category}</Tag>}
      <Button type="link" danger size="small" onClick={onClear}>
        Xóa bộ lọc
      </Button>
    </div>
  );
};

export default TagFilterBar;
