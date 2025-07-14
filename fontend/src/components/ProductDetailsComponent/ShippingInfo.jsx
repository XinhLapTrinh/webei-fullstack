import React from "react";
import { EnvironmentOutlined, TruckOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { Typography, Tag, message } from "antd";
import styled from "styled-components";

const { Text } = Typography;

const ShippingInfoWrapper = styled.div`
  background: #f5f5f5;
  padding: 16px;
  border-radius: 8px;
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ShippingInfo = () => {
  return (
    <ShippingInfoWrapper>
      <InfoRow>
        <EnvironmentOutlined style={{ color: "#1890ff" }} />
        <Text strong>Giao đến:</Text>
        <Text>Q.1, Hồ Chí Minh</Text>
        <Tag color="blue" style={{ marginLeft: "auto", cursor: "pointer" }} onClick={()=>message.info('Chức năng chưa cập nhật')}>
          Thay đổi
        </Tag>
      </InfoRow>

      <InfoRow>
        <TruckOutlined style={{ color: "#52c41a" }} />
        <Text strong>Giao hàng:</Text>
        <Text>Giao tiêu chuẩn - Thứ 5, 04/07</Text>
        <Tag color="green">Miễn phí</Tag>
      </InfoRow>

      <InfoRow>
        <ClockCircleOutlined style={{ color: "#faad14" }} />
        <Text strong>Thời gian xử lý:</Text>
        <Text>Giao trong 24h nếu đặt trước 16:00 hôm nay</Text>
      </InfoRow>
    </ShippingInfoWrapper>
  );
};

export default ShippingInfo;
