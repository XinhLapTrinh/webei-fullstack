import React, { useState } from "react";
import { Card, Rate, Badge, Typography, Tooltip } from "antd";
import {
  StyleNameProduct,
  WrapperDiscountText,
  WrapperPriceText,
  WrapperReportText,
  WrapperLink,
} from "./style";

const { Text } = Typography;

const CardComponent = ({
  id,
  image,
  name,
  price,       // giá đã giảm
  discount,    // % giảm giá
  rating,
  sold,
  flashSale,
}) => {
  const baseURL = "http://localhost:5000";
  const fullImage = image?.startsWith("http")
    ? image
    : `${baseURL}/uploads/${image || ""}`;
  const [imgSrc, setImgSrc] = useState(fullImage);

  const rawPrice = Number(price);
  const discountPercent = Number(discount) || 0;

  // Tính giá gốc
  const calculatedOldPrice =
    discountPercent > 0
      ? Math.round(rawPrice / (1 - discountPercent / 100))
      : rawPrice;

  const now = new Date();
  const isFlashSale =
    flashSale?.isActive &&
    new Date(flashSale.startTime) <= now &&
    new Date(flashSale.endTime) >= now;

  const finalPrice = isFlashSale
    ? Number(flashSale.price)
    : rawPrice;

  const oldPrice = isFlashSale ? rawPrice : calculatedOldPrice;

  return (
    <WrapperLink to={`/product-details/${id}`}>
      <Badge.Ribbon
        text={isFlashSale ? "FLASH SALE" : null}
        color="red"
        style={{ fontWeight: "bold" }}
      >
        <Card
          hoverable
          style={{
            width: "100%",
            borderRadius: 16,
            overflow: "hidden",
            transition: "transform 0.3s ease-in-out",
            boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
            position: "relative",
          }}
          bodyStyle={{
            padding: "16px",
            display: "flex",
            flexDirection: "column",
          }}
          cover={
            <img
              alt={name}
              height={240}
              src={imgSrc}
              onError={() => {
                console.warn("❌ Ảnh bị lỗi:", imgSrc);
                setImgSrc("https://via.placeholder.com/300x200?text=No+Image");
              }}
              style={{
                objectFit: "cover",
                width: "100%",
                borderRadius: "10px",
                transition: "transform 0.3s ease-in-out",
              }}
            />
          }
        >
          <WrapperPriceText>
            <Tooltip title="Giá hiện tại">
              <Text strong style={{ color: "red" }}>
                {finalPrice.toLocaleString()}₫
              </Text>
            </Tooltip>

            {oldPrice > finalPrice && (
              <>
                <Text
                  delete
                  type="secondary"
                  style={{ marginLeft: 8, fontSize: 13 }}
                >
                  {oldPrice.toLocaleString()}₫
                </Text>
                {!isFlashSale && discountPercent > 0 && (
                  <WrapperDiscountText>
                    -{discountPercent}%
                  </WrapperDiscountText>
                )}
              </>
            )}
          </WrapperPriceText>

          <StyleNameProduct>{name}</StyleNameProduct>

          <WrapperReportText>
            <Rate
              allowHalf
              disabled
              value={rating}
              style={{
                fontSize: 14,
                color: "orange",
                marginRight: 8,
              }}
            />
            <span style={{ fontSize: "12px", color: "#999" }}>
              | Đã bán {sold || 0}+
            </span>
          </WrapperReportText>
        </Card>
      </Badge.Ribbon>
    </WrapperLink>
  );
};

export default CardComponent;
