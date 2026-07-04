import api from "./axiosInstance";

// =============================
// Get Logged In User Orders
// =============================
export const getMyOrders = async () => {
  const response = await api.get("/core/dashboard/orders/");
  return response.data;
};

export const getInvoice = async (invoiceNo) => {
  const response = await api.get(`/core/invoice/${invoiceNo}/`);
  return response.data;
};

export const getTrackOrder = async (invoiceNo) => {
  const response = await api.get(
    `/core/dashboard/orders/track/${invoiceNo}/`
  );

  return response.data;
};

// 🔹 Track single order by order_id or invoice
export const getTrackAllOrders = async () => {
  const res = await api.get("/core/dashboard/orders/track-all/");
  return res.data;
};