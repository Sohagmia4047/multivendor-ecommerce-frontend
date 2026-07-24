import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaArrowRight,
  FaMinus,
  FaPlus,
  FaShoppingBag,
  FaSyncAlt,
  FaTrashAlt,
} from "react-icons/fa";

import PublicLayout from "../components/PublicLayout";
import cartService from "../utils/cartService";
import { useCart } from "../hooks/useCart";

const formatPrice = (value) => {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "0.00";
  }

  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const normalizeCartItems = (data) => {
  const items = Array.isArray(data?.cart)
    ? data.cart
    : Array.isArray(data)
      ? data
      : [];

  return items.map((item) => ({
    ...item,
    qty: Math.max(1, Number(item?.qty) || 1),
    qtyEditable: Math.max(1, Number(item?.qty) || 1),
  }));
};

const CartSkeleton = () => {
  return (
    <div className="animate-pulse space-y-3 p-3 sm:p-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="grid grid-cols-[76px_minmax(0,1fr)] gap-3 rounded-lg border border-gray-100 p-3 lg:grid-cols-[72px_minmax(180px,1fr)_110px_150px_120px_80px]"
        >
          <div className="h-20 rounded-md bg-gray-200 lg:h-16" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-gray-200" />
            <div className="h-4 w-2/3 rounded bg-gray-200" />
          </div>
          <div className="hidden h-5 rounded bg-gray-200 lg:block" />
          <div className="hidden h-10 rounded bg-gray-200 lg:block" />
          <div className="hidden h-5 rounded bg-gray-200 lg:block" />
          <div className="hidden h-8 rounded bg-gray-200 lg:block" />
        </div>
      ))}
    </div>
  );
};

const QuantityControl = ({
  value,
  onChange,
  onDecrease,
  onIncrease,
  onRefresh,
  disabled = false,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="inline-flex h-10 items-center overflow-hidden rounded-md border border-gray-300 bg-white">
        <button
          type="button"
          onClick={onDecrease}
          disabled={disabled || Number(value) <= 1}
          aria-label="Decrease quantity"
          className="grid h-full w-9 place-items-center text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <FaMinus className="text-[10px]" />
        </button>

        <input
          type="number"
          min="1"
          inputMode="numeric"
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              onRefresh();
            }
          }}
          aria-label="Product quantity"
          className="h-full w-11 border-x border-gray-200 bg-white text-center text-sm font-semibold text-gray-800 outline-none disabled:bg-gray-50"
        />

        <button
          type="button"
          onClick={onIncrease}
          disabled={disabled}
          aria-label="Increase quantity"
          className="grid h-full w-9 place-items-center text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <FaPlus className="text-[10px]" />
        </button>
      </div>

      <button
        type="button"
        onClick={onRefresh}
        disabled={disabled}
        aria-label="Update product quantity"
        className="grid h-10 w-10 place-items-center rounded-md border border-gray-300 bg-white text-gray-500 transition hover:border-orange-500 hover:text-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <FaSyncAlt className={disabled ? "animate-spin" : ""} />
      </button>
    </div>
  );
};

const EmptyCart = ({ onContinue }) => {
  return (
    <div className="rounded-lg border border-gray-100 bg-white px-4 py-16 text-center shadow-sm sm:py-20">
      <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-orange-50 text-3xl text-orange-500">
        <FaShoppingBag />
      </div>

      <h1 className="mt-5 text-xl font-semibold text-gray-900 sm:text-2xl">
        Your cart is empty
      </h1>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
        Add products to your cart and they will appear here.
      </p>

      <button
        type="button"
        onClick={onContinue}
        className="mt-6 inline-flex items-center gap-2 rounded-md bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 active:scale-[0.99]"
      >
        <FaArrowLeft className="text-xs" />
        Continue shopping
      </button>
    </div>
  );
};

const Cart = () => {
  const navigate = useNavigate();
  const { refreshCart } = useCart();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingIds, setUpdatingIds] = useState([]);
  const [clearing, setClearing] = useState(false);
  const [refreshingCart, setRefreshingCart] = useState(false);

  const [country, setCountry] = useState("Bangladesh");
  const [stateName, setStateName] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [coupon, setCoupon] = useState("");

  const fetchCart = useCallback(async (showRefreshState = false) => {
    if (showRefreshState) {
      setRefreshingCart(true);
    } else {
      setLoading(true);
    }

    try {
      const data = await cartService.getCart();
      setCartItems(normalizeCartItems(data));
    } catch (error) {
      console.error("Cart fetch error:", error);
      setCartItems([]);
    } finally {
      setLoading(false);
      setRefreshingCart(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const setItemUpdating = (cartId, active) => {
    setUpdatingIds((current) =>
      active
        ? [...new Set([...current, cartId])]
        : current.filter((id) => id !== cartId),
    );
  };

  const handleQtyInput = (cartId, value) => {
    const normalizedValue = value === "" ? "" : Math.max(1, Number(value) || 1);

    setCartItems((current) =>
      current.map((item) =>
        item.id === cartId
          ? {
              ...item,
              qtyEditable: normalizedValue,
            }
          : item,
      ),
    );
  };

  const updateQuantity = async (cartId, quantity) => {
    const normalizedQuantity = Math.max(1, Number(quantity) || 1);

    setItemUpdating(cartId, true);

    try {
      await cartService.updateCartItem(cartId, normalizedQuantity);

      setCartItems((current) =>
        current.map((item) =>
          item.id === cartId
            ? {
                ...item,
                qty: normalizedQuantity,
                qtyEditable: normalizedQuantity,
              }
            : item,
        ),
      );

      await refreshCart();
    } catch (error) {
      console.error("Cart quantity update error:", error);

      setCartItems((current) =>
        current.map((item) =>
          item.id === cartId
            ? {
                ...item,
                qtyEditable: item.qty,
              }
            : item,
        ),
      );
    } finally {
      setItemUpdating(cartId, false);
    }
  };

  const increaseQuantity = (item) => {
    updateQuantity(item.id, Number(item.qty) + 1);
  };

  const decreaseQuantity = (item) => {
    if (Number(item.qty) > 1) {
      updateQuantity(item.id, Number(item.qty) - 1);
    }
  };

  const refreshItem = (item) => {
    updateQuantity(item.id, item.qtyEditable);
  };

  const removeItem = async (cartId) => {
    setItemUpdating(cartId, true);

    try {
      await cartService.removeCartItem(cartId);
      setCartItems((current) => current.filter((item) => item.id !== cartId));
      await refreshCart();
    } catch (error) {
      console.error("Remove cart item error:", error);
    } finally {
      setItemUpdating(cartId, false);
    }
  };

  const clearCart = async () => {
    if (cartItems.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to remove all products from your cart?",
    );

    if (!confirmed) {
      return;
    }

    setClearing(true);

    try {
      await cartService.clearCart();
      setCartItems([]);
      await refreshCart();
    } catch (error) {
      console.error("Clear cart error:", error);
    } finally {
      setClearing(false);
    }
  };

  const subtotal = useMemo(
    () =>
      cartItems.reduce((sum, item) => {
        const price = Number(item?.product?.price) || 0;
        const quantity = Number(item?.qty) || 0;

        return sum + price * quantity;
      }, 0),
    [cartItems],
  );

  const shipping = 0;
  const total = subtotal + shipping;

  return (
    <PublicLayout>
      <main className="min-h-screen overflow-x-hidden bg-[#f5f5f5] pb-24 text-gray-700 lg:pb-8">
        <div className="mx-auto w-full max-w-[1500px] px-2.5 py-4 sm:px-4 md:px-6 lg:py-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
                Shopping cart
              </h1>

              <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                {loading
                  ? "Loading your cart..."
                  : `${cartItems.length} product${
                      cartItems.length === 1 ? "" : "s"
                    } in your cart`}
              </p>
            </div>

            {!loading && cartItems.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                disabled={clearing}
                className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-600 transition hover:border-red-400 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
              >
                <FaTrashAlt />
                {clearing ? "Clearing..." : "Clear cart"}
              </button>
            )}
          </div>

          {loading ? (
            <div className="rounded-lg border border-gray-100 bg-white shadow-sm">
              <CartSkeleton />
            </div>
          ) : cartItems.length === 0 ? (
            <EmptyCart onContinue={() => navigate("/product-page")} />
          ) : (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
              <div className="min-w-0 space-y-4 xl:col-span-8 2xl:col-span-9">
                <section className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
                  {/* Desktop table header */}
                  <div className="hidden grid-cols-[72px_minmax(180px,1fr)_110px_150px_120px_80px] items-center gap-3 border-b border-gray-200 bg-gray-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 lg:grid">
                    <span>Product</span>
                    <span>Details</span>
                    <span>Unit price</span>
                    <span>Quantity</span>
                    <span>Subtotal</span>
                    <span className="text-center">Action</span>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {cartItems.map((item) => {
                      const product = item?.product || {};
                      const price = Number(product.price) || 0;
                      const itemSubtotal = price * Number(item.qty || 0);
                      const isUpdating = updatingIds.includes(item.id);

                      return (
                        <article
                          key={item.id}
                          className={`p-3 transition sm:p-4 ${
                            isUpdating ? "bg-gray-50/70" : "bg-white"
                          }`}
                        >
                          {/* Mobile and tablet */}
                          <div className="lg:hidden">
                            <div className="flex items-start gap-3">
                              <button
                                type="button"
                                onClick={() =>
                                  navigate(`/product-detail/${product.id}`)
                                }
                                className="h-24 w-24 shrink-0 overflow-hidden rounded-md border border-gray-200 bg-white p-1.5 sm:h-28 sm:w-28"
                              >
                                <img
                                  src={product.image}
                                  alt={product.title || "Cart product"}
                                  loading="lazy"
                                  className="h-full w-full object-contain"
                                />
                              </button>

                              <div className="min-w-0 flex-1">
                                <button
                                  type="button"
                                  onClick={() =>
                                    navigate(`/product-detail/${product.id}`)
                                  }
                                  className="block w-full text-left"
                                >
                                  <h2
                                    className="overflow-hidden text-sm font-medium leading-5 text-gray-800 transition hover:text-orange-500 sm:text-base"
                                    style={{
                                      display: "-webkit-box",
                                      WebkitLineClamp: 2,
                                      WebkitBoxOrient: "vertical",
                                    }}
                                  >
                                    {product.title || "Untitled product"}
                                  </h2>
                                </button>

                                {product.category?.title && (
                                  <p className="mt-1 truncate text-[11px] text-gray-400 sm:text-xs">
                                    {product.category.title}
                                  </p>
                                )}

                                <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                                  <span className="text-base font-bold text-orange-500 sm:text-lg">
                                    ${formatPrice(price)}
                                  </span>

                                  {product.old_price && (
                                    <span className="text-xs text-gray-400 line-through">
                                      ${formatPrice(product.old_price)}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => removeItem(item.id)}
                                disabled={isUpdating}
                                aria-label="Remove product"
                                className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-gray-400 transition hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <FaTrashAlt className="text-sm" />
                              </button>
                            </div>

                            <div className="mt-4 flex flex-wrap items-end justify-between gap-3 border-t border-gray-100 pt-3">
                              <div>
                                <p className="mb-1.5 text-[10px] uppercase tracking-wide text-gray-400">
                                  Quantity
                                </p>

                                <QuantityControl
                                  value={item.qtyEditable}
                                  disabled={isUpdating}
                                  onChange={(value) =>
                                    handleQtyInput(item.id, value)
                                  }
                                  onDecrease={() => decreaseQuantity(item)}
                                  onIncrease={() => increaseQuantity(item)}
                                  onRefresh={() => refreshItem(item)}
                                />
                              </div>

                              <div className="text-right">
                                <p className="text-[10px] uppercase tracking-wide text-gray-400">
                                  Subtotal
                                </p>
                                <p className="mt-1 text-lg font-bold text-gray-900">
                                  ${formatPrice(itemSubtotal)}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Laptop and desktop */}
                          <div className="hidden grid-cols-[72px_minmax(180px,1fr)_110px_150px_120px_80px] items-center gap-3 lg:grid">
                            <button
                              type="button"
                              onClick={() =>
                                navigate(`/product-detail/${product.id}`)
                              }
                              className="h-16 w-16 overflow-hidden rounded-md border border-gray-200 bg-white p-1"
                            >
                              <img
                                src={product.image}
                                alt={product.title || "Cart product"}
                                loading="lazy"
                                className="h-full w-full object-contain"
                              />
                            </button>

                            <div className="min-w-0">
                              <button
                                type="button"
                                onClick={() =>
                                  navigate(`/product-detail/${product.id}`)
                                }
                                className="block w-full text-left"
                              >
                                <h2
                                  className="overflow-hidden text-sm font-medium leading-5 text-gray-800 transition hover:text-orange-500"
                                  style={{
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                  }}
                                >
                                  {product.title || "Untitled product"}
                                </h2>
                              </button>

                              {product.category?.title && (
                                <p className="mt-1 truncate text-xs text-gray-400">
                                  {product.category.title}
                                </p>
                              )}
                            </div>

                            <div className="text-sm font-semibold text-gray-800">
                              ${formatPrice(price)}
                            </div>

                            <QuantityControl
                              value={item.qtyEditable}
                              disabled={isUpdating}
                              onChange={(value) =>
                                handleQtyInput(item.id, value)
                              }
                              onDecrease={() => decreaseQuantity(item)}
                              onIncrease={() => increaseQuantity(item)}
                              onRefresh={() => refreshItem(item)}
                            />

                            <div className="text-sm font-bold text-orange-500">
                              ${formatPrice(itemSubtotal)}
                            </div>

                            <div className="text-center">
                              <button
                                type="button"
                                onClick={() => removeItem(item.id)}
                                disabled={isUpdating}
                                aria-label="Remove product"
                                className="grid h-9 w-9 place-items-center rounded-full text-gray-400 transition hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <FaTrashAlt />
                              </button>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>

                  <div className="flex flex-col gap-2 border-t border-gray-200 bg-gray-50 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
                    <button
                      type="button"
                      onClick={() => navigate("/product-page")}
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-orange-500 hover:text-orange-500"
                    >
                      <FaArrowLeft className="text-xs" />
                      Continue shopping
                    </button>

                    <button
                      type="button"
                      onClick={() => fetchCart(true)}
                      disabled={refreshingCart}
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <FaSyncAlt
                        className={refreshingCart ? "animate-spin" : ""}
                      />
                      {refreshingCart ? "Updating..." : "Update cart"}
                    </button>
                  </div>
                </section>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <section className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
                    <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
                      Shipping estimate
                    </h2>
                    <p className="mt-1 text-xs leading-5 text-gray-500 sm:text-sm">
                      Enter your delivery location to estimate shipping.
                    </p>

                    <div className="mt-4 space-y-3">
                      <select
                        value={country}
                        onChange={(event) => setCountry(event.target.value)}
                        className="h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                      >
                        <option>Bangladesh</option>
                        <option>United Kingdom</option>
                        <option>India</option>
                        <option>United States</option>
                      </select>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <input
                          type="text"
                          value={stateName}
                          onChange={(event) => setStateName(event.target.value)}
                          placeholder="State / district"
                          className="h-11 min-w-0 rounded-md border border-gray-300 px-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                        />

                        <input
                          type="text"
                          value={postalCode}
                          onChange={(event) => setPostalCode(event.target.value)}
                          placeholder="Postal code"
                          className="h-11 min-w-0 rounded-md border border-gray-300 px-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                        />
                      </div>

                      <button
                        type="button"
                        className="w-full rounded-md border border-orange-500 px-4 py-2.5 text-sm font-semibold text-orange-500 transition hover:bg-orange-50"
                      >
                        Calculate shipping
                      </button>
                    </div>
                  </section>

                  <section className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
                    <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
                      Apply coupon
                    </h2>
                    <p className="mt-1 text-xs leading-5 text-gray-500 sm:text-sm">
                      Enter a valid promotional code.
                    </p>

                    <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                      <input
                        type="text"
                        value={coupon}
                        onChange={(event) => setCoupon(event.target.value)}
                        placeholder="Coupon code"
                        className="h-11 min-w-0 flex-1 rounded-md border border-gray-300 px-3 text-sm uppercase outline-none transition placeholder:normal-case placeholder:text-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                      />

                      <button
                        type="button"
                        className="h-11 shrink-0 rounded-md bg-gray-900 px-5 text-sm font-semibold text-white transition hover:bg-black"
                      >
                        Apply
                      </button>
                    </div>

                    <div className="mt-5 rounded-md bg-orange-50 p-3">
                      <p className="text-xs leading-5 text-orange-700">
                        Coupon discounts will appear in your order summary after
                        a valid code is applied.
                      </p>
                    </div>
                  </section>
                </div>
              </div>

              <aside className="xl:col-span-4 2xl:col-span-3">
                <div className="sticky top-20 rounded-lg border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Order summary
                  </h2>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between gap-4 text-sm">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="font-semibold text-gray-800">
                        ${formatPrice(subtotal)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4 text-sm">
                      <span className="text-gray-500">Shipping</span>
                      <span className="font-semibold text-green-600">
                        {shipping === 0 ? "Free" : `$${formatPrice(shipping)}`}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4 text-sm">
                      <span className="text-gray-500">Discount</span>
                      <span className="font-semibold text-gray-800">$0.00</span>
                    </div>
                  </div>

                  <div className="mt-5 flex items-end justify-between gap-4 border-t border-gray-200 pt-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Total</p>
                      <p className="mt-0.5 text-xs text-gray-400">
                        Taxes included
                      </p>
                    </div>

                    <p className="text-2xl font-bold text-orange-500">
                      ${formatPrice(total)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate("/checkout")}
                    className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-orange-500 px-4 text-sm font-semibold text-white transition hover:bg-orange-600 active:scale-[0.99]"
                  >
                    Proceed to checkout
                    <FaArrowRight className="text-xs" />
                  </button>

                  <p className="mt-3 text-center text-[11px] leading-5 text-gray-400">
                    Secure checkout. Your information is protected.
                  </p>
                </div>
              </aside>
            </div>
          )}
        </div>

        {!loading && cartItems.length > 0 && (
          <div className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white px-3 py-2 shadow-[0_-4px_18px_rgba(0,0,0,0.08)] lg:hidden">
            <div className="mx-auto flex max-w-[1500px] items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-[10px] uppercase tracking-wide text-gray-400">
                  Total
                </p>
                <p className="truncate text-lg font-bold text-orange-500">
                  ${formatPrice(total)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/checkout")}
                className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-orange-500 px-5 text-sm font-semibold text-white"
              >
                Checkout
                <FaArrowRight className="text-xs" />
              </button>
            </div>
          </div>
        )}
      </main>
    </PublicLayout>
  );
};

export default Cart;
