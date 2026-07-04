import { FaBoxOpen } from "react-icons/fa";

const InvoiceItems = ({ invoice }) => {
  return (
    <div className="mt-12">

      {/* Header */}

      <div className="flex items-center gap-3 mb-6">

        <FaBoxOpen className="text-indigo-600 text-xl" />

        <h2 className="text-2xl font-bold text-gray-800">

          Order Items

        </h2>

      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-200">

        <table className="min-w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="px-6 py-4 text-left">
                Image
              </th>

              <th className="px-6 py-4 text-left">
                Product
              </th>

              <th className="px-6 py-4 text-center">
                Price
              </th>

              <th className="px-6 py-4 text-center">
                Qty
              </th>

              <th className="px-6 py-4 text-right">
                Total
              </th>

            </tr>

          </thead>

          <tbody>

            {invoice.items.map((item, index) => (

              <tr
                key={index}
                className="border-t hover:bg-gray-50 transition"
              >

                {/* Product Image */}

                <td className="px-6 py-5">

                  <img
                    src={item.image}
                    alt={item.item}
                    className="w-16 h-16 rounded-xl object-cover border"
                  />

                </td>

                {/* Product Name */}

                <td className="px-6 py-5">

                  <h3 className="font-semibold text-gray-800">

                    {item.item}

                  </h3>

                  <p className="text-sm text-gray-500">

                    Invoice : {item.invoice_no}

                  </p>

                </td>

                {/* Price */}

                <td className="px-6 py-5 text-center">

                  ৳ {item.price}

                </td>

                {/* Qty */}

                <td className="px-6 py-5 text-center">

                  <span className="px-3 py-1 bg-indigo-100 rounded-full font-semibold text-indigo-700">

                    {item.qty}

                  </span>

                </td>

                {/* Total */}

                <td className="px-6 py-5 text-right font-bold text-green-600">

                  ৳ {item.total}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default InvoiceItems;