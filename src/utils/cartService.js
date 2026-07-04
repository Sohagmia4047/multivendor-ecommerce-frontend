import api from "../utils/axiosInstance";

const BASE_URL = "/core/cart/";

// Get cart items
const getCart = async () => {
  const response = await api.get(BASE_URL);
  return response.data;
};

// Add item to cart
const addToCart = async (productId, qty = 1) => {
  const response = await api.post(`${BASE_URL}add/`, {
    product_id: productId,
    qty,
  });

  return response.data;
};

// Update cart item quantity
const updateCartItem = async (itemId, qty) => {
  const response = await api.patch(`${BASE_URL}update/${itemId}/`, {
    qty,
  });

  return response.data;
};

// Remove item from cart
const removeCartItem = async (itemId) => {
  const response = await api.delete(`${BASE_URL}delete/${itemId}/`);
  return response.data;
};

const initiatePayment = async (data) => {
  const res = await api.post("/payments/initiate/", data);
  return res.data;
};

// Clear entire cart
const clearCart = async () => {
  const response = await api.delete(`${BASE_URL}clear/`);
  return response.data;
};

// Get cart count
const getCartCount = async () => {
  const response = await api.get(BASE_URL);
  return response.data;
};

const cartService = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  getCartCount,
  initiatePayment,
};

export default cartService;