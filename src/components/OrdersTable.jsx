import React from "react";
import { Link } from "react-router-dom";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
} from "react-icons/fa";

const OrdersTable = ({ orders }) => {
  return (
    <div className="overflow-x-auto">

      <table className="w-full border-collapse">

        <thead>

          <tr className="bg-gray-100 border-b">

            <th className="text-left p-4 font-semibold">
              Order
            </th>

            <th className="text-left p-4 font-semibold">
              Date
            </th>

            <th className="text-left p-4 font-semibold">
              Status
            </th>

            <th className="text-left p-4 font-semibold">
              Paid
            </th>

            <th className="text-left p-4 font-semibold">
              Total
            </th>

            <th className="text-center p-4 font-semibold">
              Action
            </th>

          </tr>

        </thead>

        <tbody>

          {orders.length === 0 ? (

            <tr>

              <td
                colSpan={6}
                className="text-center py-8 text-gray-500"
              >
                No Orders Found
              </td>

            </tr>

          ) : (

            orders.map((order) => (

              <tr
                key={order.id}
                className="border-b hover:bg-gray-50"
              >

                <td className="p-4 font-medium">
                  {order.invoice_no}
                </td>

                <td className="p-4">
                  {new Date(order.order_date).toLocaleDateString()}
                </td>

                <td className="p-4">

                  <span
                    className={`
                      px-3
                      py-1
                      rounded-full
                      text-xs
                      font-semibold

                      ${
                        order.product_status === "processing"
                          ? "bg-yellow-100 text-yellow-700"
                          : ""
                      }

                      ${
                        order.product_status === "shipped"
                          ? "bg-blue-100 text-blue-700"
                          : ""
                      }

                      ${
                        order.product_status === "delivered"
                          ? "bg-green-100 text-green-700"
                          : ""
                      }
                    `}
                  >

                    {order.product_status}

                  </span>

                </td>

                <td className="p-4">

                  {order.paid_status ? (
                    <FaCheckCircle
                      className="text-green-600"
                      size={20}
                    />
                  ) : (
                    <FaTimesCircle
                      className="text-red-500"
                      size={20}
                    />
                  )}

                </td>

                <td className="p-4 font-semibold">
                  ৳ {order.price}
                </td>

                <td className="p-4 text-center">

                  <Link
                    to={`/dashboard/orders/${order.invoice_no}`}
                    className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition"
                  >
                    <FaEye />
                    View
                  </Link>

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>
  );
};

export default OrdersTable;