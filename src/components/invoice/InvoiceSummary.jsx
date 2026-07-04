import {
  FaMoneyBillWave,
  FaTruck,
  FaPercent,
  FaWallet,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";

const InvoiceSummary = ({ invoice }) => {
  const payment = invoice.payment;

  return (
    <div className="mt-12 flex justify-end">

      <div className="w-full lg:w-[420px]">

        <div className="bg-white rounded-3xl border shadow-lg overflow-hidden">

          {/* Header */}

          <div className="bg-indigo-600 text-white px-6 py-4">

            <h2 className="text-xl font-bold">

              Order Summary

            </h2>

          </div>

          {/* Body */}

          <div className="p-6 space-y-5">

            <div className="flex justify-between items-center">

              <div className="flex items-center gap-3">

                <FaMoneyBillWave className="text-indigo-600" />

                <span>Subtotal</span>

              </div>

              <span className="font-semibold">

                ৳ {invoice.subtotal}

              </span>

            </div>

            <div className="flex justify-between items-center">

              <div className="flex items-center gap-3">

                <FaTruck className="text-indigo-600" />

                <span>Shipping</span>

              </div>

              <span className="font-semibold">

                ৳ {invoice.shipping}

              </span>

            </div>

            <div className="flex justify-between items-center">

              <div className="flex items-center gap-3">

                <FaPercent className="text-indigo-600" />

                <span>Discount</span>

              </div>

              <span className="font-semibold">

                ৳ 0

              </span>

            </div>

            <div className="flex justify-between items-center">

              <div className="flex items-center gap-3">

                <FaPercent className="text-indigo-600" />

                <span>Tax</span>

              </div>

              <span className="font-semibold">

                ৳ {invoice.tax}

              </span>

            </div>

            <hr />

            {/* Grand Total */}

            <div className="flex justify-between items-center">

              <div className="flex items-center gap-3">

                <FaWallet className="text-green-600 text-xl" />

                <span className="font-bold text-lg">

                  Grand Total

                </span>

              </div>

              <span className="font-bold text-2xl text-green-600">

                ৳ {invoice.grand_total}

              </span>

            </div>

            <hr />

            {/* Payment */}

            <div className="space-y-4">

              <div className="flex justify-between">

                <span className="font-medium">

                  Payment Method

                </span>

                <span className="capitalize">

                  {payment?.payment_type ?? "N/A"}

                </span>

              </div>

              <div className="flex justify-between">

                <span className="font-medium">

                  Payment Status

                </span>

                <span
                  className={`flex items-center gap-2 font-semibold ${
                    payment?.payment_status === "completed"
                      ? "text-green-600"
                      : "text-orange-500"
                  }`}
                >
                  {payment?.payment_status === "completed" ? (
                    <FaCheckCircle />
                  ) : (
                    <FaClock />
                  )}

                  {payment?.payment_status ?? "Pending"}

                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default InvoiceSummary;