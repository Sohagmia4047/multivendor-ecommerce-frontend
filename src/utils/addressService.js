import api from "../utils/axiosInstance";

const BASE_URL = "/core/address/";

// Get default address
const getDefaultAddress = async () => {
  const response = await api.get(`${BASE_URL}default/`);
  return response.data;
};

const addressService = {
  getDefaultAddress,
};

export default addressService;