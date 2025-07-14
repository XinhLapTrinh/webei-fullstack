import React, { useState } from "react";
import {
  Badge,
  Dropdown,
  Image,
  Menu,
  message,
  Avatar,
  Typography,
  Drawer,
  Input,
  AutoComplete,
  Spin,
  Tooltip,
} from "antd";
import {
  ShoppingCartOutlined,
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined,
  MenuOutlined,
  SearchOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import AuthModal from "../Auth/AuthModel";
import { useNavigate, Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import { getProducts } from "../../api/productAPI";
import { debounce } from "lodash";
import "./HeaderResponsive.css";

const { Text } = Typography;

const HeaderComponent = () => {
  const { cartItems } = useCart();
  const { user, logout } = useAuth();
  const [authVisible, setAuthVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const navigate = useNavigate();
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const debouncedSearch = debounce(async (value) => {
    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    setSearchLoading(true);
    try {
      const response = await getProducts({ keyword: value });
      const matched = response.products
        .filter((p) => p.name.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 5)
        .map((p) => ({
          value: p.name, // 👈 để input không đổi thành ID
          label: (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <img
                src={`http://localhost:5000/uploads/${p.mainImage || ""}`}
                alt={p.name}
                style={{
                  width: 40,
                  height: 40,
                  objectFit: "cover",
                  borderRadius: 4,
                }}
              />
              <span>{p.name}</span>
            </div>
          ),
        }));

      setSuggestions(matched);
    } catch (error) {
      message.error("Có lỗi xảy ra trong quá trình tìm kiếm.");
    } finally {
      setSearchLoading(false);
    }
  }, 300);

  const handleLogout = () => {
    logout();
    message.success("✅ Đã đăng xuất");
    navigate("/");
  };

  const menu = (
    <Menu>
      <Menu.Item onClick={() => navigate("/profile")}>Trang cá nhân</Menu.Item>
      {(user?.role === "admin" || user?.role === 'editor') && (
        <Menu.Item icon={<DashboardOutlined />} onClick={() => navigate("/admin")}>
          Quản trị
        </Menu.Item>
      )}
      <Menu.Item icon={<LogoutOutlined />} onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  const avatarUrl = user?.avatar || "https://i.pravatar.cc/100?u=" + user?.email;

  return (
    <>
      <header className="header">
        <div className="header-left">
          <MenuOutlined className="menu-icon" onClick={() => setDrawerVisible(true)} />
          <Link to="/">
            <Image src={logo} preview={false} height={40} />
          </Link>
        </div>

        <div className="header-center">
          <AutoComplete
            options={suggestions}
            onSearch={debouncedSearch}
            onSelect={(value) => {
              setSearchQuery(value); // ✅ giữ nguyên tên sản phẩm
              navigate(`/search?q=${value}`); // ✅ điều hướng sang trang kết quả
              setSearchQuery(""); // ✅ reset sau điều hướng
            }}
            style={{ width: "100%" }}
            notFoundContent={searchLoading ? <Spin size="small" /> : "Không tìm thấy sản phẩm"}
          >
            <Input.Search
              placeholder="Tìm kiếm sản phẩm..."
              enterButton
              allowClear
              value={searchQuery}
              onChange={(e) => {
                const value = e.target.value;
                setSearchQuery(value);
                debouncedSearch(value);
              }}
              onSearch={(q) => {
                if (q) {
                  navigate(`/search?q=${q}`);
                  setSearchQuery(""); // ✅ reset sau tìm kiếm
                }
              }}
            />
          </AutoComplete>
        </div>

        <div className="header-right">
          <Tooltip title="Cửa hàng">
            <Link to="/products" className="cart-link">
              <ShopOutlined className="cart-icon" />
            </Link>
          </Tooltip>
          <Tooltip title="Giỏ hàng">
            <Link to="/cart" className="cart-link">
              <Badge count={cartCount} size="small" showZero>
                <ShoppingCartOutlined className="cart-icon" />
              </Badge>
            </Link>
          </Tooltip>

          {!user ? (
            <div className="login-btn" onClick={() => setAuthVisible(true)}>
              <UserOutlined />
              <span>Đăng nhập</span>
            </div>
          ) : (
            <Dropdown overlay={menu} trigger={["click"]}>
              <div className="user-info">
                <Avatar size={36} src={avatarUrl} />
                <Text strong className="username">{user.name}</Text>
              </div>
            </Dropdown>
          )}
        </div>
      </header>

      <Drawer
        title="Điều hướng"
        placement="left"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        <Menu mode="vertical" selectable={false}>
          <Menu.Item key="home">
            <Link to="/" onClick={() => setDrawerVisible(false)}>🏠 Trang chủ</Link>
          </Menu.Item>
          <Menu.Item key="products">
            <Link to="/products" onClick={() => setDrawerVisible(false)}>🛍️ Cửa hàng</Link>
          </Menu.Item>
          <Menu.Item key="cart">
            <Link to="/cart" onClick={() => setDrawerVisible(false)}>🛒 Giỏ hàng</Link>
          </Menu.Item>
          {user && (
            <Menu.Item key="profile">
              <Link to="/profile" onClick={() => setDrawerVisible(false)}>👤 Hồ sơ</Link>
            </Menu.Item>
          )}
          {user?.role === "admin" && (
            <Menu.Item key="admin">
              <Link to="/admin" onClick={() => setDrawerVisible(false)}>⚙️ Quản trị</Link>
            </Menu.Item>
          )}
          {!user ? (
            <Menu.Item key="login" onClick={() => {
              setAuthVisible(true);
              setDrawerVisible(false);
            }}>
              🔐 Đăng nhập / Đăng ký
            </Menu.Item>
          ) : (
            <Menu.Item key="logout" onClick={() => {
              handleLogout();
              setDrawerVisible(false);
            }}>
              🚪 Đăng xuất
            </Menu.Item>
          )}
        </Menu>
      </Drawer>

      <AuthModal open={authVisible} onClose={() => setAuthVisible(false)} />
    </>
  );
};

export default HeaderComponent;
