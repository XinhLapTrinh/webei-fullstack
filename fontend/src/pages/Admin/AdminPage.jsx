import React, { useContext } from "react";
import { useAuth } from "../../context/AuthContext";
import { Menu, Avatar, Dropdown } from "antd";
import {
  AppstoreOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  BarChartOutlined,
  LogoutOutlined,
  CarOutlined,
  BookOutlined,
  MessageOutlined
} from "@ant-design/icons";
import { Route, Routes, Link, Navigate, useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import ProductManager from "./ProductManager";
import UserManager from "./UserManager";
import OrderManager from "./OrderManager";
import ShippingManager from "./ShippingManager";
import CouponManager from "./CouponManager";
import SupportInboxGrouped from "./SupportInboxGrouped";
import {
  StyledSider,
  StyledHeader,
  StyledContent,
  AdminLogo,
} from "./AdminStyled";
import { Layout } from "antd";
import RoleRoute from "../../routes/RoleRoute";

const AdminPage = () => {
  const {user} = useAuth()

  const navigate = useNavigate();

  const menu = (
    <Menu>
      <Menu.Item
        key="logout"
        icon={<LogoutOutlined />}
        onClick={() => navigate("/")}
      >
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <StyledSider width={220}>
        <AdminLogo>🛒 Webei Admin</AdminLogo>
        <Menu
          mode="inline"
          defaultSelectedKeys={["dashboard"]}
          style={{ background: "#f9f9f9", borderRight: "none" }}
        >
          <Menu.Item key="dashboard" icon={<BarChartOutlined />}>
            <Link to="/admin/dashboard">Thống kê</Link>
          </Menu.Item>
          <Menu.Item key="products" icon={<AppstoreOutlined />}>
            <Link to="/admin/products">Sản phẩm</Link>
          </Menu.Item>
          <Menu.Item key="orders" icon={<ShoppingCartOutlined />}>
            <Link to="/admin/orders">Đơn hàng</Link>
          </Menu.Item>
          {user?.role === 'admin' && (<Menu.Item key="users" icon={<UserOutlined />}>
            <Link to="/admin/users">Người dùng</Link>
          </Menu.Item>)}
          
          <Menu.Item key="shippings" icon={<CarOutlined />}>
            <Link to="/admin/shippings">Vận chuyển</Link>
          </Menu.Item>
          <Menu.Item key="coupons" icon={<BookOutlined />}>
            <Link to="/admin/coupons">Voucher</Link>
          </Menu.Item>
          <Menu.Item key="supports" icon={<MessageOutlined />}>
            <Link to="/admin/supports">Hỗ trợ khách hàng</Link>
          </Menu.Item>
        </Menu>
      </StyledSider>

      <Layout>
        <StyledHeader>
          <Dropdown overlay={menu} placement="bottomRight">
            <div style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
              <Avatar icon={<UserOutlined />} />
              <span style={{ fontWeight: 500 }}>Admin</span>
            </div>
          </Dropdown>
        </StyledHeader>

        <StyledContent>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<ProductManager />} />
            <Route path="/orders" element={<OrderManager />} />
            <Route path="/users" element={
                                <RoleRoute allowedRoles={['admin']}>
                                  <UserManager />
                                </RoleRoute>
                              } />
            <Route path="/shippings" element={<ShippingManager /> }/>
            <Route path="/coupons" element={<CouponManager />} />
            <Route path="/supports" element={<SupportInboxGrouped />} />
            <Route path="*" element={<Navigate to="/admin/dashboard" />} />
          </Routes>
        </StyledContent>
      </Layout>
    </Layout>
  );
};

export default AdminPage;
