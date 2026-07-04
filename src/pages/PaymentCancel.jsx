import React from "react";
import { useNavigate } from "react-router-dom";
import { FaBan } from "react-icons/fa";
import PublicLayout from "../components/PublicLayout";

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <PublicLayout>
      <div className="min-h-screen flex items-center justify-center bg-yellow-50 px-4">
        <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">

          {/* Icon */}
          <div className="flex justify-center mb-4">
            <FaBan className="text-yellow-500 text-6xl" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-yellow-600 mb-2">
            Payment Cancelled
          </h1>

          {/* Message */}
          <p className="text-gray-600 mb-6">
            You cancelled the payment process.  
            Your order is still saved in the cart.
          </p>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate("/cart")}
              className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg transition"
            >
              Go to Cart
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

export default PaymentCancel;