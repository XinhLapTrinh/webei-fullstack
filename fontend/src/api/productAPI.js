import axios from "axios";
const API_URL = "/api/products";

export const getAuthHeader = () => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  return user?.token ? { Authorization: `Bearer ${user.token}` } : {};
};

export const getProducts = async (params) => {
  const res = await axios.get('/api/products', { params });
  return res.data;
};

export const createProduct = async (formData) => {
  const res = await axios.post(API_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...getAuthHeader(),
    },
  });
  return res.data;
};

export const updateProduct = async (id, formData) => {
  const res = await axios.put(`${API_URL}/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...getAuthHeader(),
    },
  });
  return res.data;
};

export const deleteProduct = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`, {
    headers: getAuthHeader(),
  });
  return res.data;
};

export const getProductById = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

export const getProductsByCategory = async (category) => {
  const res = await axios.get(`/api/products?category=${encodeURIComponent(category)}`);
  return res.data;
};

export const getCategories = async () => {
  const response = await axios.get("/api/products/categories");
  console.log("📦 Danh mục trả về từ API:", response.data);
  return response.data;
};

export const addProductReview = async (productId, data) => {
  const res = await axios.post(
    `/api/products/${productId}/reviews`,
    data,
    {
      headers: {
        ...getAuthHeader(),
      },
    }
  );
  return res.data;
};

export const getFlashSaleProducts = async () => {
  const res = await axios.get("/api/products/flashsale");
  return res.data;
};
