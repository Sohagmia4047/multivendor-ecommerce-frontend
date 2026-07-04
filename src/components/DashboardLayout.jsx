import React from "react";
import { Outlet } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar";
import PublicLayout from "./PublicLayout";

const DashboardLayout = () => {
  return (
    <PublicLayout>
    <section className="bg-gray-100 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <DashboardSidebar />
          </div>

          {/* Dynamic Content */}
          <div className="lg:col-span-3 bg-white rounded-xl shadow p-6">
            <Outlet />
          </div>

        </div>
      </div>
    </section>
    </PublicLayout>
  );
};

export default DashboardLayout;