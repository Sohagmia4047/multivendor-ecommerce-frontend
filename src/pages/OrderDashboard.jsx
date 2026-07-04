import React, { useEffect, useState } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import OrdersTable from "../components/OrdersTable";
import { getMyOrders } from "../utils/dashboardService";
import PublicLayout from "../components/PublicLayout";

const OrderDashboard = () => {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await getMyOrders();
      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gray-100 min-h-screen py-10">

      <div className="max-w-7xl mx-auto px-4">

        <div>

          {/* Content */}

          <div className="lg:col-span-3 bg-white rounded-xl shadow">

            <div className="border-b px-8 py-6">

              <h2 className="text-3xl font-bold">
                Your Orders
              </h2>

              <p className="text-gray-500 mt-2">
                Manage your recent orders
              </p>

            </div>

            <div className="p-8">

              {loading ? (

                <div className="text-center py-20">

                  Loading...

                </div>

              ) : (

                <OrdersTable orders={orders} />

              )}

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default OrderDashboard;