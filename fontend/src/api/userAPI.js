import axios from "axios";
const API_URL = "/api/users";

// Đăng nhập



// ✅ Lấy tất cả user (cần token)
export const getAllUsers = async (token, keyword = "") => {
  const res = await axios.get(`${API_URL}?search=${keyword}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// ✅ Xóa user theo id (cần token)
export const deleteUserById = async (id, token) => {
  const res = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const updateUserById = async (id, data, token) => {
  const res = await axios.put(`/api/users/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const updateProfile = async(data, token) => {
  try {
    const res = await axios.put('/api/users/me', data, {
    headers:{
      Authorization: `Bearer ${token}`,
    }
  })
  return res.data;
  }
  catch(error){
    throw error.response?.data || error.message || 'Update profile failed';
  }
  
}