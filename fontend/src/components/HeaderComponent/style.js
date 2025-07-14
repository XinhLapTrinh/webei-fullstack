import styled from "styled-components";
import { Col } from "antd";

export const WrapperHeader = styled.div`
  width: 100%;
  height: 70px;
  background-color: #fff;
  padding: 0 50px;
  display: flex;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

export const WrapperTextHeader = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #1890ff;
  cursor: pointer;
`;

export const WrapperAccountHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 24px;
`;

export const WrapperCartHeader = styled.div`
  font-size: 14px;
  color: #333;
`;
