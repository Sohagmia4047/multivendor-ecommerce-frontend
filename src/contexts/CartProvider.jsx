import { useEffect, useState, useCallback } from "react";
import cartService from "../utils/cartService";
import { CartContext } from "./CartContext";

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  // ✅ SAFE refreshCart (memoized)
  const refreshCart = useCallback(async () => {
    const token = localStorage.getItem("access");
    if (!token) return;

    try {
      const data = await cartService.getCart();

      setCartItems(data?.cart || []);
      setCartCount(data?.cart_count || 0);
    } catch (err) {
      console.log(
        "Cart refresh failed:",
        err?.response?.data || err.message
      );
    }
  }, []);

  // ✅ Clear cart
  const clearCart = useCallback(() => {
    setCartCount(0);
    setCartItems([]);
    setCartOpen(false);
  }, []);

  // Toggle cart
  const toggleCart = () => {
    setCartOpen((prev) => !prev);
  };

  // Add to cart
  const addToCartGlobal = async (productId, qty = 1) => {
    try {
      await cartService.addToCart(productId, qty);
      await refreshCart();
    } catch (err) {
      console.log("Add to cart failed:", err);
    }
  };

  // ✅ INIT CART (ONLY ON MOUNT)
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("access");

      if (!token) {
        clearCart();
        return;
      }

      await refreshCart();
    };

    init();
  }, [refreshCart, clearCart]);

  return (
    <CartContext.Provider
      value={{
        cartCount,
        cartItems,
        cartOpen,
        setCartOpen,
        setCartCount,
        setCartItems,
        toggleCart,
        addToCartGlobal,
        refreshCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};