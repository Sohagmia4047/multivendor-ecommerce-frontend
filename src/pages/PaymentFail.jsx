import React from "react";
import { useNavigate } from "react-router-dom";
import { FaTimesCircle } from "react-icons/fa";
import PublicLayout from "../components/PublicLayout";

const PaymentFail = () => {
  const navigate = useNavigate();

  return (
    <PublicLayout>
      <div className="min-h-screen flex items-center justify-center bg-red-50 px-4">
        <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">

          {/* Icon */}
          <div className="flex justify-center mb-4">
            <FaTimesCircle className="text-red-500 text-6xl" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-red-600 mb-2">
            Payment Failed!
          </h1>

          {/* Message */}
          <p className="text-gray-600 mb-6">
            Unfortunately your payment could not be completed.  
            Please try again or use a different payment method.
          </p>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate("/checkout")}
              className="bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition"
            >
              Try Again
            </button>

            <button
              onClick={() => navigate("/")}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg transition"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default PaymentFail;