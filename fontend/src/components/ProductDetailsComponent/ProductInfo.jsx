import React, { useState } from "react";
import {
  Typography,
  Rate,
  Button,
  Tag,
  InputNumber,
  message,
  Grid,
} from "antd";
import styled from "styled-components";
import ShippingInfo from "./ShippingInfo";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AuthModal from "../Auth/AuthModel";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const ProductInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const PriceWrapper = styled.div`
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 12px;
`;

const OldPrice = styled(Text)`
  text-decoration: line-through;
  color: #888;
`;

const ColorOptions = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const ColorBox = styled.div`
  width: 32px;
  height: 32px;
  border: 2px solid ${(props) => (props.selected ? "#d70018" : "#ccc")};
  border-radius: 4px;
  background-color: ${(props) => props.color || "#fff"};
  cursor: pointer;
`;

const ResponsiveGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
`;

const ProductInfo = ({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const screens = useBreakpoint();

  const [quantity, setQuantity] = useState(1);
  const [authVisible, setAuthVisible] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);

  if (!product) return null;

  const {
    name,
    brand,
    price: oldPrice,
    discount = 0,
    rating,
    sold,
    category,
    flashSale,
  } = product;

  const now = new Date();
  const isFlashSaleActive =
    flashSale?.isActive &&
    new Date(flashSale.startTime) <= now &&
    new Date(flashSale.endTime) >= now;

  const finalPrice = isFlashSaleActive
    ? flashSale.price
    : Math.round(oldPrice * (1 - discount / 100));

  const handleAddToCart = () => {
    if (!user) return setAuthVisible(true);
    addToCart({ ...product, quantity, price: finalPrice }); // Ghi đè giá bán
    message.success("Đã thêm vào giỏ hàng");
  };

  const handleBuyNow = () => {
    if (!user) return setAuthVisible(true);
    addToCart({ ...product, quantity, price: finalPrice }, true); // Ghi đè giá bán
    navigate("/order");
  };

  const formatCurrency = (number) =>
    new Intl.NumberFormat("vi-VN").format(number) + "₫";

  const calculatedOldPrice = isFlashSaleActive
    ? oldPrice
    : Math.round(finalPrice / (1 - discount / 100));

  return (
    <ProductInfoWrapper>
      <Title level={screens.xs ? 5 : 4}>{name}</Title>

      <ResponsiveGrid>
        <div>
            <Tag color="blue">{category || "Chưa phân loại"}</Tag>
            <Tag color="blue">{brand || ""}</Tag>
          <div style={{ marginTop: 4 }}>
            <Rate disabled defaultValue={rating} allowHalf />
            <Text style={{ marginLeft: 8 }}>({sold} lượt mua)</Text>
          </div>

          <PriceWrapper style={{ marginTop: 12 }}>
            <Title
              level={screens.xs ? 4 : 3}
              style={{ color: "#d70018", margin: 0 }}
            >
              {formatCurrency(finalPrice)}
            </Title>
            {calculatedOldPrice > finalPrice && (
              <>
                <OldPrice>{formatCurrency(calculatedOldPrice)}</OldPrice>
                <Tag color="red">
                  -{Math.round(
                    ((calculatedOldPrice - finalPrice) / calculatedOldPrice) *
                      100
                  )}
                  %
                </Tag>
              </>
            )}
          </PriceWrapper>

          <div style={{ marginTop: 12 }}>
            <Text strong>Số lượng:</Text>{" "}
            <InputNumber
              min={1}
              value={quantity}
              onChange={(value) => setQuantity(value || 1)}
              style={{ width: 80 }}
            />
          </div>

          <div style={{ marginTop: 12 }}>
            <Text strong>Màu sắc:</Text>
            <ColorOptions>
              {["#000", "#1e90ff", "#a0522d"].map((color) => (
                <ColorBox
                  key={color}
                  color={color}
                  selected={selectedColor === color}
                  onClick={() => {
                    setSelectedColor(color);
                    message.info("Chức năng chưa cập nhật");
                  }}
                />
              ))}
            </ColorOptions>
          </div>

          <div style={{ marginTop: 16 }}>
            <Button
              type="primary"
              size="large"
              onClick={handleBuyNow}
              style={{ marginRight: 12 }}
            >
              Mua ngay
            </Button>
            <Button size="large" onClick={handleAddToCart}>
              Thêm vào giỏ
            </Button>
          </div>
        </div>

        <div>
          <ShippingInfo />
        </div>
      </ResponsiveGrid>

      <AuthModal open={authVisible} onClose={() => setAuthVisible(false)} />
    </ProductInfoWrapper>
  );
};

export default ProductInfo;
