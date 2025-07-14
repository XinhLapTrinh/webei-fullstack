// src/components/CategoryCarousel/CategoryCarousel.jsx
import React from "react";
import { Row, Col } from "antd";
import { Link } from "react-router-dom"; // Thêm Link từ react-router-dom
import styled from "styled-components";

const CategoryCard = styled.div`
  background: #fff;
  padding: 4px;
  text-align: center;
  border-radius: 8px;
  margin: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
  }
`;

const CategoryCarousel = ({ categories }) => {
  return (
    <Row gutter={[24, 24]} style={{ overflowX: "auto", whiteSpace: "nowrap", justifyContent:'center' }}>
      {categories.map((category, index) => (
        <Col key={index} style={{ display: "inline-block" }}>
          <Link to={`/type/${encodeURIComponent(category)}`}>
            <CategoryCard>
              <span>{category}</span>
            </CategoryCard>
          </Link>


        </Col>
      ))}
    </Row>
  );
};

export default CategoryCarousel;
