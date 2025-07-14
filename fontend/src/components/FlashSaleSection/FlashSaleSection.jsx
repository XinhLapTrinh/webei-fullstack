// src/components/FlashSaleSection/FlashSaleSection.jsx
import React from "react";
import { Row, Col, Statistic } from "antd";
import CardComponent from "../CardComponent/CardComponent";
import { FlashSaleTitle, FlashSaleWrapper } from './style'


const FlashSaleSection = ({ products }) => {
  const flashEndTime = products?.[0]?.flashSale?.endTime;

  return (
    <FlashSaleWrapper>
      <FlashSaleTitle>⚡ Flash Sale - Giảm giá sốc!</FlashSaleTitle>

      {flashEndTime && (
        <Statistic.Countdown
          value={new Date(flashEndTime)}
          format="HH:mm:ss"
          style={{
            fontSize: "36px",
            textAlign: "center",
            marginBottom: "20px",
            color: "#fff",
          }}
        />
      )}

      <Row gutter={[16, 16]} justify="center">
        {products.map((product) => (
          <Col key={product._id} xs={12} sm={8} md={6}>
            <CardComponent 
              id={product._id}
              name={product.name}
              image={product.mainImage}
              sold={product.sold}
              price={product.price}
              rating={product.rating}
              discount={product.discount}
              flashSale={product.flashSale}
            />
          </Col>
        ))}
      </Row>
    </FlashSaleWrapper>
  );
};

export default FlashSaleSection;
