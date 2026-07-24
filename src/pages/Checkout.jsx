import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaCreditCard,
  FaLock,
  FaMoneyBillWave,
  FaShoppingBag,
  FaUniversity,
} from "react-icons/fa";

import PublicLayout from "../components/PublicLayout";
import cartService from "../utils/cartService";
import api from "../utils/axiosInstance";
import addressService from "../utils/addressService";

const INITIAL_FORM_DATA = {
  first_name: "",
  last_name: "",
  company: "",
  country: "Bangladesh",
  district: "",
  city: "",
  address: "",
  postcode: "",
  phone: "",
  email: "",
  account_password: "",

  ship_first_name: "",
  ship_last_name: "",
  ship_company: "",
  ship_country: "Bangladesh",
  ship_district: "",
  ship_city: "",
  ship_address: "",
  ship_postcode: "",

  order_notes: "",
};

const formatPrice = (value) => {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "0.00";
  }

  return amount.toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const normalizeCartItems = (data) => {
  if (Array.isArray(data?.cart)) {
    return data.cart;
  }

  if (Array.isArray(data)) {
    return data;
  }

  return [];
};

const Field = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
  required = false,
  disabled = false,
  autoComplete,
  className = "",
}) => {
  return (
    <div className={className}>
      <label
        htmlFor={name}
        className="mb-1.5 block text-xs font-medium text-gray-700 sm:text-sm"
      >
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        className="h-11 w-full min-w-0 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
      />
    </div>
  );
};

const CheckoutSkeleton = () => {
  return (
    <main className="min-h-screen bg-[#f5f5f5] px-3 py-5 sm:px-5">
      <div className="mx-auto max-w-[1450px] animate-pulse">
        <div className="mb-5 h-8 w-44 rounded bg-gray-200" />

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          <div className="space-y-4 xl:col-span-8">
            <div className="h-24 rounded-lg bg-white" />
            <div className="h-[720px] rounded-lg bg-white" />
          </div>

          <div className="space-y-4 xl:col-span-4">
            <div className="h-96 rounded-lg bg-white" />
            <div className="h-72 rounded-lg bg-white" />
          </div>
        </div>
      </div>
    </main>
  );
};

const EmptyCheckout = () => {
  return (
    <main className="min-h-[70vh] bg-[#f5f5f5] px-3 py-8 sm:px-5">
      <div className="mx-auto max-w-[1450px]">
        <div className="rounded-lg border border-gray-100 bg-white px-4 py-16 text-center shadow-sm sm:py-20">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-orange-50 text-3xl text-orange-500">
            <FaShoppingBag />
          </div>

          <h1 className="mt-5 text-xl font-semibold text-gray-900 sm:text-2xl">
            Your cart is empty
          </h1>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
            Add products to your cart before continuing to checkout.
          </p>

          <Link
            to="/product-page"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            <FaArrowLeft className="text-xs" />
            Continue shopping
          </Link>
        </div>
      </div>
    </main>
  );
};

const Checkout = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [addressLoading, setAddressLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [createAccount, setCreateAccount] = useState(false);
  const [shipDifferent, setShipDifferent] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  const fetchCart = useCallback(async () => {
    setLoading(true);

    try {
      const data = await cartService.getCart();
      const items = normalizeCartItems(data);

      setCartItems(items);

      const calculatedSubtotal = items.reduce((sum, item) => {
        const itemPrice =
          Number(item?.total) ||
          Number(item?.product?.price || 0) * Number(item?.qty || 0);

        return sum + itemPrice;
      }, 0);

      setSubtotal(
        Number.isFinite(Number(data?.total_price))
          ? Number(data.total_price)
          : calculatedSubtotal,
      );
    } catch (error) {
      console.error("Checkout cart fetch error:", error);
      setCartItems([]);
      setSubtotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadDefaultAddress = useCallback(async () => {
    setAddressLoading(true);

    try {
      const response = await addressService.getDefaultAddress();
      const address = response?.data ?? response;

      if (address && typeof address === "object") {
        setFormData((current) => ({
          ...current,
          first_name: address.first_name ?? current.first_name,
          last_name: address.last_name ?? current.last_name,
          company: address.company ?? current.company,
          country: address.country ?? current.country,
          district: address.district ?? current.district,
          city: address.city ?? current.city,
          address: address.address ?? current.address,
          postcode: address.postcode ?? current.postcode,
          phone: address.phone ?? current.phone,
          email: address.email ?? current.email,
        }));
      }
    } catch (error) {
      console.error("Default address fetch error:", error);
    } finally {
      setAddressLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
    loadDefaultAddress();
  }, [fetchCart, loadDefaultAddress]);

  const shippingCost = subtotal > 0 ? 60 : 0;
  const discount = 0;
  const grandTotal = subtotal + shippingCost - discount;

  const itemCount = useMemo(
    () =>
      cartItems.reduce(
        (total, item) => total + Math.max(1, Number(item?.qty) || 1),
        0,
      ),
    [cartItems],
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    if (message.text) {
      setMessage({ type: "", text: "" });
    }
  };

  const buildPayload = () => {
    const payload = {
      ...formData,
      payment_method: paymentMethod,
      create_account: createAccount,
      ship_different: shipDifferent,
    };

    if (!createAccount) {
      delete payload.account_password;
    }

    if (!shipDifferent) {
      delete payload.ship_first_name;
      delete payload.ship_last_name;
      delete payload.ship_company;
      delete payload.ship_country;
      delete payload.ship_district;
      delete payload.ship_city;
      delete payload.ship_address;
      delete payload.ship_postcode;
    }

    return payload;
  };

  const handlePlaceOrder = async (event) => {
    event.preventDefault();

    if (cartItems.length === 0 || submitting) {
      return;
    }

    setSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const payload = buildPayload();

      if (paymentMethod === "online") {
        const response = await api.post("core/checkout/", payload);
        const paymentUrl = response?.data?.payment_url;

        if (!paymentUrl) {
          throw new Error("Payment URL was not returned.");
        }

        window.location.assign(paymentUrl);
        return;
      }

      const response = await api.post("core/place-order/", payload);

      setMessage({
        type: "success",
        text: "Your order has been placed successfully.",
      });

      const orderId =
        response?.data?.order_id ??
        response?.data?.id ??
        response?.data?.order?.id;

      if (orderId) {
        navigate(`/order-success?order=${encodeURIComponent(orderId)}`);
      } else {
        window.alert("Order placed successfully.");
      }
    } catch (error) {
      console.error(
        "Place order error:",
        error?.response?.data || error?.message || error,
      );

      const apiMessage =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.response?.data?.error;

      setMessage({
        type: "error",
        text:
          typeof apiMessage === "string"
            ? apiMessage
            : "Unable to place the order. Please check your information and try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCoupon = () => {
    if (!couponCode.trim()) {
      setMessage({
        type: "error",
        text: "Enter a coupon code before applying it.",
      });
      return;
    }

    setMessage({
      type: "error",
      text: "Coupon validation is not connected to an API yet.",
    });
  };

  if (loading) {
    return (
      <PublicLayout>
        <CheckoutSkeleton />
      </PublicLayout>
    );
  }

  if (cartItems.length === 0) {
    return (
      <PublicLayout>
        <EmptyCheckout />
      </PublicLayout>
    );
  }

  const paymentOptions = [
    {
      value: "cod",
      title: "Cash on delivery",
      description: "Pay in cash when your order arrives.",
      icon: <FaMoneyBillWave />,
    },
    {
      value: "online",
      title: "Online payment",
      description: "Pay securely through the online payment gateway.",
      icon: <FaCreditCard />,
    },
    {
      value: "bank",
      title: "Direct bank transfer",
      description: "Transfer the amount directly to our bank account.",
      icon: <FaUniversity />,
    },
  ];

  return (
    <PublicLayout>
      <main className="min-h-screen overflow-x-hidden bg-[#f5f5f5] pb-28 text-gray-700 lg:pb-8">
        <form
          onSubmit={handlePlaceOrder}
          className="mx-auto w-full max-w-[1450px] px-2.5 py-4 sm:px-4 md:px-6 lg:py-6"
        >
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl lg:text-3xl">
                Checkout
              </h1>

              <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                Complete your delivery and payment information.
              </p>
            </div>

            <Link
              to="/cart-page"
              className="inline-flex items-center gap-2 text-xs font-medium text-orange-500 transition hover:text-orange-600 sm:text-sm"
            >
              <FaArrowLeft className="text-[10px]" />
              Back to cart
            </Link>
          </div>

          {message.text && (
            <div
              className={`mb-4 rounded-md border px-3 py-3 text-sm ${
                message.type === "success"
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            {/* Left side */}
            <div className="min-w-0 space-y-4 xl:col-span-8">
              {/* Coupon */}
              <section className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                  <div className="min-w-0 flex-1">
                    <label
                      htmlFor="coupon"
                      className="mb-1.5 block text-xs font-medium text-gray-700 sm:text-sm"
                    >
                      Have a coupon?
                    </label>

                    <input
                      id="coupon"
                      type="text"
                      value={couponCode}
                      onChange={(event) => setCouponCode(event.target.value)}
                      placeholder="Enter coupon code"
                      className="h-11 w-full rounded-md border border-gray-300 px-3 text-sm uppercase outline-none transition placeholder:normal-case placeholder:text-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleCoupon}
                    className="h-11 shrink-0 rounded-md bg-gray-900 px-5 text-sm font-semibold text-white transition hover:bg-black"
                  >
                    Apply coupon
                  </button>
                </div>
              </section>

              {/* Billing */}
              <section className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm sm:p-5 lg:p-6">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">
                      Billing details
                    </h2>
                    <p className="mt-1 text-xs text-gray-500">
                      Fields marked with * are required.
                    </p>
                  </div>

                  {addressLoading && (
                    <span className="text-xs text-gray-400">
                      Loading saved address...
                    </span>
                  )}
                </div>

                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field
                    label="First name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                    autoComplete="given-name"
                  />

                  <Field
                    label="Last name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                    autoComplete="family-name"
                  />

                  <Field
                    label="Company name"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Optional"
                    autoComplete="organization"
                    className="sm:col-span-2"
                  />

                  <Field
                    label="Country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    disabled
                    className="sm:col-span-2"
                  />

                  <Field
                    label="District"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    required
                    autoComplete="address-level1"
                  />

                  <Field
                    label="City / area"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    autoComplete="address-level2"
                  />

                  <Field
                    label="Street address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="House, road, area"
                    required
                    autoComplete="street-address"
                    className="sm:col-span-2"
                  />

                  <Field
                    label="Postcode / ZIP"
                    name="postcode"
                    value={formData.postcode}
                    onChange={handleChange}
                    autoComplete="postal-code"
                  />

                  <Field
                    label="Phone number"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+880..."
                    required
                    autoComplete="tel"
                  />

                  <Field
                    label="Email address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    className="sm:col-span-2"
                  />
                </div>

                {/* Create account */}
                <div className="mt-6 rounded-md border border-gray-200 bg-gray-50 p-3 sm:p-4">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={createAccount}
                      onChange={(event) =>
                        setCreateAccount(event.target.checked)
                      }
                      className="mt-0.5 h-4 w-4 shrink-0 accent-orange-500"
                    />

                    <span>
                      <span className="block text-sm font-medium text-gray-800">
                        Create an account
                      </span>
                      <span className="mt-0.5 block text-xs leading-5 text-gray-500">
                        Save your information for faster future checkout.
                      </span>
                    </span>
                  </label>

                  {createAccount && (
                    <div className="mt-4 border-t border-gray-200 pt-4">
                      <Field
                        label="Account password"
                        name="account_password"
                        type="password"
                        value={formData.account_password}
                        onChange={handleChange}
                        required
                        autoComplete="new-password"
                        placeholder="Create a secure password"
                      />
                    </div>
                  )}
                </div>

                {/* Different shipping address */}
                <div className="mt-4 rounded-md border border-gray-200 bg-gray-50 p-3 sm:p-4">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={shipDifferent}
                      onChange={(event) =>
                        setShipDifferent(event.target.checked)
                      }
                      className="mt-0.5 h-4 w-4 shrink-0 accent-orange-500"
                    />

                    <span>
                      <span className="block text-sm font-medium text-gray-800">
                        Ship to a different address
                      </span>
                      <span className="mt-0.5 block text-xs leading-5 text-gray-500">
                        Use another recipient or delivery location.
                      </span>
                    </span>
                  </label>

                  {shipDifferent && (
                    <div className="mt-4 grid grid-cols-1 gap-4 border-t border-gray-200 pt-4 sm:grid-cols-2">
                      <Field
                        label="Recipient first name"
                        name="ship_first_name"
                        value={formData.ship_first_name}
                        onChange={handleChange}
                        required
                        autoComplete="shipping given-name"
                      />

                      <Field
                        label="Recipient last name"
                        name="ship_last_name"
                        value={formData.ship_last_name}
                        onChange={handleChange}
                        required
                        autoComplete="shipping family-name"
                      />

                      <Field
                        label="Company name"
                        name="ship_company"
                        value={formData.ship_company}
                        onChange={handleChange}
                        placeholder="Optional"
                        className="sm:col-span-2"
                      />

                      <Field
                        label="Country"
                        name="ship_country"
                        value={formData.ship_country}
                        onChange={handleChange}
                        disabled
                        className="sm:col-span-2"
                      />

                      <Field
                        label="District"
                        name="ship_district"
                        value={formData.ship_district}
                        onChange={handleChange}
                        required
                      />

                      <Field
                        label="City / area"
                        name="ship_city"
                        value={formData.ship_city}
                        onChange={handleChange}
                        required
                      />

                      <Field
                        label="Street address"
                        name="ship_address"
                        value={formData.ship_address}
                        onChange={handleChange}
                        required
                        placeholder="House, road, area"
                        className="sm:col-span-2"
                      />

                      <Field
                        label="Postcode / ZIP"
                        name="ship_postcode"
                        value={formData.ship_postcode}
                        onChange={handleChange}
                        className="sm:col-span-2"
                      />
                    </div>
                  )}
                </div>

                <div className="mt-5">
                  <label
                    htmlFor="order_notes"
                    className="mb-1.5 block text-xs font-medium text-gray-700 sm:text-sm"
                  >
                    Order notes
                  </label>

                  <textarea
                    id="order_notes"
                    name="order_notes"
                    rows={4}
                    value={formData.order_notes}
                    onChange={handleChange}
                    placeholder="Delivery instructions or other notes..."
                    className="w-full resize-y rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </section>

              {/* Mobile payment */}
              <section className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm sm:p-5 xl:hidden">
                <h2 className="text-lg font-semibold text-gray-900">
                  Payment method
                </h2>

                <div className="mt-4 space-y-3">
                  {paymentOptions.map((option) => {
                    const selected = paymentMethod === option.value;

                    return (
                      <label
                        key={option.value}
                        className={`flex cursor-pointer items-start gap-3 rounded-md border p-3 transition ${
                          selected
                            ? "border-orange-500 bg-orange-50"
                            : "border-gray-200 hover:border-orange-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={option.value}
                          checked={selected}
                          onChange={(event) =>
                            setPaymentMethod(event.target.value)
                          }
                          className="mt-1 h-4 w-4 shrink-0 accent-orange-500"
                        />

                        <span
                          className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${
                            selected
                              ? "bg-orange-500 text-white"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {option.icon}
                        </span>

                        <span className="min-w-0">
                          <span className="block text-sm font-medium text-gray-800">
                            {option.title}
                          </span>
                          <span className="mt-1 block text-xs leading-5 text-gray-500">
                            {option.description}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </section>
            </div>

            {/* Right side */}
            <aside className="min-w-0 xl:col-span-4">
              <div className="space-y-4 xl:sticky xl:top-20">
                {/* Order summary */}
                <section className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Your order
                    </h2>

                    <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-600">
                      {itemCount} item{itemCount === 1 ? "" : "s"}
                    </span>
                  </div>

                  <div className="mt-4 max-h-[360px] space-y-3 overflow-y-auto pr-1">
                    {cartItems.map((item) => {
                      const product = item?.product || {};
                      const quantity = Math.max(1, Number(item?.qty) || 1);
                      const lineTotal =
                        Number(item?.total) ||
                        Number(product?.price || 0) * quantity;

                      return (
                        <article
                          key={item.id}
                          className="flex gap-3 border-b border-gray-100 pb-3 last:border-b-0"
                        >
                          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border border-gray-200 bg-white p-1">
                            <img
                              src={product.image}
                              alt={product.title || "Order product"}
                              loading="lazy"
                              className="h-full w-full object-contain"
                            />

                            <span className="absolute right-0 top-0 grid h-5 min-w-5 place-items-center rounded-bl-md bg-orange-500 px-1 text-[10px] font-semibold text-white">
                              {quantity}
                            </span>
                          </div>

                          <div className="min-w-0 flex-1">
                            <h3
                              className="overflow-hidden text-sm font-medium leading-5 text-gray-800"
                              style={{
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                              }}
                            >
                              {product.title || "Untitled product"}
                            </h3>

                            {product.category?.title && (
                              <p className="mt-1 truncate text-[11px] text-gray-400">
                                {product.category.title}
                              </p>
                            )}
                          </div>

                          <p className="shrink-0 text-sm font-semibold text-gray-900">
                            ৳{formatPrice(lineTotal)}
                          </p>
                        </article>
                      );
                    })}
                  </div>

                  <div className="mt-5 space-y-3 border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between gap-4 text-sm">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="font-medium text-gray-800">
                        ৳{formatPrice(subtotal)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4 text-sm">
                      <span className="text-gray-500">Shipping</span>
                      <span className="font-medium text-gray-800">
                        ৳{formatPrice(shippingCost)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4 text-sm">
                      <span className="text-gray-500">Discount</span>
                      <span className="font-medium text-green-600">
                        -৳{formatPrice(discount)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-end justify-between gap-4 border-t border-gray-200 pt-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Total</p>
                      <p className="mt-0.5 text-[11px] text-gray-400">
                        VAT included where applicable
                      </p>
                    </div>

                    <p className="text-2xl font-bold text-orange-500">
                      ৳{formatPrice(grandTotal)}
                    </p>
                  </div>

                  <Link
                    to="/cart-page"
                    className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-orange-500 hover:text-orange-600"
                  >
                    <FaArrowLeft className="text-[10px]" />
                    Edit cart
                  </Link>
                </section>

                {/* Desktop payment */}
                <section className="hidden rounded-lg border border-gray-100 bg-white p-5 shadow-sm xl:block">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Payment method
                  </h2>

                  <div className="mt-4 space-y-3">
                    {paymentOptions.map((option) => {
                      const selected = paymentMethod === option.value;

                      return (
                        <label
                          key={option.value}
                          className={`flex cursor-pointer items-start gap-3 rounded-md border p-3 transition ${
                            selected
                              ? "border-orange-500 bg-orange-50"
                              : "border-gray-200 hover:border-orange-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="payment"
                            value={option.value}
                            checked={selected}
                            onChange={(event) =>
                              setPaymentMethod(event.target.value)
                            }
                            className="mt-1 h-4 w-4 shrink-0 accent-orange-500"
                          />

                          <span
                            className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${
                              selected
                                ? "bg-orange-500 text-white"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {option.icon}
                          </span>

                          <span className="min-w-0">
                            <span className="block text-sm font-medium text-gray-800">
                              {option.title}
                            </span>
                            <span className="mt-1 block text-xs leading-5 text-gray-500">
                              {option.description}
                            </span>
                          </span>
                        </label>
                      );
                    })}
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-orange-500 px-4 text-sm font-semibold text-white transition hover:bg-orange-600 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? (
                      "Placing order..."
                    ) : (
                      <>
                        <FaLock className="text-xs" />
                        Place order
                      </>
                    )}
                  </button>

                  <div className="mt-3 flex items-center justify-center gap-2 text-[11px] leading-5 text-gray-400">
                    <FaCheckCircle className="shrink-0 text-green-500" />
                    Secure and protected checkout
                  </div>
                </section>
              </div>
            </aside>
          </div>
        </form>

        {/* Mobile sticky action */}
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white px-3 py-2 shadow-[0_-4px_18px_rgba(0,0,0,0.08)] xl:hidden">
          <div className="mx-auto flex max-w-[1450px] items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] uppercase tracking-wide text-gray-400">
                Total
              </p>
              <p className="truncate text-lg font-bold text-orange-500">
                ৳{formatPrice(grandTotal)}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                const form = document.querySelector("form");
                form?.requestSubmit();
              }}
              disabled={submitting}
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-orange-500 px-5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FaLock className="text-xs" />
              {submitting ? "Processing..." : "Place order"}
            </button>
          </div>
        </div>
      </main>
    </PublicLayout>
  );
};

export default Checkout;
