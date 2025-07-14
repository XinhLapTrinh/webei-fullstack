// hooks/useRequireAuth.js (hoặc trong từng component nếu đơn giản)
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export const useRequireAuth = () => {
  const { user } = useAuth();
  const [authVisible, setAuthVisible] = useState(false);

  const check = (callbackIfLoggedIn) => {
    if (user) {
      callbackIfLoggedIn(); // Cho phép hành động
    } else {
      setAuthVisible(true); // Hiện form đăng nhập
    }
  };

  return { check, authVisible, setAuthVisible };
};
