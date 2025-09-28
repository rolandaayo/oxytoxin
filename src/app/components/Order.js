"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  FaBox,
  FaTruck,
  FaCheck,
  FaClock,
  FaTrash,
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaPrint,
  FaDownload,
  FaExclamationCircle,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { publicApi } from "../services/api";

export default function Order() {
  const [mounted, setMounted] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  // Handle client-side mounting and load orders
  useEffect(() => {
    setMounted(true);
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const userEmail = localStorage.getItem("userEmail");

      if (!userEmail) {
        // If no user email, try to load from localStorage as fallback
        const savedOrders = localStorage.getItem("orders");
        if (savedOrders) {
          setOrders(JSON.parse(savedOrders));
        }
        setLoading(false);
        return;
      }

      // Load orders from backend
      const response = await publicApi.getUserOrders(userEmail);
      if (response.status === "success") {
        setOrders(response.data || []);
      }
    } catch (error) {
      console.error("Error loading orders:", error);
      // Fallback to localStorage
      try {
        const savedOrders = localStorage.getItem("orders");
        if (savedOrders) {
          setOrders(JSON.parse(savedOrders));
        }
      } catch (localError) {
        console.error("Error loading from localStorage:", localError);
      }
    } finally {
      setLoading(false);
    }
  };

  // Show loading state during SSR or when loading
  if (!mounted || loading) {
    return (
      <div className="min-h-screen pt-16 md:pt-[calc(4rem+32px)]">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-32"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getOrderStatus = (status) => {
    switch (status) {
      case "processing":
        return {
          icon: <FaClock className="w-5 h-5 text-yellow-500" />,
          text: "Processing",
          color: "text-yellow-500",
          bg: "bg-yellow-50",
        };
      case "shipped":
        return {
          icon: <FaTruck className="w-5 h-5 text-blue-500" />,
          text: "Shipped",
          color: "text-blue-500",
          bg: "bg-blue-50",
        };
      case "delivered":
        return {
          icon: <FaCheck className="w-5 h-5 text-green-500" />,
          text: "Delivered",
          color: "text-green-500",
          bg: "bg-green-50",
        };
      default:
        return {
          icon: <FaBox className="w-5 h-5 text-gray-500" />,
          text: "Pending",
          color: "text-gray-500",
          bg: "bg-gray-50",
        };
    }
  };

  const deleteOrder = (orderId) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-4">
          <p className="font-medium">
            Are you sure you want to delete this order?
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setOrders((prev) =>
                  prev.filter((order) => order.id !== orderId)
                );
                toast.success("Order deleted successfully", {
                  icon: "🗑️",
                  duration: 2000,
                });
                toast.dismiss(t.id);
              }}
              className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: "top-center",
        style: {
          minWidth: "300px",
        },
      }
    );
  };

  const printOrder = (order) => {
    // Implement print functionality
    window.print();
    toast.success("Printing order details...", {
      icon: "🖨️",
      duration: 2000,
    });
  };

  const downloadInvoice = (order) => {
    // Implement invoice download
    toast.success("Downloading invoice...", {
      icon: "📥",
      duration: 2000,
    });
  };

  const reportIssue = (order) => {
    toast("Report feature coming soon!", {
      icon: "⚠️",
      duration: 2000,
    });
  };

  const filteredOrders = orders
    .filter((order) => {
      const orderId = order._id || order.id;
      const orderDate = order.createdAt || order.date;

      const matchesSearch =
        orderId.toString().includes(searchQuery) ||
        order.items.some((item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;
      const matchesDate =
        (!dateRange.from || new Date(orderDate) >= new Date(dateRange.from)) &&
        (!dateRange.to || new Date(orderDate) <= new Date(dateRange.to));

      return matchesSearch && matchesStatus && matchesDate;
    })
    .sort((a, b) => {
      const aDate = a.createdAt || a.date;
      const bDate = b.createdAt || b.date;

      switch (sortBy) {
        case "date":
          return sortOrder === "asc"
            ? new Date(aDate) - new Date(bDate)
            : new Date(bDate) - new Date(aDate);
        case "status":
          return sortOrder === "asc"
            ? a.status.localeCompare(b.status)
            : b.status.localeCompare(a.status);
        case "amount":
          return sortOrder === "asc"
            ? a.totalAmount - b.totalAmount
            : b.totalAmount - a.totalAmount;
        default:
          return 0;
      }
    });

  const clearStoredData = (paymentReference) => {
    // Create order data with a stable ID and consistent date format
    const orderData = {
      id: `ORD-${paymentReference}`,
      date: new Date().toISOString(),
      status: "processing",
      items: cartItems,
      totalAmount: totalAmount,
      paymentRef: paymentReference,
    };

    // Get existing orders and add new order
    const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    const updatedOrders = [...existingOrders, orderData];
    localStorage.setItem("orders", JSON.stringify(updatedOrders));

    // Clear cart data
    clearCart();
    setShowCart(false);

    toast.success("Payment completed successfully!", {
      duration: 3000,
    });
  };

  // Format date consistently
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // YYYY-MM-DD format
  };

  if (orders.length === 0) {
    return (
      <div className="min-h-screen pt-16 md:pt-[calc(4rem+32px)]">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16 bg-white/95 backdrop-blur-sm rounded-lg shadow-md">
            <FaBox className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">No Orders Yet</h3>
            <p className="text-gray-600 mb-6">
              Your orders will appear here after successful purchases
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-16 md:pt-[calc(4rem+32px)]">
      {/* Hero Section */}
      <div className="relative h-[200px] md:h-[300px] mb-8">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("/images/image2.jpeg")',
          }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            My Orders
          </h1>
          <p className="text-lg text-white max-w-2xl">
            Track and manage your orders
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters and Search */}
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-black pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>

            {/* Date Range */}
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, from: e.target.value }))
              }
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, to: e.target.value }))
              }
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6 ">
          {filteredOrders.map((order) => (
            <div
              key={order._id || order.id}
              className="bg-white/95 backdrop-blur-sm rounded-lg shadow-sm p-6"
            >
              <div className="flex flex-wrap justify-between items-start mb-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">
                    Order ID: {order._id || order.id}
                  </p>
                  <p className="text-sm text-gray-600">
                    Date: {formatDate(order.createdAt || order.date)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div
                    className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                      getOrderStatus(order.status).bg
                    }`}
                  >
                    {getOrderStatus(order.status).icon}
                    <span
                      className={`text-sm font-medium ${
                        getOrderStatus(order.status).color
                      }`}
                    >
                      {getOrderStatus(order.status).text}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => printOrder(order)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                      title="Print Order"
                    >
                      <FaPrint className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => downloadInvoice(order)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                      title="Download Invoice"
                    >
                      <FaDownload className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => reportIssue(order)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                      title="Report Issue"
                    >
                      <FaExclamationCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteOrder(order._id || order.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      title="Delete Order"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="divide-y">
                {order.items.map((item) => (
                  <div key={item.id} className="py-4 flex gap-4">
                    <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-black">{item.name}</h3>
                      <p className="text-sm text-gray-600">Size: {item.size}</p>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-sm font-medium text-black">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-black">Total Amount:</span>
                  <span className="font-bold text-black">
                    ₦{order.totalAmount.toLocaleString()}
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Payment Reference: {order.paymentRef}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
