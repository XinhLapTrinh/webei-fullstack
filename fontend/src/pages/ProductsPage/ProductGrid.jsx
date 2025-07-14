// src/pages/ProductsPage/ProductGrid.jsx
import React from "react";
import { Row, Col } from "antd";
import CardComponent from "../../components/CardComponent/CardComponent";

const ProductGrid = ({ products }) => {
  return (
    <Row gutter={[24, 24]}>
      {products.map((product) => {
        return (
            <Col
          key={product._id}
          xs={12} sm={12} md={8} lg={8} xl={6}
        >
          <CardComponent 
            id={product._id}
            name={product.name}
            price={product.price}
            discount={product.discount}
            image={product.mainImage}
            rating={product.rating}
            sold={product.sold}
            flashSale={product.flashSale}
          />
        </Col>
        )
      }
        
        
      )}
    </Row>
  );
};

export default ProductGrid;
