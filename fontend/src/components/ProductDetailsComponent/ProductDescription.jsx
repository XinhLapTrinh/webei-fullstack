import React, { useState } from "react";
import { Typography, Button } from "antd";
import styled from "styled-components";

const { Title } = Typography;

const DescriptionWrapper = styled.div`
  max-width: 100%;
  color: #333;
`;

const Collapsible = styled.div`
  max-height: ${(props) => (props.expanded ? "none" : "300px")};
  overflow: hidden;
  position: relative;
  transition: max-height 0.3s ease;

  &::after {
    content: "";
    display: ${(props) => (props.expanded ? "none" : "block")};
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 80px;
    background: linear-gradient(to bottom, transparent, white);
  }
`;

const ProductDescription = ({ product }) => {
  const [expanded, setExpanded] = useState(false);

  const descriptionHTML = product.description?.trim()
    ? product.description
    : "<i>Không có mô tả</i>";

  return (
    <DescriptionWrapper>
      <Title level={5}>Chi tiết sản phẩm</Title>
      <Collapsible expanded={expanded}>
        <div dangerouslySetInnerHTML={{ __html: descriptionHTML }} />
      </Collapsible>
      <Button type="link" onClick={() => setExpanded(!expanded)}>
        {expanded ? "Thu gọn ▲" : "Xem thêm ▼"}
      </Button>
    </DescriptionWrapper>
  );
};

export default ProductDescription;
