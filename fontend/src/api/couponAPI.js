import axios from "axios";

// Lấy danh sách tất cả mã giảm giá
export const getAllCoupons = async (token) => {
  const res = await axios.get("/api/coupons", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// Tạo mã giảm giá mới
export const createCoupon = async (data, token) => {
  const res = await axios.post("/api/coupons", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// Cập nhật mã giảm giá
export const updateCoupon = async (id, data, token) => {
  const res = await axios.put(`/api/coupons/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// Xoá mã giảm giá
export const deleteCoupon = async (id, token) => {
  const res = await axios.delete(`/api/coupons/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// Kiểm tra mã giảm giá người dùng nhập (dùng khi thanh toán)
export const validateCoupon = async ({ code, orderTotal, token }) => {
  const res = await axios.post("/api/coupons/validate", { code, orderTotal }, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
  return res.data;
};

