import { Col, Row } from "antd"
import React from "react"
import CardComponent from "../CardComponent/CardComponent"
import styled from "styled-components";

const ReviewestProduct = ({products, title}) => {

    const ReviewWrapper = styled.div`
        margin: 20px 0;
        `;
    
    const ReviewTitle = styled.h2`
        font-size: 24px;
        margin-bottom: 20px;
        text-align: center;
        `;

    return <ReviewWrapper>
                <ReviewTitle> {title} </ReviewTitle>
                <Row gutter={[16, 16]}>
                {
                    products.filter((item) => item.rating === 5 || item.rating > 4)
                    .map((item) => <Col 
                        key={item._id} 
                        xs={12} 
                        sm={8} 
                        md={6} 
                        lg={6}>
                        <CardComponent 
                            id={item._id}
                            name={item.name}
                            price={item.price}
                            rating={item.rating}
                            sold={item.sold}
                            image={item.mainImage}
                        />
                    </Col>)
                }

                </Row>
        </ReviewWrapper>    
}
export default ReviewestProduct