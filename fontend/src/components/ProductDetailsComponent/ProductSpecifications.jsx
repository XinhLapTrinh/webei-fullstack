import React, { useState } from "react";
import { Typography, Table, Button } from "antd";
import styled from "styled-components";

const { Title, Text } = Typography;

const StyledSpecTable = styled(Table)`
  margin-top: 12px;

  .ant-table-thead > tr > th {
    background-color: #fafafa;
    font-weight: 600;
    font-size: 15px;
  }

  .ant-table-tbody > tr > td {
    font-size: 14px;
    padding: 12px 16px;
  }

  @media (max-width: 576px) {
    .ant-table {
      font-size: 13px;
    }
  }
`;

const Section = styled.div`
  margin-top: 24px;
`;

const ToggleButton = styled(Button)`
  margin-top: 12px;
`;

const ProductSpecifications = ({ specifications }) => {
  const [expanded, setExpanded] = useState(false);
  const visibleSpecs = expanded ? specifications : specifications.slice(0, 5);

  if (!specifications || specifications.length === 0) return null;

  const columns = [
    {
      title: "Thuộc tính",
      dataIndex: "name",
      key: "name",
      width: "40%",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Giá trị",
      dataIndex: "value",
      key: "value",
    },
  ];

  return (
    <Section>
      <Title level={5}>Thông số kỹ thuật</Title>
      <StyledSpecTable
        columns={columns}
        dataSource={visibleSpecs}
        pagination={false}
        size="small"
        bordered
        rowKey="name"
      />
      {specifications.length > 5 && (
        <ToggleButton type="link" onClick={() => setExpanded(!expanded)}>
          {expanded ? "Thu gọn ▲" : "Xem thêm ▼"}
        </ToggleButton>
      )}
    </Section>
  );
};

export default ProductSpecifications;
