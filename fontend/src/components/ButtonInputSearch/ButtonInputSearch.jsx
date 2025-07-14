// src/components/ButtonInputSearch/ButtonInputSearch.jsx
import React, { useState, useEffect, useRef } from "react";
import { Input, List, Image } from "antd";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import { searchProducts } from "../../utils/searchProducts";

const ButtonInputSearch = ({ placeholder = "Tìm kiếm sản phẩm..." }) => {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  const handleSearch = debounce(async (keyword) => {
    if (keyword.trim()) {
      const result = await searchProducts(keyword);
      setSuggestions(result);
      setShowDropdown(true);
    }
  }, 300);

  useEffect(() => {
    if (value.trim()) {
      handleSearch(value);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
    return () => handleSearch.cancel();
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectProduct = (productId) => {
    navigate(`/product-details/${productId}`);
    setValue("");
    setShowDropdown(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && value.trim()) {
      navigate(`/search?q=${encodeURIComponent(value.trim())}`);
      setShowDropdown(false);
    }
  };

  return (
    <div style={{ position: "relative", width: "100%" }} ref={wrapperRef}>
      <Input
        size="large"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        allowClear
        style={{ width: "100%", borderRadius: 4 }}
      />

      {showDropdown && suggestions.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: 48,
            left: 0,
            right: 0,
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: 4,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            zIndex: 1000,
            maxHeight: 350,
            overflowY: "auto",
          }}
        >
          <List
            itemLayout="horizontal"
            dataSource={suggestions}
            renderItem={(item) => (
              <List.Item
                key={item._id}
                onClick={() => handleSelectProduct(item._id)}
                style={{
                  cursor: "pointer",
                  padding: 10,
                  transition: "background 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f5f5f5";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#fff";
                }}
              >
                <List.Item.Meta
                  // avatar={
                  //   <Image
                  //     src={item.images?.[0]}
                  //     alt={item.name}
                  //     width={50}
                  //     height={50}
                  //     style={{ objectFit: "cover", borderRadius: 4 }}
                  //     preview={false}
                  //     fallback="/images/default-placeholder.png"
                  //   />
                  // }
                  title={
                    <span style={{ fontWeight: 500 }}>{item.name}</span>
                  }
                  description={
                    <span style={{ color: "#f5222d", fontWeight: 500 }}>
                      {item.price.toLocaleString("vi-VN")} ₫
                    </span>
                  }
                />
              </List.Item>
            )}
          />
        </div>
      )}
    </div>
  );
};

export default ButtonInputSearch;
