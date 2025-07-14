import styled from "styled-components";
import { Layout } from "antd";

export const AdminLogo = styled.div`
  height: 64px;
  display: flex;
  align-items: center;
  padding-left: 24px;
  font-weight: bold;
  font-size: 20px;
  color: #1677ff;
`;

export const StyledSider = styled(Layout.Sider)`
  background: #f9f9f9 !important;
  border-right: 1px solid #eee;
`;

export const StyledHeader = styled(Layout.Header)`
  background: #fff;
  padding: 0 24px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
`;

export const StyledContent = styled(Layout.Content)`
  margin: 24px;
  padding: 24px;
  background: #fff;
  min-height: 280px;
  border-radius: 8px;
`;
