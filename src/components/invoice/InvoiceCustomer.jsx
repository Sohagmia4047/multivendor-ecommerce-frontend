import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCreditCard,
  FaReceipt,
} from "react-icons/fa";

const InvoiceCustomer = ({ invoice }) => {
  const payment = invoice.payment;

  return (
    <div className="mt-10">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Bill To */}

        <div className="bg-gray-50 rounded-2xl p-6 shadow-sm border">

          <h3 className="text-lg font-bold mb-5 text-gray-800">
            Bill To
          </h3>

          <div className="space-y-4">

            <div className="flex gap-3">

              <FaUser className="text-indigo-600 mt-1" />

              <div>

                <p className="font-semibold">
                  {invoice.customer_name}
                </p>

              </div>

            </div>

            <div className="flex gap-3">

              <FaEnvelope className="text-indigo-600 mt-1" />

              <p>{invoice.email}</p>

            </div>

            <div className="flex gap-3">

              <FaPhone className="text-indigo-600 mt-1" />

              <p>{invoice.phone}</p>

            </div>

            <div className="flex gap-3">

              <FaMapMarkerAlt className="text-indigo-600 mt-1" />

              <p>{invoice.customer_address}</p>

            </div>

          </div>

        </div>

        {/* Shipping */}

        <div className="bg-gray-50 rounded-2xl p-6 shadow-sm border">

          <h3 className="text-lg font-bold mb-5 text-gray-800">
            Shipping Address
          </h3>

          <div className="space-y-4">

            <div className="flex gap-3">

              <FaUser className="text-green-600 mt-1" />

              <p>{invoice.customer_name}</p>

            </div>

            <div className="flex gap-3">

              <FaEnvelope className="text-green-600 mt-1" />

              <p>{invoice.email}</p>

            </div>

            <div className="flex gap-3">

              <FaPhone className="text-green-600 mt-1" />

              <p>{invoice.phone}</p>

            </div>

            <div className="flex gap-3">

              <FaMapMarkerAlt className="text-green-600 mt-1" />

              <p>{invoice.customer_address}</p>

            </div>

          </div>

        </div>

        {/* Payment */}

        <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">

          <h3 className="text-lg font-bold mb-6">
            Payment Details
          </h3>

          <div className="space-y-5">

            <div className="flex gap-3">

              <FaCreditCard className="mt-1" />

              <div>

                <p className="text-sm opacity-80">
                  Method
                </p>

                <p className="font-semibold">
                  {payment?.payment_type ?? "N/A"}
                </p>

              </div>

            </div>

            <div className="flex gap-3">

              <FaReceipt className="mt-1" />

              <div>

                <p className="text-sm opacity-80">
                  Transaction ID
                </p>

                <p className="font-semibold break-all">
                  {payment?.tran_id ?? "N/A"}
                </p>

              </div>

            </div>

            <div>

              <p className="text-sm opacity-80">
                Payment Status
              </p>

              <span className="inline-block mt-2 px-4 py-1 rounded-full bg-white text-indigo-700 font-semibold">

                {payment?.payment_status ?? "Pending"}

              </span>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default InvoiceCustomer;