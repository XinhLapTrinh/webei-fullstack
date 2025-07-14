// src/pages/ProductsPage/NoResults.jsx
import React from "react";
import { Empty } from "antd";

const NoResults = () => (
  <div className="flex justify-center py-20">
    <Empty description="Không tìm thấy sản phẩm phù hợp" />
  </div>
);

export default NoResults;
