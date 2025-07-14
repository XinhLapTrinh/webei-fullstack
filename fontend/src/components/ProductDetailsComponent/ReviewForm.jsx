// src/components/ReviewForm.jsx
import React, { useState } from "react";
import { Rate, Input, Button, message } from "antd";
import styled from "styled-components";
import { addProductReview } from "../../api/productAPI";
import { useAuth } from "../../context/AuthContext";

const { TextArea } = Input;

const Wrapper = styled.div`
  background: #fafafa;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
`;

const ReviewForm = ({ productId, onSuccess, existingReviews }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const alreadyReviewed = existingReviews?.some(
    (r) => r.user === user?._id
  );

  const handleSubmit = async () => {
    if (!rating || !comment) {
      return message.warning("Vui lòng nhập đầy đủ đánh giá và bình luận");
    }

    setLoading(true);
    try {
      await addProductReview(productId, { rating, comment });
      message.success("Đánh giá của bạn đã được gửi");
      setRating(0);
      setComment("");
      onSuccess(); // gọi lại load sản phẩm
    } catch (err) {
      message.error(err?.response?.data?.message || "Lỗi khi gửi đánh giá");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <Wrapper>🔒 Vui lòng đăng nhập để gửi đánh giá.</Wrapper>;
  }

  if (alreadyReviewed) {
    return <Wrapper>✅ Bạn đã đánh giá sản phẩm này.</Wrapper>;
  }

  return (
    <Wrapper>
      <h4>Gửi đánh giá của bạn</h4>
      <Rate value={rating} onChange={setRating} />
      <TextArea
        rows={3}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Chia sẻ cảm nhận của bạn..."
        style={{ marginTop: 12 }}
      />
      <Button
        type="primary"
        onClick={handleSubmit}
        loading={loading}
        style={{ marginTop: 12 }}
      >
        Gửi đánh giá
      </Button>
    </Wrapper>
  );
};

export default ReviewForm;
