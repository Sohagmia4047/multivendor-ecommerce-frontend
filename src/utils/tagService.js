import api from "../utils/axiosInstance";

const API_URL = `${import.meta.env.VITE_BASE_URL}/core/tags/`;

// 🔹 Get all tags
const getAllTags = async () => {
  const res = await api.get(API_URL);
  return res.data;
};

// 🔹 Get single tag products (by slug)
const getTagProducts = async (slug) => {
  const res = await api.get(`${API_URL}${slug}/`);
  return res.data;
};

// 🔹 Create tag
const createTag = (payload) => {
  return api.post(API_URL, payload);
};

// 🔹 Update tag
const partialUpdateTag = (slug, payload) => {
  return api.patch(`${API_URL}${slug}/`, payload);
};

// 🔹 Delete tag
const deleteTag = (slug) => {
  return api.delete(`${API_URL}${slug}/`);
};

// 🔹 Search tags
const searchTags = async (query) => {
  const res = await api.get(
    `${API_URL}?search=${encodeURIComponent(query)}`
  );
  return res.data;
};

const tagService = {
  getAllTags,
  getTagProducts,
  createTag,
  partialUpdateTag,
  deleteTag,
  searchTags,
};

export default tagService;