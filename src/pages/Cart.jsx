import React, { useEffect, useState } from "react";
import PublicLayout from "../components/PublicLayout";
import cartService from "../utils/cartService";
import { FaTrashAlt, FaSyncAlt, FaArrowRight } from "react-icons/fa";
import { useCart } from "../hooks/useCart";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { refreshCart } = useCart();
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const data = await cartService.getCart();

      setCartItems(
        (data.cart || []).map((item) => ({
          ...item,
          qtyEditable: item.qty,
        })),
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleQtyInput = (cartId, value) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === cartId
          ? {
              ...item,
              qtyEditable: value,
            }
          : item,
      ),
    );
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Update Quantity
  const updateQty = async (cartId, qty) => {
    try {
      if (qty < 1) return;

      await cartService.updateCartItem(cartId, qty);

      setCartItems((prev) =>
        prev.map((item) =>
          item.id === cartId
            ? {
                ...item,
                qty,
                qtyEditable: qty,
              }
            : item,
        ),
      );
      await refreshCart();
    } catch (error) {
      console.log(error);
    }
  };

  // Increase
  const increaseQty = (item) => {
    updateQty(item.id, item.qty + 1);
  };

  // Decrease
  const decreaseQty = (item) => {
    if (item.qty > 1) {
      updateQty(item.id, item.qty - 1);
    }
  };

  // Refresh
  const refreshItem = async (item) => {
    try {
      const qty = Number(item.qtyEditable);

      if (!qty || qty < 1) return;

      await cartService.updateCartItem(item.id, qty);

      setCartItems((prev) =>
        prev.map((cart) =>
          cart.id === item.id
            ? {
                ...cart,
                qty,
                qtyEditable: qty,
              }
            : cart,
        ),
      );
    } catch (error) {
      console.log(error);
    }
  };

  // Remove
  const removeItem = async (cartId) => {
  try {
    await cartService.removeCartItem(cartId);

    setCartItems((prev) =>
      prev.filter((item) => item.id !== cartId)
    );

    await refreshCart();
  } catch (error) {
    console.log(error);
  }
};

  const clearCart = async () => {
  try {
    await cartService.clearCart();

    setCartItems([]);

    await refreshCart();
  } catch (error) {
    console.log(error);
  }
};

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.product.price) * Number(item.qty),
    0,
  );

  const shipping = 0;
  const total = subtotal + shipping;

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto py-6 px-4">
        {/* TOP */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-gray-600 font-semibold">
            There are {cartItems.length} products in your cart
          </h2>

          <button
            onClick={clearCart}
            className="text-gray-500 hover:text-red-500 text-sm flex items-center gap-2"
          >
            <FaTrashAlt />
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT */}
          <div className="lg:col-span-8 border rounded-lg overflow-hidden bg-white">
            {/* HEADER */}
            <div className="grid grid-cols-2 md:grid-cols-7 gap-8 items-center border-t p-4">
              <div>Product</div>
              <div>Title</div>
              <div>Unit Price</div>
              <div>Quantity</div>
              <div>Subtotal</div>
              <div>Refresh</div>
              <div>Remove</div>
            </div>

            {loading ? (
              <div className="p-10 text-center">Loading...</div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-7 items-center border-t p-4"
                >
                  {/* IMAGE */}
                  <div>
                    <img
                      src={item.product.image}
                      alt=""
                      className="w-12 h-12 md:w-12 md:h-12 object-cover border rounded-xl"
                    />
                  </div>

                  {/* TITLE */}
                  <div className="font-medium text-[14px] md:text-[14px] line-clamp-2">
                    {item.product.title}
                  </div>

                  {/* PRICE */}
                  <div className="font-semibold text-[16px] md:text-[16px] ml-4">
                    ${Number(item.product.price).toFixed(2)}
                  </div>

                  {/* QTY */}
                  <div className="flex justify-center">
                    <div className="flex items-center border border-gray-200 rounded-xl mr-4 overflow-hidden shadow-sm">
                      <button
                        onClick={() => decreaseQty(item)}
                        className="w-6 h-6 md:w-6 md:h-6 flex items-center justify-center bg-gray-50 hover:bg-red-300 text-lg font-bold"
                      >
                        -
                      </button>

                      <input
                        type="number"
                        min="1"
                        value={item.qtyEditable}
                        onChange={(e) =>
                          handleQtyInput(item.id, e.target.value)
                        }
                        className="w-6 md:w-6 h-6 md:h-6 text-center border-x outline-none text-sm md:text-[15px] font-semibold"
                      />

                      <button
                        onClick={() => increaseQty(item)}
                        className="w-6 h-6 md:w-6 md:h-6 flex items-center justify-center bg-gray-50 hover:bg-green-300 text-lg font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* SUBTOTAL */}
                  <div className="text-green-600 ml-5 font-bold text-sm md:text-base">
                    $
                    {(Number(item.product.price) * Number(item.qty)).toFixed(2)}
                  </div>

                  {/* REFRESH */}
                  <div>
                    <button
                      onClick={() => refreshItem(item)}
                      className="text-gray-500 ml-10 hover:text-green-500"
                    >
                      <FaSyncAlt />
                    </button>
                  </div>

                  {/* REMOVE */}
                  <div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-500 ml-10 hover:text-red-500"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
              ))
            )}

            {/* EXTRA CART SECTION */}
            <div className="p-6 border-t">
              <div className="flex justify-between items-center mb-6">
                <button onClick={() => navigate("/product-page")} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
                  ← Continue Shopping
                </button>

                <button
                  onClick={fetchCart}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                >
                  <FaSyncAlt className="inline mr-2" />
                  Update Cart
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* SHIPPING */}
                <div className="border rounded-xl p-6 bg-white">
                  <h3 className="text-xl font-bold text-gray-700">
                    Calculate Shipping
                  </h3>

                  <p className="text-gray-400 text-[14px] mt-1 mb-2">
                    Flat rate:
                    <span className="font-semibold ml-1 text-[14px]">5%</span>
                  </p>

                  <div className="space-y-2">
                    <select className="w-full border rounded-lg px-4 py-2 outline-none">
                      <option>United Kingdom</option>
                      <option>Bangladesh</option>
                      <option>India</option>
                      <option>USA</option>
                    </select>

                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="State / Country"
                        className="border rounded-lg px-4 py-2 outline-none"
                      />

                      <input
                        type="text"
                        placeholder="PostCode / ZIP"
                        className="border rounded-lg px-4 py-2 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* COUPON */}
                <div className="border rounded-xl p-6 bg-white">
                  <h3 className="text-xl font-bold text-gray-700">
                    Apply Coupon
                  </h3>

                  <p className="text-gray-400 mt-1 text-[14px] mb-2">
                    Using A Promo Code?
                  </p>

                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Enter Your Coupon"
                      className="flex-1 border rounded-lg px-4 py-2 outline-none"
                    />

                    <button className="bg-green-500 hover:bg-green-600 text-white px-4 rounded-lg font-medium">
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-4">
            <div className="border rounded-xl bg-white p-5 shadow-sm">
              <div className="flex justify-between py-3 border-b">
                <span>Subtotal</span>

                <span className="font-bold text-green-600">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between py-3 border-b">
                <span>Shipping</span>

                <span className="font-bold">Free</span>
              </div>

              <div className="flex justify-between py-3">
                <span>Total</span>

                <span className="font-bold text-green-600 text-xl">
                  ${total.toFixed(2)}
                </span>
              </div>

              <button onClick={() => navigate("/checkout")} className="w-full mt-4 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-3 rounded">
                Proceed To Checkout
                <FaArrowRight className="inline ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Cart;
