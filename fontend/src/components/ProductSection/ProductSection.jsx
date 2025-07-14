// src/components/ProductSection/ProductSection.jsx
import React from "react";
import { Row, Col } from "antd";
import styled from "styled-components";
import CardComponent from "../CardComponent/CardComponent";

const SectionWrapper = styled.div`
  margin: 20px 0;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
`;

const ProductSection = ({ title, products }) => {
  return (
    <SectionWrapper>
      <SectionTitle>{title}</SectionTitle>
      <Row gutter={[16, 16]} >
        {products.map((product) => (
          <Col key={product._id} xs={12} sm={8} md={6} lg={6}>
            <CardComponent 
                id={product._id}
                name={product.name}
                image={product.mainImage}
                sold={product.sold}
                price={product.price}
                rating={product.rating}
                discount={product.discount}
            />
          </Col>
        ))}
      </Row>
    </SectionWrapper>
  );
};

export default ProductSection;
