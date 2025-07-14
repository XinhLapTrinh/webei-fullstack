import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Tabs, Row, Col } from "antd";
import styled from "styled-components";
import ProductImageGallery from "./ProductImageGallery";
import ProductInfo from "./ProductInfo";
import ProductDescription from "./ProductDescription";
import ProductReviews from "./ProductReviews";
import ProductSpecifications from "./ProductSpecifications";
import RelatedProducts from "./RelatedProducts";
import ReviewForm from "./ReviewForm";
import { getProductById, getProducts } from "../../api/productAPI";

const PageWrapper = styled.div`
  padding: 24px 5vw;
  background-color: #f5f5f5;
  min-height: 100vh;
`;

const TopSection = styled.div`
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
`;

const ContentSection = styled.div`
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const ProductDetailsComponent = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);

  const [page, setPage] = useState(1);
  const reviewsPerPage = 3;



  const fetchProduct = async () => {
    try {
      const res = await getProductById(id, { page, limit: reviewsPerPage });
      setProduct(res);
    } catch (err) {
      console.error("Lỗi khi tải sản phẩm:", err);
    }
  };

  useEffect(() => {
      const fetchAllProducts = async () => {
        try {
          const data = await getProducts({ noPagination: true });
          setProducts(data.products || []);
        } catch (err) {
          console.error("Lỗi khi tải danh sách sản phẩm:", err);
        }
      };

      fetchProduct();
      fetchAllProducts();
    }, [id, page]);



  if (!product) return <div style={{ padding: 32 }}>Đang tải sản phẩm...</div>;

  return (
    <PageWrapper>
      <TopSection>
        <Row gutter={[32, 32]}>
          <Col xs={24} md={10}>
            <ProductImageGallery product={product} />
          </Col>
          <Col xs={24} md={14}>
            <ProductInfo product={product} />
            <ProductSpecifications specifications={product.specifications} />
          </Col>
        </Row>
      </TopSection>

      <ContentSection>
        <Tabs defaultActiveKey="1" size="large" tabBarGutter={32}>
          <Tabs.TabPane tab="Mô tả sản phẩm" key="1">
            <ProductDescription product={product} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Đánh giá" key="2">
            {/* Form gửi đánh giá */}
            <ReviewForm
              productId={product._id}
              existingReviews={product.reviews}
              onSuccess={() => {
                setPage(1); // reset về trang đầu
                fetchProduct(); // reload lại
              }}
            />

            {/* Hiển thị danh sách đánh giá */}
            <ProductReviews
              reviews={product.reviews}
              ratingAverage={product.rating}
              totalReviews={product.numReviews}
              currentPage={page}
              onPageChange={setPage}
            />
          </Tabs.TabPane>
        </Tabs>
      </ContentSection>

      <div style={{ marginTop: 32 }}>
        <RelatedProducts
          products={products}
          category={product.category}
        />
      </div>
    </PageWrapper>
  );
};

export default ProductDetailsComponent;
