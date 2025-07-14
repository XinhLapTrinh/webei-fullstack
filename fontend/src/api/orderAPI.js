import axios from "axios";

export const createOrder = async (orderData, token) => {
  const res = await axios.post("/api/orders", orderData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getAllOrders = async (page = 1, limit = 10, token) => {
  const res = await axios.get(`/api/orders?page=${page}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
