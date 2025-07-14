import { Button } from "antd";
import styled from "styled-components";

export const WrapperType = styled(Button)`
  max-width:100%;
  margin: 2px 5px;
  padding: 8px 16px;
  background-color: #fff;
  font-size: 16px;
  font-weight: 500;
  color: #333;
  cursor: pointer;
  transition: all 0.3s ease;
  border:none;
  &:hover {
    background-color: #1890ff;
    color: white;
    border-color: #1890ff;
  }
`;
