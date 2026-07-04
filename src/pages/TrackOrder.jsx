import React, { useEffect, useState } from "react";
import { getTrackAllOrders } from "../utils/dashboardService";
import PublicLayout from "../components/PublicLayout";
import { useNavigate } from "react-router-dom";

const TrackOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getTrackAllOrders();
      setOrders(data);
    } catch (error) {
      console.log("Error loading orders", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "not_confirmed":
        return "bg-yellow-100 text-yellow-700";
      case "confirmed":
        return "bg-blue-100 text-blue-700";
      case "picked":
        return "bg-purple-100 text-purple-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleTrack = (invoiceNo) => {
    navigate(`/dashboard/orders/track/${invoiceNo}`);
  };

  return (
      <div className="max-w-6xl mx-auto p-4 md:p-6">

        {/* HEADER */}
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Track Your Orders
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            View all your order status in one place
          </p>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="text-center py-20 text-gray-500">
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No orders found
          </div>
        ) : (
          <>
            {/* DESKTOP TABLE */}
            <div className="hidden md:block bg-white rounded-2xl shadow overflow-hidden">

              <table className="w-full">

                <thead className="bg-gray-50 text-left text-sm text-gray-600">
                  <tr>
                    <th className="p-4">Invoice</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Date</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>

                <tbody>

                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-t hover:bg-gray-50 transition"
                    >

                      {/* INVOICE */}
                      <td className="p-4 font-semibold text-gray-800">
                        #{order.invoice_no}
                      </td>

                      {/* TOTAL */}
                      <td className="p-4 text-gray-700">
                        ৳ {order.total}
                      </td>

                      {/* STATUS */}
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            order.product_status
                          )}`}
                        >
                          {order.product_status}
                        </span>
                      </td>

                      {/* DATE */}
                      <td className="p-4 text-gray-500 text-sm">
                        {new Date(order.created_at).toLocaleString()}
                      </td>

                      {/* ACTION */}
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleTrack(order.invoice_no)}
                          className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition shadow-sm"
                        >
                          View Tracking
                        </button>
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>

            {/* 📱 MOBILE CARD VIEW */}
            <div className="md:hidden space-y-4">

              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl shadow p-5 border hover:shadow-md transition"
                >

                  <div className="flex justify-between items-start mb-3">

                    <div>
                      <p className="text-sm text-gray-500">Invoice</p>
                      <p className="font-bold text-gray-800">
                        #{order.invoice_no}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        order.product_status
                      )}`}
                    >
                      {order.product_status}
                    </span>

                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">

                    <div>
                      <p className="text-gray-400">Total</p>
                      <p className="font-semibold">৳ {order.total}</p>
                    </div>

                    <div>
                      <p className="text-gray-400">Date</p>
                      <p>
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>

                  </div>

                  <button
                    onClick={() => handleTrack(order.invoice_no)}
                    className="mt-4 w-full bg-emerald-500 text-white py-2 rounded-xl hover:bg-emerald-600 transition"
                  >
                    View Tracking
                  </button>

                </div>
              ))}

            </div>

          </>
        )}

      </div>
  );
};

export default TrackOrder;