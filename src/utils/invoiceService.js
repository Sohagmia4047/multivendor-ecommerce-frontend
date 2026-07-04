import api from "../utils/axiosInstance";

const BASE_URL = "/core/invoice/";

// 🔹 Get Invoice Details
const getInvoice = async (invoiceNo) => {
  const response = await api.get(`${BASE_URL}${invoiceNo}/`);
  return response.data;
};

const invoiceService = {
  getInvoice,
};

export default invoiceService;