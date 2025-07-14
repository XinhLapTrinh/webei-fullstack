import axios from "axios";

const API_URL = "/api/cart";

const getAuthHeader = () => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  return user?.token ? { Authorization: `Bearer ${user.token}` } : {};
};

export const addToCartAPI = async (productId, quantity) => {
  const res = await axios.post(
    API_URL,
    { productId, quantity },
    { headers: getAuthHeader() }
  );
  return res.data;
};

export const fetchCart = async () => {
  const res = await axios.get(API_URL, { headers: getAuthHeader() });
  return res.data;
};

export const clearCartAPI = async () => {
  const res = await axios.delete(API_URL, { headers: getAuthHeader() });
  return res.data;
};