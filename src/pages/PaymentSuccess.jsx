import React, { useEffect } from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

import PublicLayout from "../components/PublicLayout";

const PaymentSuccess = () => {
  console.log("PaymentSuccess Loaded");
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const invoiceNo = searchParams.get("invoice");

  useEffect(() => {
    if (!invoiceNo) return;

    // const timer = setTimeout(() => {
    //   navigate(`/invoice/${invoiceNo}`);
    // }, 3000);

    // return () => clearTimeout(timer);
  }, [invoiceNo, navigate]);

  return (
    <PublicLayout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 px-4">

        <div className="bg-white shadow-2xl rounded-3xl p-10 max-w-md w-full text-center">

          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <FaCheckCircle className="text-green-500 text-7xl animate-pulse" />
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold text-green-600">
            Payment Successful
          </h1>

          {/* Description */}
          <p className="text-gray-600 mt-4">
            Your payment has been completed successfully.
            <br />
            Your order is now being processed.
          </p>

          {/* Invoice Number */}
          {invoiceNo && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4">

              <p className="text-sm text-gray-500">
                Invoice Number
              </p>

              <h2 className="text-xl font-bold text-green-700 mt-1">
                {invoiceNo}
              </h2>

            </div>
          )}

          {/* Redirect Message */}
          <p className="mt-6 text-sm text-gray-500">
            Redirecting to your invoice in
            <span className="font-bold text-green-600"> 3 seconds...</span>
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-col gap-3">

            <button
              onClick={() => invoiceNo && navigate(`/invoice/${invoiceNo}`)}
              className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition"
            >
              View Invoice
            </button>

            <button
              onClick={() => navigate("/my-orders")}
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
            >
              View My Orders
            </button>

            <button
              onClick={() => navigate("/")}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold transition"
            >
              Back to Home
            </button>

          </div>

        </div>

      </div>
    </PublicLayout>
  );
};

export default PaymentSuccess;