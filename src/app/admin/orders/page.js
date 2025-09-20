"use client";
import { useState, useEffect } from "react";
import { adminApi } from "../../services/api";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { FaMapMarkerAlt, FaEye, FaTruck } from "react-icons/fa";
import { useAdminAuth } from "../../context/AdminAuthContext";
import AdminLogin from "../../components/AdminLogin";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const { isAdminAuthenticated, loginAdmin } = useAdminAuth();

  const statusOptions = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "successful",
    "cancelled",
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const ordersData = await adminApi.getOrders();
      setOrders(ordersData);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = orders.filter(
    (order) =>
      order.userEmail?.toLowerCase().includes(search.toLowerCase()) ||
      order.paymentRef?.toLowerCase().includes(search.toLowerCase()) ||
      order.status?.toLowerCase().includes(search.toLowerCase())
  );

  const handleViewDelivery = (order) => {
    setSelectedOrder(order);
    setShowDeliveryModal(true);
  };

  const handleChangeStatus = async (order, newStatus) => {
    const prevStatus = order.status;
    // Optimistic update
    setOrders((prev) =>
      prev.map((o) => (o._id === order._id ? { ...o, status: newStatus } : o))
    );
    try {
      await adminApi.updateOrderStatus(order._id, newStatus, order.paymentRef);
      toast.success("Order status updated");
    } catch (error) {
      // Revert on failure
      setOrders((prev) =>
        prev.map((o) =>
          o._id === order._id ? { ...o, status: prevStatus } : o
        )
      );
      toast.error(error.message || "Failed to update status");
    }
  };

  const handleDeleteOrder = async (order) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    try {
      await adminApi.deleteOrder(order._id);
      toast.success("Order deleted");
      setOrders((prev) => prev.filter((o) => o._id !== order._id));
    } catch (error) {
      console.error("Error deleting order:", error);
      // Fallback: if delete API is unavailable on server, mark as cancelled
      try {
        await adminApi.updateOrderStatus(
          order._id,
          "cancelled",
          order.paymentRef
        );
        toast.success("Order marked as cancelled (delete unavailable)");
        setOrders((prev) => prev.filter((o) => o._id !== order._id));
      } catch (e) {
        toast.error(error.message || "Failed to delete order");
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "successful":
      case "delivered":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "processing":
        return "bg-blue-100 text-blue-700";
      case "shipped":
        return "bg-purple-100 text-purple-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Show login form if not authenticated
  if (!isAdminAuthenticated) {
    return <AdminLogin onLogin={loginAdmin} />;
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto w-full py-10 px-4">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto w-full py-10 px-4">
      <h1 className="text-3xl font-bold mb-2 text-gray-900">Orders</h1>
      <p className="mb-6 text-gray-600 text-lg">
        Track and manage customer orders
      </p>

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <input
          type="text"
          placeholder="Search orders..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-72 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
                  No orders found.
                </td>
              </tr>
            ) : (
              filtered.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {order.paymentRef || order._id.slice(-8)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {order.userEmail}
                    </div>
                    {order.deliveryInfo?.fullName && (
                      <div className="text-xs text-gray-500">
                        {order.deliveryInfo.fullName}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {order.items?.length || 0} items
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ₦{order.totalAmount?.toLocaleString() || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={order.status || "pending"}
                      onChange={(e) =>
                        handleChangeStatus(order, e.target.value)
                      }
                      className={`px-2 py-1 rounded text-xs font-semibold border ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.createdAt
                      ? format(new Date(order.createdAt), "MMM dd, yyyy")
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs font-medium flex items-center gap-1"
                        onClick={() => handleViewDelivery(order)}
                      >
                        <FaMapMarkerAlt className="w-3 h-3" />
                        Delivery
                      </button>
                      <button
                        className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-xs font-medium"
                        onClick={() => handleDeleteOrder(order)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delivery Information Modal */}
      {showDeliveryModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto relative shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 bg-white pb-4 border-b flex justify-between items-center p-6">
              <div>
                <h2 className="text-xl font-bold text-black">Order Details</h2>
                <p className="text-sm text-gray-600">
                  Order:{" "}
                  {selectedOrder.paymentRef || selectedOrder._id.slice(-8)}
                </p>
              </div>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowDeliveryModal(false)}
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-black mb-3">Order Summary</h3>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-700">
                        {item.name} x{item.quantity}
                      </span>
                      <span className="font-medium">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>₦{selectedOrder.totalAmount?.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Information */}
              {selectedOrder.deliveryInfo ? (
                <div className="bg-white border rounded-lg p-4">
                  <h3 className="font-semibold text-black mb-4 flex items-center gap-2">
                    <FaTruck className="w-4 h-4" />
                    Delivery Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Name:</span>
                      <p className="text-gray-700">
                        {selectedOrder.deliveryInfo.fullName}
                      </p>
                    </div>

                    <div>
                      <span className="font-medium">Phone:</span>
                      <p className="text-gray-700">
                        {selectedOrder.deliveryInfo.phoneNumber}
                      </p>
                    </div>

                    <div className="md:col-span-2">
                      <span className="font-medium">Address:</span>
                      <p className="text-gray-700">
                        {selectedOrder.deliveryInfo.address}
                      </p>
                    </div>

                    <div>
                      <span className="font-medium">City:</span>
                      <p className="text-gray-700">
                        {selectedOrder.deliveryInfo.city}
                      </p>
                    </div>

                    <div>
                      <span className="font-medium">State:</span>
                      <p className="text-gray-700">
                        {selectedOrder.deliveryInfo.state}
                      </p>
                    </div>

                    {selectedOrder.deliveryInfo.postalCode && (
                      <div>
                        <span className="font-medium">Postal Code:</span>
                        <p className="text-gray-700">
                          {selectedOrder.deliveryInfo.postalCode}
                        </p>
                      </div>
                    )}

                    {selectedOrder.deliveryInfo.landmark && (
                      <div>
                        <span className="font-medium">Landmark:</span>
                        <p className="text-gray-700">
                          {selectedOrder.deliveryInfo.landmark}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="w-4 h-4 text-yellow-600" />
                    <h3 className="font-semibold text-yellow-800">
                      No Delivery Information
                    </h3>
                  </div>
                  <p className="text-yellow-700 text-sm mt-1">
                    This order does not have delivery information. This might be
                    an older order.
                  </p>
                </div>
              )}

              {/* Order Status */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-black mb-2">Order Status</h3>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded text-sm font-semibold ${getStatusColor(
                      selectedOrder.status
                    )}`}
                  >
                    {selectedOrder.status || "pending"}
                  </span>
                  <span className="text-sm text-gray-500">
                    {selectedOrder.createdAt
                      ? `${format(
                          new Date(selectedOrder.createdAt),
                          "MMM dd, yyyy"
                        )} at ${format(
                          new Date(selectedOrder.createdAt),
                          "HH:mm"
                        )}`
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
