"use client";

import { useState, useEffect } from "react";
import { adminApi } from "../../services/api";
import "./admin-track.css";

export default function AdminTrackPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const ordersData = await adminApi.getOrders();
      setOrders(ordersData);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch orders");
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdating(true);
    try {
      await adminApi.updateOrderStatus(orderId, newStatus);
      await fetchOrders();
      if (selectedOrder && selectedOrder._id === orderId) {
        const updatedOrder = orders.find((o) => o._id === orderId);
        setSelectedOrder({ ...updatedOrder, status: newStatus });
      }
      setUpdating(false);
    } catch (err) {
      alert("Failed to update order status");
      setUpdating(false);
    }
  };

  const getStatusProgress = (status) => {
    const statusMap = {
      pending: 0,
      processing: 25,
      shipped: 50,
      "on delivery": 75,
      delivered: 100,
    };
    return statusMap[status] || 0;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredOrders =
    filterStatus === "all"
      ? orders
      : orders.filter((order) => order.status === filterStatus);

  if (loading) {
    return (
      <div className="admin-track-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-track-container">
      <div className="admin-track-header">
        <h1 className="admin-track-title">Order Tracking Management</h1>
        <p className="admin-track-subtitle">
          Monitor and update order statuses
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button
          className={`filter-tab ${filterStatus === "all" ? "active" : ""}`}
          onClick={() => setFilterStatus("all")}
        >
          All Orders ({orders.length})
        </button>
        <button
          className={`filter-tab ${filterStatus === "pending" ? "active" : ""}`}
          onClick={() => setFilterStatus("pending")}
        >
          Pending ({orders.filter((o) => o.status === "pending").length})
        </button>
        <button
          className={`filter-tab ${
            filterStatus === "processing" ? "active" : ""
          }`}
          onClick={() => setFilterStatus("processing")}
        >
          Processing ({orders.filter((o) => o.status === "processing").length})
        </button>
        <button
          className={`filter-tab ${filterStatus === "shipped" ? "active" : ""}`}
          onClick={() => setFilterStatus("shipped")}
        >
          Shipped ({orders.filter((o) => o.status === "shipped").length})
        </button>
        <button
          className={`filter-tab ${
            filterStatus === "on delivery" ? "active" : ""
          }`}
          onClick={() => setFilterStatus("on delivery")}
        >
          On Delivery ({orders.filter((o) => o.status === "on delivery").length}
          )
        </button>
        <button
          className={`filter-tab ${
            filterStatus === "delivered" ? "active" : ""
          }`}
          onClick={() => setFilterStatus("delivered")}
        >
          Delivered ({orders.filter((o) => o.status === "delivered").length})
        </button>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="no-orders">
          <div className="no-orders-icon">📦</div>
          <h2>No Orders Found</h2>
          <p>No orders match the selected filter</p>
        </div>
      ) : (
        <div className="admin-orders-grid">
          {filteredOrders.map((order) => {
            const progress = getStatusProgress(order.status);

            return (
              <div
                key={order._id}
                className="admin-order-card"
                onClick={() => setSelectedOrder(order)}
              >
                <div className="admin-order-header">
                  <div>
                    <h3 className="admin-order-id">#{order._id.slice(-8)}</h3>
                    <p className="admin-order-email">{order.userEmail}</p>
                    <p className="admin-order-date">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="admin-order-amount">
                    ${order.totalAmount.toFixed(2)}
                  </div>
                </div>

                {/* 3D Progress Bar */}
                <div className="admin-progress-container">
                  <div className="admin-progress-bar">
                    <div
                      className="admin-progress-fill"
                      style={{ width: `${progress}%` }}
                    >
                      <div className="admin-progress-shine"></div>
                    </div>
                  </div>
                  <div className="admin-progress-text">{progress}%</div>
                </div>

                <div className="admin-status-badge-container">
                  <span
                    className={`admin-status-badge status-${order.status.replace(
                      " ",
                      "-"
                    )}`}
                  >
                    {order.status.toUpperCase()}
                  </span>
                </div>

                {order.deliveryInfo && (
                  <div className="admin-delivery-preview">
                    <p>
                      <strong>📍</strong> {order.deliveryInfo.city},{" "}
                      {order.deliveryInfo.state}
                    </p>
                    <p>
                      <strong>📞</strong> {order.deliveryInfo.phoneNumber}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Order Management Modal */}
      {selectedOrder && (
        <div
          className="admin-modal-overlay"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="admin-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="admin-modal-close"
              onClick={() => setSelectedOrder(null)}
            >
              ×
            </button>

            <h2 className="admin-modal-title">Manage Order</h2>

            {/* Status Control Panel */}
            <div className="status-control-panel">
              <h3>Update Order Status</h3>
              <div className="status-buttons">
                <button
                  className={`status-btn status-pending ${
                    selectedOrder.status === "pending" ? "active" : ""
                  }`}
                  onClick={() =>
                    updateOrderStatus(selectedOrder._id, "pending")
                  }
                  disabled={updating}
                >
                  📝 Pending
                </button>
                <button
                  className={`status-btn status-processing ${
                    selectedOrder.status === "processing" ? "active" : ""
                  }`}
                  onClick={() =>
                    updateOrderStatus(selectedOrder._id, "processing")
                  }
                  disabled={updating}
                >
                  ⚙️ Processing
                </button>
                <button
                  className={`status-btn status-shipped ${
                    selectedOrder.status === "shipped" ? "active" : ""
                  }`}
                  onClick={() =>
                    updateOrderStatus(selectedOrder._id, "shipped")
                  }
                  disabled={updating}
                >
                  📦 Shipped
                </button>
                <button
                  className={`status-btn status-on-delivery ${
                    selectedOrder.status === "on delivery" ? "active" : ""
                  }`}
                  onClick={() =>
                    updateOrderStatus(selectedOrder._id, "on delivery")
                  }
                  disabled={updating}
                >
                  🚚 On Delivery
                </button>
                <button
                  className={`status-btn status-delivered ${
                    selectedOrder.status === "delivered" ? "active" : ""
                  }`}
                  onClick={() =>
                    updateOrderStatus(selectedOrder._id, "delivered")
                  }
                  disabled={updating}
                >
                  ✅ Delivered
                </button>
              </div>
              {updating && <p className="updating-text">Updating...</p>}
            </div>

            {/* Order Details */}
            <div className="admin-modal-section">
              <h3>Order Information</h3>
              <p>
                <strong>Order ID:</strong> {selectedOrder._id}
              </p>
              <p>
                <strong>Customer:</strong> {selectedOrder.userEmail}
              </p>
              <p>
                <strong>Date:</strong> {formatDate(selectedOrder.createdAt)}
              </p>
              <p>
                <strong>Total:</strong> ${selectedOrder.totalAmount.toFixed(2)}
              </p>
            </div>

            {selectedOrder.deliveryInfo && (
              <div className="admin-modal-section">
                <h3>Delivery Information</h3>
                <div className="delivery-info-grid">
                  <div className="delivery-info-item">
                    <span className="delivery-icon">👤</span>
                    <div>
                      <p className="delivery-label">Full Name</p>
                      <p className="delivery-value">
                        {selectedOrder.deliveryInfo.fullName}
                      </p>
                    </div>
                  </div>
                  <div className="delivery-info-item">
                    <span className="delivery-icon">📞</span>
                    <div>
                      <p className="delivery-label">Phone</p>
                      <p className="delivery-value">
                        {selectedOrder.deliveryInfo.phoneNumber}
                      </p>
                    </div>
                  </div>
                  <div className="delivery-info-item full-width">
                    <span className="delivery-icon">📍</span>
                    <div>
                      <p className="delivery-label">Address</p>
                      <p className="delivery-value">
                        {selectedOrder.deliveryInfo.address}
                        <br />
                        {selectedOrder.deliveryInfo.city},{" "}
                        {selectedOrder.deliveryInfo.state}{" "}
                        {selectedOrder.deliveryInfo.postalCode}
                        {selectedOrder.deliveryInfo.landmark && (
                          <>
                            <br />
                            Landmark: {selectedOrder.deliveryInfo.landmark}
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="admin-modal-section">
              <h3>Items Ordered</h3>
              <div className="admin-modal-items">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="admin-modal-item">
                    {item.image && <img src={item.image} alt={item.name} />}
                    <div className="admin-modal-item-details">
                      <p className="admin-modal-item-name">{item.name}</p>
                      <p className="admin-modal-item-price">
                        ${item.price.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                    <div className="admin-modal-item-total">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
