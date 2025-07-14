import React from "react";
import {
  Rate,
  List,
  Avatar,
  Typography,
  Pagination,
  Image,
  Empty,
} from "antd";
import styled from "styled-components";

const { Title, Text, Paragraph } = Typography;

const ReviewWrapper = styled.div`
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  margin-top: 32px;
`;

const RatingSummary = styled.div`
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ProductReviews = ({
  reviews = [],
  ratingAverage = 0,
  totalReviews = 0,
  currentPage = 1,
  onPageChange = () => {},
}) => {
  return (
    <ReviewWrapper>
      <Title level={4}>Đánh giá sản phẩm</Title>

      <RatingSummary>
        <Rate disabled value={ratingAverage} allowHalf />
        <Text>
          {ratingAverage.toFixed(1)} trên 5 ({totalReviews} đánh giá)
        </Text>
      </RatingSummary>

      {reviews.length === 0 ? (
        <Empty description="Chưa có đánh giá nào cho sản phẩm này" />
      ) : (
        <List
          itemLayout="vertical"
          dataSource={reviews}
          renderItem={(item) => (
            <List.Item key={item._id}>
              <List.Item.Meta
                avatar={<Avatar src={item.avatar || undefined} />}
                title={<Text strong>{item.name}</Text>}
                description={
                  <Rate disabled defaultValue={item.rating} allowHalf />
                }
              />
              <Paragraph>{item.comment}</Paragraph>

              {Array.isArray(item.images) && item.images.length > 0 && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {item.images.map((img, index) => (
                    <Image
                      key={index}
                      src={img}
                      width={80}
                      height={80}
                      style={{ objectFit: "cover", borderRadius: 4 }}
                    />
                  ))}
                </div>
              )}
            </List.Item>
          )}
        />
      )}

      {totalReviews > 3 && (
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Pagination
            current={currentPage}
            total={totalReviews}
            pageSize={3}
            onChange={onPageChange}
          />
        </div>
      )}
    </ReviewWrapper>
  );
};

export default ProductReviews;
