import { useEffect, useRef } from "react";
import { useCart } from "../hooks/useCart";
import { Link } from "react-router-dom";

const MiniCart = () => {
  const { cartItems, cartOpen, setCartOpen } = useCart();
  const cartRef = useRef(null);

  // 🧠 outside click detect
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setCartOpen(false);
      }
    };

    if (cartOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [cartOpen, setCartOpen]);

  if (!cartOpen) return null;

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.qty,
    0
  );

  return (
    <>
      {/* 🌑 BACKDROP (important UX) */}
      <div className="fixed inset-0 bg-black/30 z-99998" />

      {/* 🛒 CART */}
      <div
        ref={cartRef}
        className="fixed top-22 right-0 rounded w-65 h-[70vh] bg-white shadow-2xl z-99999 p-4 flex flex-col"
      >
        {/* HEADER */}
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="font-bold text-[16px]">Your Cart</h2>
          <button onClick={() => setCartOpen(false)}>✖</button>
        </div>

        {/* ITEMS */}
        <div className="mt-2 space-y-2 flex-1 overflow-y-auto">
          {cartItems.length === 0 ? (
            <p className="text-center text-gray-500 mt-6">
              No items in cart
            </p>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex gap-3 border-b pb-1">
                <img
                  src={item.product.image}
                  className="w-10 h-10 object-cover rounded"
                  alt=""
                />

                <div className="flex-1">
                  <p className="text-[13px] font-semibold">
                    {item.product.title}
                  </p>

                  <p className="text-[13px] text-gray-500">
                    Qty: {item.qty}
                  </p>

                  <p className="text-green-600 text-[13px] font-semibold">
                    ${item.product.price * item.qty}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* TOTAL + BUTTONS */}
        {cartItems.length > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between font-bold text-[15px]">
              <span>Total:</span>
              <span className="text-green-600">
                ${totalPrice.toFixed(2)}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <Link
              to="/cart-page"
                onClick={() => {
                  setCartOpen(false); 
                }}
                className="bg-gray-800 text-center text-[13px] text-white py-2 rounded"
              >
                View Cart
              </Link>

              <button
                onClick={() => {
                  setCartOpen(false);
                  window.location.href = "/checkout";
                }}
                className="bg-green-500 text-[13px] text-white py-2 rounded"
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MiniCart;