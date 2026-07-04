import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PublicLayout from "../components/PublicLayout";
import cartService from "../utils/cartService";

const Checkout = () => {
  const [loading, setLoading] = useState(true);

  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);

  const [createAccount, setCreateAccount] = useState(false);
  const [shipDifferent, setShipDifferent] = useState(false);

  const [formData, setFormData] = useState({
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
    ship_district: "",
    ship_city: "",
    ship_address: "",
    ship_postcode: "",

    order_notes: "",
  });

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const data = await cartService.getCart();

      setCartItems(data.cart || []);
      setSubtotal(Number(data.total_price || 0));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const shippingCost = subtotal > 0 ? 60 : 0;
  const grandTotal = subtotal + shippingCost;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          Loading...
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="max-w-5xl mx-auto px-4 py-4">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-3xl md:text-3xl font-bold">Checkout</h1>

          <p className="text-sm text-gray-500 mt-2">
            Complete your order details
          </p>
        </div>

        {/* Coupon */}
        <div className="max-w-xl">
          <div className="border border-gray-200 rounded-lg p-4 mb-4">
            <p className="text-sm mb-3">Have a coupon?</p>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Coupon Code"
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm outline-none"
              />

              <button
                type="button"
                className="bg-slate-800 text-white text-sm px-5 py-2 rounded-md"
              >
                Apply Coupon
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* LEFT SIDE */}
          <div className="lg:col-span-2">
            <div className="border border-gray-200 rounded-lg p-5">
              <h2 className="text-xl font-semibold mb-5">Billing Details</h2>

              {/* First Row */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">First Name *</label>

                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Last Name *</label>

                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>
              </div>

              {/* Company */}
              <div className="mt-4">
                <label className="block text-sm mb-2">Company Name</label>

                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>

              {/* Country */}
              <div className="mt-4">
                <label className="block text-sm mb-2">Country</label>

                <input
                  type="text"
                  value="Bangladesh"
                  disabled
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-100"
                />
              </div>

              {/* District + City */}
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm mb-2">District *</label>

                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">City *</label>

                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="mt-4">
                <label className="block text-sm mb-2">Street Address *</label>

                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>

              {/* Zip */}
              <div className="mt-4">
                <label className="block text-sm mb-2">Postcode / ZIP</label>

                <input
                  type="text"
                  name="postcode"
                  value={formData.postcode}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>

              {/* Phone + Email */}
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm mb-2">Phone *</label>

                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Email *</label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>
              </div>
              {/* Create Account */}
              <div className="mt-6">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <input
                    type="checkbox"
                    checked={createAccount}
                    onChange={() => setCreateAccount(!createAccount)}
                  />
                  Create an account?
                </label>

                {createAccount && (
                  <div className="mt-4">
                    <label className="block text-sm mb-2">
                      Account Password *
                    </label>

                    <input
                      type="password"
                      name="account_password"
                      value={formData.account_password}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    />
                  </div>
                )}
              </div>

              {/* Ship Different Address */}
              <div className="mt-6">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <input
                    type="checkbox"
                    checked={shipDifferent}
                    onChange={() => setShipDifferent(!shipDifferent)}
                  />
                  Ship to a different address?
                </label>

                {shipDifferent && (
                  <div className="mt-5 border-t pt-5">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm mb-2">
                          First Name *
                        </label>

                        <input
                          type="text"
                          name="ship_first_name"
                          value={formData.ship_first_name}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm mb-2">
                          Last Name *
                        </label>

                        <input
                          type="text"
                          name="ship_last_name"
                          value={formData.ship_last_name}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm mb-2">Company Name</label>

                      <input
                        type="text"
                        name="ship_company"
                        value={formData.ship_company}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm mb-2">District *</label>

                        <input
                          type="text"
                          name="ship_district"
                          value={formData.ship_district}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm mb-2">City *</label>

                        <input
                          type="text"
                          name="ship_city"
                          value={formData.ship_city}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm mb-2">
                        Street Address *
                      </label>

                      <input
                        type="text"
                        name="ship_address"
                        value={formData.ship_address}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Order Notes */}
              <div className="mt-6">
                <label className="block text-sm mb-2">Order Notes</label>

                <textarea
                  rows={5}
                  name="order_notes"
                  value={formData.order_notes}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  placeholder="Notes about your order..."
                />
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {/* ORDER BOX */}
              <div className="border border-gray-200 rounded-lg p-5 bg-white">
                <h2 className="text-lg font-semibold mb-5">Your Order</h2>

                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 pb-4 border-b border-gray-100"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.title}
                        className="w-14 h-14 object-cover rounded-md border"
                      />

                      <div className="flex-1">
                        <h4 className="text-sm font-medium line-clamp-2">
                          {item.product.title}
                        </h4>

                        <p className="text-xs text-gray-500 mt-1">
                          Qty : {item.qty}
                        </p>
                      </div>

                      <span className="text-sm font-semibold">
                        ৳{item.total}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>৳{subtotal}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>৳{shippingCost}</span>
                  </div>

                  <div className="border-t pt-3 flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-green-600">৳{grandTotal}</span>
                  </div>
                </div>

                <Link
                  to="/cart-page"
                  className="mt-5 inline-block text-sm text-green-600 hover:underline"
                >
                  ← Back to Cart
                </Link>
              </div>

              {/* PAYMENT BOX */}
              <div className="border border-gray-200 rounded-lg p-5 bg-white mt-5">
                <h2 className="text-lg font-semibold mb-5">Payment Method</h2>

                <div className="space-y-4">
                  <label className="flex gap-3 text-sm">
                    <input
                      type="radio"
                      name="payment"
                      value="bank"
                      defaultChecked
                    />
                    <div>
                      <p className="font-medium">Direct Bank Transfer</p>

                      <p className="text-gray-500 text-xs mt-1">
                        Make payment directly into our bank account.
                      </p>
                    </div>
                  </label>

                  <label className="flex gap-3 text-sm">
                    <input type="radio" name="payment" value="cod" />

                    <div>
                      <p className="font-medium">Cash On Delivery</p>
                    </div>
                  </label>

                  <label className="flex gap-3 text-sm">
                    <input type="radio" name="payment" value="online" />

                    <div>
                      <p className="font-medium">Online Gateway</p>
                    </div>
                  </label>
                </div>

                <button
                  type="button"
                  className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-3 rounded-md transition"
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Checkout;
