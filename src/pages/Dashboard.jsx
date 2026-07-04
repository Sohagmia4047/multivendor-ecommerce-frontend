import React, { useEffect, useState } from "react";
import { getMyOrders } from "../utils/dashboardService";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fake user (replace with auth user)
  const user = {
    name: "John Doe",
    email: "john@example.com",
    phone: "+880 1XXXXXXXXX",
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await getMyOrders();
      setOrders(data || []);
    } catch (error) {
      console.log(error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const totalOrders = orders.length;
  const totalSpent = orders.reduce(
    (sum, o) => sum + Number(o.total || 0),
    0
  );

  return (
    <div className="w-full space-y-6">

      {/* 🟣 USER PROFILE CARD */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-2xl shadow">

        <h2 className="text-2xl font-bold">Welcome, {user.name}</h2>
        <p className="text-white/80 text-sm mt-1">
          Manage your orders and account details
        </p>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">

          <div className="bg-white/10 p-3 rounded-lg">
            <p className="text-white/70">Email</p>
            <p>{user.email}</p>
          </div>

          <div className="bg-white/10 p-3 rounded-lg">
            <p className="text-white/70">Phone</p>
            <p>{user.phone}</p>
          </div>

          <div className="bg-white/10 p-3 rounded-lg">
            <p className="text-white/70">Total Orders</p>
            <p>{totalOrders}</p>
          </div>

        </div>
      </div>

      {/* 📊 STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-white p-5 rounded-2xl shadow hover:shadow-md transition">
          <p className="text-gray-500 text-sm">Total Orders</p>
          <h3 className="text-2xl font-bold">{totalOrders}</h3>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow hover:shadow-md transition">
          <p className="text-gray-500 text-sm">Total Spent</p>
          <h3 className="text-2xl font-bold">৳ {totalSpent}</h3>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow hover:shadow-md transition">
          <p className="text-gray-500 text-sm">Account Status</p>
          <h3 className="text-2xl font-bold text-green-600">Active</h3>
        </div>

      </div>

      {/* 📦 RECENT ORDERS */}
      <div className="bg-white rounded-2xl shadow p-5">

        <h3 className="text-lg font-bold mb-4">
          Recent Orders
        </h3>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-500">No orders found</p>
        ) : (
          <div className="space-y-3">

            {orders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="flex justify-between items-center border-b pb-3"
              >

                <div>
                  <p className="font-semibold">
                    #{order.invoice_no}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-semibold">৳ {order.total}</p>

                  <span
                    className={`text-xs px-3 py-1 rounded-full
                    ${
                      order.product_status === "delivered"
                        ? "bg-green-100 text-green-700"
                        : order.product_status === "confirmed"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.product_status}
                  </span>
                </div>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
};

export default Dashboard;