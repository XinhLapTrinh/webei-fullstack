// src/components/FooterComponent/FooterComponent.jsx
import React from "react";
import styled from "styled-components";

const FooterWrapper = styled.div`
  background-color: #333;
  color: #fff;
  padding: 20px;
  text-align: center;
  border-radius: 8px;
`;

const FooterComponent = () => {
  return (
    <FooterWrapper>
      <p>© 2025 - TRAN QUOC XINH</p>
      <p>Địa chỉ: U Minh Thượng, Kiên Giang</p>
    </FooterWrapper>
  );
};

export default FooterComponent;
