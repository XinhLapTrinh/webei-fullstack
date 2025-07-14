import React, { createContext, useContext, useState } from "react";
import { addToCartAPI, clearCartAPI } from "../api/cartAPI";
import { message } from "antd";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = async (product, overwrite = false) => {
    try {
      await addToCartAPI(product._id || product.id, product.quantity || 1);

      setCartItems((prev) => {
        const exists = prev.find((item) => item.id === product._id || product.id);
        if (exists && !overwrite) {
          return prev.map((item) =>
            item.id === (product._id || product.id)
              ? { ...item, quantity: item.quantity + (product.quantity || 1) }
              : item
          );
        } else {
          return [
            ...prev,
            {
              id: product._id || product.id,
              name: product.name,
              image: product.mainImage,
              price: product.price, // ✅ giữ giá đã tính flash sale
              quantity: product.quantity || 1,
            },
          ];
        }
      });

      message.success("Đã thêm vào giỏ hàng!");
    } catch (err) {
      console.error("Lỗi thêm giỏ hàng:", err?.response?.data || err.message);
    }
  };

  const removeFromCart = async (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearCart = async () => {
    await clearCartAPI();
    message.success("Thanh toán thành công");
    setCartItems([]);
  };

  const updateQuantity = (id, quantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart, updateQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
