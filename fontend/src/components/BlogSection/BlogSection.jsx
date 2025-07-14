// src/components/BlogSection/BlogSection.jsx
import React from "react";
import { Row, Col } from "antd";
import styled from "styled-components";

const BlogWrapper = styled.div`
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const BlogCard = styled.div`
  background: #fff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
`;

const BlogSection = () => {
  return (
    <BlogWrapper>
      <h2>Blog & Tin tức</h2>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <BlogCard>
            <h4>Bài viết 1</h4>
            <p>Mẹo mua sắm thông minh...</p>
          </BlogCard>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <BlogCard>
            <h4>Bài viết 2</h4>
            <p>Khám phá sản phẩm hot nhất...</p>
          </BlogCard>
        </Col>
      </Row>
    </BlogWrapper>
  );
};

export default BlogSection;
