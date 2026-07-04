import { FaCheckCircle, FaClock, FaTimesCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import logo from "../../assets/logo.jpg";

const InvoiceHeader = ({ invoice }) => {
  const navigate = useNavigate();

  const payment = invoice?.payment;

  const getStatus = () => {
    if (!payment) {
      return {
        text: "UNPAID",
        color: "bg-red-100 text-red-600",
        icon: <FaTimesCircle />,
      };
    }

    if (payment.payment_status === "completed") {
      return {
        text: "PAID",
        color: "bg-green-100 text-green-700",
        icon: <FaCheckCircle />,
      };
    }

    if (payment.payment_status === "pending") {
      return {
        text: "PENDING",
        color: "bg-yellow-100 text-yellow-700",
        icon: <FaClock />,
      };
    }

    return {
      text: payment.payment_status.toUpperCase(),
      color: "bg-gray-100 text-gray-700",
      icon: <FaClock />,
    };
  };

  const status = getStatus();

  return (
    <div className="border-b pb-2">
      <div className="flex flex-col md:flex-row justify-between">

        {/* LEFT */}
        <div>
          <img src={logo} alt="logo" className="h-16 mb-1" />

          <h2 className="text-xl font-bold text-gray-800">NestMart</h2>

          <p className="text-gray-500 text-[12px] mt-1">
            House #12, Road #5
          </p>

          <p className="text-gray-500 text-[12px]">
            Dhaka, Bangladesh
          </p>

          <p className="text-gray-500 text-[12px]">
            support@nestmart.com
          </p>

          <p className="text-gray-500 text-[12px]">
            +8801700000000
          </p>
        </div>

        {/* RIGHT */}
        <div className="text-right mt-3 md:mt-0">

          {/* 🔥 BACK TO SHOP BUTTON (ADDED) */}
          <button
            onClick={() => navigate("/")}
            className="mb-4 inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
          >
            ← Back to Shop
          </button>

          <h1 className="text-2xl font-bold text-gray-900">
            INVOICE
          </h1>

          <div className="mt-6 justify-end gap-10">

            {/* Invoice No */}
            <div className="flex items-center gap-2">
              <p className="font-semibold">Invoice No :</p>
              <p className="text-gray-700">
                {invoice.invoice_no}
              </p>
            </div>

            {/* Date */}
            <div className="flex justify-end gap-2">
              <p className="font-semibold">Date :</p>
              <p className="text-gray-700">
                {new Date(invoice.order_date).toLocaleDateString()}
              </p>
            </div>

          </div>

          <div
            className={`inline-flex mt-6 px-5 py-2 rounded-full items-center gap-2 font-semibold ${status.color}`}
          >
            {status.icon}
            {status.text}
          </div>

        </div>

      </div>
    </div>
  );
};

export default InvoiceHeader;