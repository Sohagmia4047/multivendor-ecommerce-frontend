import api from "../utils/axiosInstance";

const API_URL = "http://127.0.0.1:8000/core/categories/";

// 🔹 Get all categories
const getAllCategories = async () => {
  const res = await api.get(API_URL);
  return res.data;
};

// 🔹 Get single category (by cid)
const getCategoryProducts = async (cid) => {
  const res = await api.get(`${API_URL}${cid}/`);
  return res.data;
};

// 🔹 Create category
const createCategory = (payload) => {
  return api.post(API_URL, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// 🔹 Update category (by cid)
const partialUpdateCategory = (cid, payload) => {
  return api.patch(`${API_URL}${cid}/`, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// 🔹 Delete category (by cid)
const deleteCategory = (cid) => {
  return api.delete(`${API_URL}${cid}/`);
};

// 🔹 Search category
const searchCategories = async (query) => {
  const res = await api.get(
    `${API_URL}?search=${encodeURIComponent(query)}`
  );
  return res.data;
};

const categoryService = {
  getAllCategories,
  getCategoryProducts,
  createCategory,
  partialUpdateCategory,
  deleteCategory,
  searchCategories,
};

export default categoryService;