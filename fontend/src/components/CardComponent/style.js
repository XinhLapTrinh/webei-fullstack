import { Link } from "react-router-dom";
import styled from "styled-components";


export const WrapperLink = styled(Link)`

  text-decoration: none;
  display: block;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  flex: 1 1 22%;  /* Mỗi item chiếm 1/5 không gian */
  margin: 10px;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
  }
`;

export const WrapperPriceText = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #d70018;
  margin-bottom: 8px;
`;

export const WrapperDiscountText = styled.span`
  font-size: 14px;
  color: #fff;
  background-color: #d70018;
  padding: 0 6px;
  border-radius: 4px;
  margin-left: 8px;
`;

export const StyleNameProduct = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 1.4;
  height: 44px; /* đủ 2 dòng chữ */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* số dòng hiển thị */
  -webkit-box-orient: vertical;
  margin-bottom: 12px;
`;

export const WrapperReportText = styled.div`
  font-size: 13px;
  color: #888;
  margin-top: 6px;
`;

export const ProductGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: space-between;
`;
