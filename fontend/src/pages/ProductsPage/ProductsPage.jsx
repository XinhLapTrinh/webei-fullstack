import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Row, Col, Pagination as AntdPagination } from "antd";

import { getProducts } from "../../api/productAPI";
import FilterSidebar from "./FilterSidebar";
import SortBar from "./SortBar";
import TagFilterBar from "./TagFilterBar";
import ProductGrid from "./ProductGrid";
import NoResults from "./NoResults";

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);

  const page = parseInt(searchParams.get("page")) || 1;
  const keyword = searchParams.get("keyword") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "newest";
  const price_gte = Number(searchParams.get("price_gte")) || 0;
  const price_lte = Number(searchParams.get("price_lte")) || 200000000;
  const limit = 8;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts({
          keyword,
          category,
          sort,
          price_gte,
          price_lte,
          page,
          limit,
        });
        console.log("👉 Products API result:", res);
        console.log("📤 Gửi lên API:", {
        keyword,
        category,
        sort,
        page,
        limit,
        price_gte,
        price_lte,
      });
        setProducts(res.products || []);
        setTotal(res.total || 0);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
        
        setProducts([]);
        setTotal(0);
      }
    };
    fetchProducts();
  }, [keyword, category, sort, page, price_gte, price_lte]);

  // const handleFilterChange = (updatedValues) => {
  //   const newParams = new URLSearchParams(searchParams);
  //   Object.entries(updatedValues).forEach(([key, value]) => {
  //     if (value) {
  //       newParams.set(key, value);
  //     } else {
  //       newParams.delete(key);
  //     }
  //   });
  //   // reset page khi lọc mới
  //   if (!updatedValues.page) newParams.set("page", "1");
  //   setSearchParams(newParams);
  // };

  const handleFilterChange = (updatedValues) => {
  const newParams = new URLSearchParams(searchParams);

  Object.entries(updatedValues).forEach(([key, value]) => {
    if (value || value === 0) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
  });

  // Reset lại trang nếu filter (không phải bấm trang)
  if (!updatedValues.page) {
    newParams.set("page", "1");
  }

  setSearchParams(newParams);
};

  return (
    <div className="container mx-auto px-4 py-6">
      <Row gutter={[16, 16]}>
        {/* Sidebar bộ lọc */}
        <Col xs={24} md={6}>
          <FilterSidebar
            selectedCategory={category}
            onCategoryChange={(val) => handleFilterChange({ category: val })}
            onPriceChange={(vals) => handleFilterChange(vals)}
          />
        </Col>
        {/* Khu vực sản phẩm */}
        <Col xs={24} md={18}>
          <SortBar
            sort={sort}
            onChange={(val) => handleFilterChange({ sort: val })}
          />

          <TagFilterBar
            keyword={keyword}
            category={category}
            onClear={() => handleFilterChange({ keyword: "", category: "" })}
          />

          {products.length === 0 ? (
            <NoResults />
          ) : (
            <>
              <p className="mb-3 text-gray-500">{`Tìm thấy ${total} sản phẩm`}</p>
              <ProductGrid products={products} />

              <div className="mt-6 flex justify-center">
                <AntdPagination
                  current={page}
                  pageSize={limit}
                  total={total}
                  onChange={(p) => handleFilterChange({ page: p })}
                />
              </div>
            </>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ProductsPage;
