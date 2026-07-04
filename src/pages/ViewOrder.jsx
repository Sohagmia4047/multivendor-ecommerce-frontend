import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaTimesCircle,
  FaPrint,
  FaDownload,
} from "react-icons/fa";

import PublicLayout from "../components/PublicLayout";
import DashboardSidebar from "../components/DashboardSidebar";
import { getInvoice } from "../utils/dashboardService";

const ViewOrder = () => {
  const { invoiceNo } = useParams();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvoice();
  }, [invoiceNo]);

  const loadInvoice = async () => {
    try {
      const data = await getInvoice(invoiceNo);
      setInvoice(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="py-20 text-center text-xl text-gray-500">
          Loading Invoice...
        </div>
      </PublicLayout>
    );
  }

  return (
      <section className="bg-gray-100 min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-4">

          <div>
            {/* MAIN CONTENT */}
            <div className="lg:col-span-3 space-y-6">

              {/* 🟣 PREMIUM HEADER */}
              <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white rounded-2xl shadow-lg p-6">

                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

                  <div>
                    <Link
                      to="/dashboard/orders"
                      className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-3"
                    >
                      <FaArrowLeft />
                      Back to Orders
                    </Link>

                    <h2 className="text-2xl md:text-3xl font-bold">
                      Invoice #{invoice.invoice_no}
                    </h2>

                    <p className="text-white/80 text-sm mt-1">
                      {new Date(invoice.order_date).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => window.print()}
                      className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl flex items-center gap-2 backdrop-blur-md"
                    >
                      <FaPrint /> Print
                    </button>

                    <button className="bg-black/20 hover:bg-black/30 px-4 py-2 rounded-xl flex items-center gap-2 backdrop-blur-md">
                      <FaDownload /> Download
                    </button>
                  </div>

                </div>
              </div>

              {/* 🟦 CUSTOMER + PAYMENT */}
              <div className="grid md:grid-cols-2 gap-6">

                {/* CUSTOMER */}
                <div className="bg-white rounded-2xl shadow p-6 hover:shadow-md transition">
                  <h3 className="text-lg font-bold mb-5 text-gray-800">
                    Customer Information
                  </h3>

                  <div className="space-y-3 text-sm">
                    <p><span className="text-gray-500">Name:</span> {invoice.customer_name}</p>
                    <p><span className="text-gray-500">Email:</span> {invoice.email}</p>
                    <p><span className="text-gray-500">Phone:</span> {invoice.phone}</p>
                    <p><span className="text-gray-500">Address:</span> {invoice.customer_address}</p>
                  </div>
                </div>

                {/* PAYMENT */}
                <div className="bg-white rounded-2xl shadow p-6 hover:shadow-md transition">
                  <h3 className="text-lg font-bold mb-5 text-gray-800">
                    Payment Information
                  </h3>

                  <div className="space-y-3 text-sm">

                    <p>
                      <span className="text-gray-500">Method:</span>{" "}
                      {invoice.payment?.payment_type || "N/A"}
                    </p>

                    <p>
                      <span className="text-gray-500">Transaction:</span>{" "}
                      {invoice.payment?.tran_id || "-"}
                    </p>

                    <p>
                      <span className="text-gray-500">Card:</span>{" "}
                      {invoice.payment?.card_type || "-"}
                    </p>

                    <div className="pt-2">
                      {invoice.paid_status ? (
                        <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                          <FaCheckCircle /> Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold">
                          <FaTimesCircle /> Unpaid
                        </span>
                      )}
                    </div>

                  </div>
                </div>

              </div>

              {/* 🟨 PRODUCTS TABLE */}
              <div className="bg-white rounded-2xl shadow overflow-hidden">

                <div className="p-5 border-b">
                  <h3 className="text-lg font-bold">Ordered Products</h3>
                </div>

                <div className="overflow-x-auto">

                  <table className="w-full text-sm">

                    <thead className="bg-gray-50 text-gray-600">
                      <tr>
                        <th className="p-4 text-left">Product</th>
                        <th className="p-4 text-center">Qty</th>
                        <th className="p-4 text-right">Price</th>
                        <th className="p-4 text-right">Total</th>
                      </tr>
                    </thead>

                    <tbody>

                      {invoice.items?.map((item) => (
                        <tr
                          key={item.id}
                          className="border-b hover:bg-gray-50 transition"
                        >

                          <td className="p-4 flex items-center gap-3">
                            <img
                              src={item.image}
                              className="w-12 h-12 rounded-lg object-cover border"
                              alt=""
                            />
                            <span className="font-medium">{item.item}</span>
                          </td>

                          <td className="text-center">{item.qty}</td>

                          <td className="text-right pr-4">
                            ৳ {Number(item.price).toFixed(2)}
                          </td>

                          <td className="text-right pr-4 font-semibold">
                            ৳ {Number(item.total).toFixed(2)}
                          </td>

                        </tr>
                      ))}

                    </tbody>

                  </table>

                </div>

              </div>

              {/* 🟩 SUMMARY */}
              <div className="bg-white rounded-2xl shadow p-6">

                <h3 className="text-lg font-bold mb-6">Order Summary</h3>

                <div className="max-w-sm ml-auto space-y-3 text-sm">

                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>৳ {Number(invoice.subtotal).toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>৳ {Number(invoice.shipping).toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Discount</span>
                    <span>৳ {Number(invoice.discount).toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>৳ {Number(invoice.tax).toFixed(2)}</span>
                  </div>

                  <hr />

                  <div className="flex justify-between text-xl font-bold text-emerald-600">
                    <span>Grand Total</span>
                    <span>৳ {Number(invoice.grand_total).toFixed(2)}</span>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>
  );
};

export default ViewOrder;