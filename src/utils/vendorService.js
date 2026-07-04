import api from "../utils/axiosInstance";

const API_URL = `${import.meta.env.VITE_BASE_URL}/core/vendors/`;

// 🔹 Get all vendors
const getAllVendors = async (status = "all") => {
  const res = await api.get(`${API_URL}?status=${status}`);
  return res.data;
};

// 🔹 Get single vendor (by vid)
const getVendorDetails = async (vid) => {
  const res = await api.get(`${API_URL}${vid}/`);
  return res.data;
};

// 🔹 Create vendor
const createVendor = (payload) => {
  return api.post(API_URL, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// 🔹 Update vendor (partial update by vid)
const partialUpdateVendor = (vid, payload) => {
  return api.patch(`${API_URL}${vid}/`, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// 🔹 Delete vendor
const deleteVendor = (vid) => {
  return api.delete(`${API_URL}${vid}/`);
};

// 🔹 Search vendors
const searchVendors = async (query) => {
  const res = await api.get(
    `${API_URL}?search=${encodeURIComponent(query)}`
  );
  return res.data;
};

// 🔹 Export service
const vendorService = {
  getAllVendors,
  getVendorDetails,
  createVendor,
  partialUpdateVendor,
  deleteVendor,
  searchVendors,
};

export default vendorService;