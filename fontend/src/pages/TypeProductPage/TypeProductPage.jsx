// src/pages/TypeProductPage/TypeProductPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Row, Col } from "antd";
import { getProducts } from "../../api/productAPI";
import CardComponent from "../../components/CardComponent/CardComponent";
import styled from "styled-components";

const SectionWrapper = styled.div`
  padding: 40px 0;
`;

const TypeProductPage = () => {
  const { category } = useParams(); // Lấy category từ URL
  
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);


  useEffect(() => {
    getProducts({limit: 1000}).then((data) => {
      setProducts(data.products || []);
    });
  }, []);

  useEffect(() => {
  const decodedCategory = decodeURIComponent(category);
  const matched = products.filter(
    (product) => product.category === decodedCategory
  );
  setFilteredProducts(matched);
}, [category, products]);


  return (
    <SectionWrapper>
      <h2>Danh mục: {category}</h2>
      <Row gutter={[16, 16]}>
        {filteredProducts.map((product) => (
          <Col key={product._id} xs={12} sm={8} md={6} lg={6}>
            <CardComponent
              id={product._id}
              name={product.name}
              image={product.mainImage}
              price={product.price}
              discount={product.discount}
              rating={product.rating}
              sold={product.sold}
            />
          </Col>
        ))}
      </Row>
    </SectionWrapper>
  );
};

export default TypeProductPage;
