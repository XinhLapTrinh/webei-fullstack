import React from "react";
import { Col, Row, Rate, Typography } from "antd";
import styled from "styled-components";
import CardComponent  from "../CardComponent/CardComponent"
const { Title, Text } = Typography;

const RelatedWrapper = styled.div`
  margin-top: 32px;
  background: #fff;
  padding: 24px;
  border-radius: 8px;
`;



const RelatedProducts = ({products, category}) => {
    // console.log("chiều dài mảng", products.length)
    
    
  return (
    <RelatedWrapper>
      <Title level={4}>Sản phẩm liên quan</Title>
      <Row gutter={[16, 16]}>
        { 
          (products.filter((item) => item.category === category)).map((item)=> 
          <Col key={item._id} xs={12} sm={8} md={6} lg={6}>
            <CardComponent 
              id={item._id}
              name={item.name}
              rating={item.rating}
              image={item.mainImage}
              sold={item.sold}
              price={item.price}
              discount={item.discount}
            />
          </Col>
          )
        }
         
      </Row>
    </RelatedWrapper>
  );
};

export default RelatedProducts;
