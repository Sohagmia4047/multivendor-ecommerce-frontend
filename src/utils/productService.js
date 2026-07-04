import api from "../utils/axiosInstance";

const API_URL = `${import.meta.env.VITE_BASE_URL}/core/products/`;

// 🔹 Get all products
const getAllProducts = async () => {
  const res = await api.get(API_URL);
  return res.data;
};

// 🔹 Get single product by ID
const getSingleProduct = async (id) => {
  const res = await api.get(`${API_URL}${id}/`);
  return res.data;
};

// 🔹 Create new product
const createProduct = (payload) => {
  return api.post(API_URL, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// 🔹 Partial update product
const partialUpdateProduct = (id, payload) => {
  return api.patch(`${API_URL}${id}/`, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// 🔹 Delete product
const deleteProduct = (id) => {
  return api.delete(`${API_URL}${id}/`);
};

// 🔹 Search products
const searchProducts = async (query) => {
  const res = await api.get(
    `${API_URL}?search=${encodeURIComponent(query)}`
  );

  return res.data;
};

// 🔹 Add Review
const addReview = async (pid, reviewData) => {
  const token = localStorage.getItem("access");
  console.log("Adding review with token:", token);
  const res = await api.post(
    `${API_URL}${pid}/review/`,
    reviewData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return res.data;
};

const productService = {
  getAllProducts,
  getSingleProduct,
  createProduct,
  partialUpdateProduct,
  deleteProduct,
  searchProducts,
  addReview,
};

export default productService;