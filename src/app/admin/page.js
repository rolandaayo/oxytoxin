"use client";

import { useState, useEffect } from "react";
import { adminApi } from "../services/api";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useAdminAuth } from "../context/AdminAuthContext";
import AdminLogin from "../components/AdminLogin";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const { isAdminAuthenticated, isLoading, loginAdmin } = useAdminAuth();

  useEffect(() => {
    async function fetchUsers() {
      try {
        const users = await adminApi.getUsers();
        setUsers(users);
      } catch (err) {}
    }
    async function fetchProducts() {
      try {
        const products = await adminApi.getProducts();
        setProducts(products);
      } catch (err) {}
    }
    fetchUsers();
    fetchProducts();
  }, []);

  const today = format(new Date(), "MMM dd, yyyy");
  const vendorPercent = 80;
  const customerPercent = 20;
  const donutCirc = 2 * Math.PI * 40;

  const stats = [
    { label: "Total Users", value: users.length, icon: "👥" },
    { label: "Total Transactions", value: 0, icon: "💰" },
    { label: "Total Products", value: products.length, icon: "📦" },
    { label: "Total Orders", value: 1, icon: "🧾" },
  ];

  // Show login form if not authenticated
  if (!isAdminAuthenticated) {
    return <AdminLogin onLogin={loginAdmin} />;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 text-white rounded-xl p-6 sm:p-10 lg:p-20 flex flex-col sm:flex-row items-center sm:items-center justify-between shadow gap-4 sm:gap-0 text-center sm:text-left">
        <div>
          <div className="text-xl font-semibold mb-2">
            Welcome, Oxytoxin <span className="inline-block">👋</span>
          </div>
          <div className="text-sm">Have a great day!</div>
        </div>
        <div className="flex items-center justify-center mt-4 sm:mt-0 gap-4">
          <div className="bg-white/10 rounded-lg px-4 py-2 flex items-center gap-2">
            <span className="text-lg">📅</span>
            <span className="font-medium">{today}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl shadow flex flex-col items-center py-6"
          >
            <span className="text-3xl mb-2">{stat.icon}</span>
            <div className="text-2xl font-bold text-black">{stat.value}</div>
            <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* New Users and User Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* New Users Table */}
        <div className="md:col-span-2 bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-semibold text-black">New Users</div>
            <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
              Export
            </button>
          </div>
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="py-2 px-4 text-left text-black">#</th>
                <th className="py-2 px-4 text-left text-black">Name</th>
                <th className="py-2 px-4 text-left text-black">Account Type</th>
                <th className="py-2 px-4 text-left text-black">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr key={user._id} className="hover:bg-gray-100">
                  <td className="py-2 px-4 text-black">{idx + 1}</td>
                  <td className="py-2 px-4 text-black">{user.name}</td>
                  <td className="py-2 px-4 text-black">Customer</td>
                  <td className="py-2 px-4 text-black">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        user.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {user.status || "Active"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* User Analysis Donut Chart */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center">
          <div className="text-lg font-semibold mb-4 text-black">
            User Analysis
          </div>
          <svg width="120" height="120" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#e5e7eb"
              strokeWidth="12"
              fill="none"
            />
            {/* Vendors (orange) */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#f97316"
              strokeWidth="12"
              fill="none"
              strokeDasharray={`${donutCirc}`}
              strokeDashoffset={`${donutCirc * (1 - vendorPercent / 100)}`}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
            {/* Customers (gray) - not needed, background shows */}
            <text
              x="50"
              y="55"
              textAnchor="middle"
              fontSize="20"
              fill="#f97316"
              fontWeight="bold"
            >
              {vendorPercent}%
            </text>
          </svg>
          {/* <div className="flex flex-col items-center mt-4 text-sm">
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-block w-3 h-3 rounded-full bg-orange-400"></span>
              <span className="text-black">Vendors ({vendorPercent}%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-gray-300"></span>
              <span className="text-black">Customers ({customerPercent}%)</span>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
