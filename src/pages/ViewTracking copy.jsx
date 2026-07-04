import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTrackOrder } from "../utils/dashboardService";
import PublicLayout from "../components/PublicLayout";

const ViewTracking = () => {
  const { invoiceNo } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [invoiceNo]);

  const loadOrder = async () => {
    try {
      const data = await getTrackOrder(invoiceNo);
      setOrder(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { key: "processing", label: "Order Placed" },
    { key: "confirmed", label: "Confirmed" },
    { key: "picked", label: "Shipped" },
    { key: "delivered", label: "Delivered" },
  ];

  const getIndex = (status) =>
    steps.findIndex((step) => step.key === status);

  const currentIndex = getIndex(order?.product_status);

  const getStatusDate = (status) => {
    const history = order?.status_history || [];
    const item = history.find((i) => i.status === status);
    return item?.created_at || null;
  };

  const isActive = (index) => index <= currentIndex;

  return (
    <PublicLayout>
      <div className="max-w-5xl mx-auto p-4 md:p-6">

        {/* 🟣 PREMIUM HEADER */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white p-6 rounded-2xl shadow-lg mb-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">

            <div>
              <h2 className="text-2xl font-bold">
                Track Your Order
              </h2>
              <p className="text-sm opacity-80">
                Invoice: {invoiceNo}
              </p>
            </div>

            <div className="bg-white/20 px-4 py-2 rounded-lg text-sm font-semibold backdrop-blur-md">
              Status: {order?.product_status?.toUpperCase()}
            </div>

          </div>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-500">
            Loading tracking details...
          </div>
        ) : !order ? (
          <div className="text-center py-10 text-red-500">
            Order not found
          </div>
        ) : (
          <>
            {/* 🟢 MODERN TIMELINE */}
            <div className="bg-white rounded-2xl shadow p-6 mb-6">

              <div className="relative flex justify-between items-center">

                {/* BASE LINE */}
                <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200"></div>

                {/* PROGRESS LINE */}
                <div
                  className="absolute top-5 left-0 h-1 bg-emerald-500 transition-all duration-500"
                  style={{
                    width:
                      currentIndex === 0
                        ? "0%"
                        : currentIndex === 1
                        ? "33%"
                        : currentIndex === 2
                        ? "66%"
                        : "100%",
                  }}
                ></div>

                {steps.map((step, index) => (
                  <div
                    key={step.key}
                    className="flex flex-col items-center flex-1 z-10"
                  >
                    {/* DOT */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md
                      ${
                        isActive(index)
                          ? "bg-emerald-500"
                          : "bg-gray-300"
                      }`}
                    >
                      {index + 1}
                    </div>

                    {/* LABEL */}
                    <p className="text-sm mt-2 font-medium">
                      {step.label}
                    </p>

                    {/* DATE */}
                    <p className="text-xs text-gray-500 mt-1 text-center min-h-[40px]">
                      {getStatusDate(step.key)
                        ? new Date(getStatusDate(step.key)).toLocaleString()
                        : "--"}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 📦 ORDER INFO GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

              <div className="bg-white p-5 rounded-xl shadow">
                <h3 className="font-semibold mb-2 text-gray-700">
                  Order Info
                </h3>
                <p><strong>Invoice:</strong> {order.invoice_no}</p>
                <p><strong>Total:</strong> ${order.total || order.price}</p>
              </div>

              <div className="bg-white p-5 rounded-xl shadow">
                <h3 className="font-semibold mb-2 text-gray-700">
                  Timeline
                </h3>
                <p>
                  <strong>Created:</strong>{" "}
                  {order.created_at
                    ? new Date(order.created_at).toLocaleString()
                    : "N/A"}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className="text-emerald-600 font-semibold">
                    {order.product_status}
                  </span>
                </p>
              </div>

            </div>

          </>
        )}
      </div>
    </PublicLayout>
  );
};

export default ViewTracking;