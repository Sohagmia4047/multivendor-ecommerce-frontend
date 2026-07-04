import React from "react";
import {
  FaTachometerAlt,
  FaShoppingBag,
  FaTruck,
  FaMapMarkerAlt,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";

const DashboardSidebar = () => {
  const navigate = useNavigate();

  // ⚠️ FIX: add real logout logic here
  const handleLogout = () => {
    localStorage.removeItem("token"); // example
    navigate("/login");
  };

  const menuClass = ({ isActive }) =>
    `flex items-center gap-3 px-5 py-4 rounded-lg border transition-all duration-200
    ${
      isActive
        ? "bg-emerald-500 text-white border-emerald-500 shadow"
        : "bg-white text-gray-700 hover:bg-emerald-500 hover:text-white"
    }`;

  return (
    <div className="space-y-3">

      {/* DASHBOARD */}
      <NavLink to="/dashboard" end className={menuClass}>
        <FaTachometerAlt size={18} />
        <span>Dashboard</span>
      </NavLink>

      {/* ORDERS */}
      <NavLink to="/dashboard/orders" end className={menuClass}>
        <FaShoppingBag size={18} />
        <span>Orders</span>
      </NavLink>

      {/* TRACK */}
      <NavLink to="/dashboard/orders/track-all" className={menuClass}>
        <FaTruck size={18} />
        <span>Track Your Order</span>
      </NavLink>

      {/* ADDRESS */}
      <NavLink to="/dashboard/address" end className={menuClass}>
        <FaMapMarkerAlt size={18} />
        <span>My Address</span>
      </NavLink>

      {/* ACCOUNT */}
      <NavLink to="/dashboard/account" end className={menuClass}>
        <FaUser size={18} />
        <span>Account Details</span>
      </NavLink>

      {/* LOGOUT */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-3 px-5 py-4 rounded-lg border bg-white text-gray-700 hover:bg-red-500 hover:text-white transition-all duration-200"
      >
        <FaSignOutAlt size={18} />
        Logout
      </button>

    </div>
  );
};

export default DashboardSidebar;