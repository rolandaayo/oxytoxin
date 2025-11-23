"use client";

import { useState, useEffect } from "react";
import { userApi } from "../services/api";
import "./track.css";

export default function TrackOrderPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const userEmail = localStorage.getItem("userEmail");
      if (!userEmail) {
        setError("Please log in to track your orders");
        setLoading(false);
        return;
      }

      const ordersData = await userApi.getUserOrders(userEmail);
      setOrders(ordersData);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch orders");
      setLoading(false);
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

  const getStatusStep = (status) => {
    const statusMap = {
      pending: 1,
      processing: 2,
      shipped: 3,
      "on delivery": 4,
      delivered: 5,
    };
    return statusMap[status] || 1;
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

  if (loading) {
    return (
      <div className="track-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="track-container">
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="track-container">
      <div className="track-header">
        <h1 className="track-title">Track Your Orders</h1>
        <p className="track-subtitle">Monitor your order status in real-time</p>
      </div>

      {orders.length === 0 ? (
        <div className="no-orders">
          <div className="no-orders-icon">📦</div>
          <h2>No Orders Yet</h2>
          <p>Start shopping to see your orders here</p>
          <a href="/shop" className="shop-now-btn">
            Start Shopping
          </a>
        </div>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => {
            const progress = getStatusProgress(order.status);
            const currentStep = getStatusStep(order.status);

            return (
              <div
                key={order._id}
                className="order-card"
                onClick={() => setSelectedOrder(order)}
              >
                <div className="order-card-header">
                  <div className="order-info">
                    <h3 className="order-id">Order #{order._id.slice(-8)}</h3>
                    <p className="order-date">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="order-amount">
                    ₦{order.totalAmount.toLocaleString()}
                  </div>
                </div>

                <div className="order-items-preview">
                  {order.items.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="item-preview">
                      {item.image && <img src={item.image} alt={item.name} />}
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="item-preview more">
                      +{order.items.length - 3}
                    </div>
                  )}
                </div>

                {/* 3D Progress Bar */}
                <div className="progress-container-3d">
                  <div className="progress-bar-3d">
                    <div
                      className="progress-fill-3d"
                      style={{ width: `${progress}%` }}
                    >
                      <div className="progress-shine"></div>
                      <div className="progress-glow"></div>
                    </div>
                    <div className="progress-track-3d"></div>
                  </div>
                  <div className="progress-percentage">{progress}%</div>
                </div>

                {/* Status Steps */}
                <div className="status-steps">
                  <div
                    className={`step ${currentStep >= 1 ? "active" : ""} ${
                      currentStep > 1 ? "completed" : ""
                    }`}
                  >
                    <div className="step-icon">📝</div>
                    <div className="step-label">Pending</div>
                  </div>
                  <div
                    className={`step ${currentStep >= 2 ? "active" : ""} ${
                      currentStep > 2 ? "completed" : ""
                    }`}
                  >
                    <div className="step-icon">⚙️</div>
                    <div className="step-label">Processing</div>
                  </div>
                  <div
                    className={`step ${currentStep >= 3 ? "active" : ""} ${
                      currentStep > 3 ? "completed" : ""
                    }`}
                  >
                    <div className="step-icon">📦</div>
                    <div className="step-label">Shipped</div>
                  </div>
                  <div
                    className={`step ${currentStep >= 4 ? "active" : ""} ${
                      currentStep > 4 ? "completed" : ""
                    }`}
                  >
                    <div className="step-icon">🚚</div>
                    <div className="step-label">On Delivery</div>
                  </div>
                  <div className={`step ${currentStep >= 5 ? "active" : ""}`}>
                    <div className="step-icon">✅</div>
                    <div className="step-label">Delivered</div>
                  </div>
                </div>

                <div className="current-status">
                  <span
                    className={`status-badge status-${order.status.replace(
                      " ",
                      "-"
                    )}`}
                  >
                    {order.status.toUpperCase()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setSelectedOrder(null)}
            >
              ×
            </button>

            <h2 className="modal-title">Order Details</h2>

            <div className="modal-section">
              <h3>Order Information</h3>
              <p>
                <strong>Order ID:</strong> {selectedOrder._id}
              </p>
              <p>
                <strong>Date:</strong> {formatDate(selectedOrder.createdAt)}
              </p>
              <p>
                <strong>Total:</strong> ₦
                {selectedOrder.totalAmount.toLocaleString()}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`status-badge status-${selectedOrder.status.replace(
                    " ",
                    "-"
                  )}`}
                >
                  {selectedOrder.status.toUpperCase()}
                </span>
              </p>
            </div>

            {selectedOrder.deliveryInfo && (
              <div className="modal-section">
                <h3>Delivery Information</h3>
                <p>
                  <strong>Name:</strong> {selectedOrder.deliveryInfo.fullName}
                </p>
                <p>
                  <strong>Phone:</strong>{" "}
                  {selectedOrder.deliveryInfo.phoneNumber}
                </p>
                <p>
                  <strong>Address:</strong> {selectedOrder.deliveryInfo.address}
                </p>
                <p>
                  <strong>City:</strong> {selectedOrder.deliveryInfo.city}
                </p>
                <p>
                  <strong>State:</strong> {selectedOrder.deliveryInfo.state}
                </p>
                <p>
                  <strong>Postal Code:</strong>{" "}
                  {selectedOrder.deliveryInfo.postalCode}
                </p>
                {selectedOrder.deliveryInfo.landmark && (
                  <p>
                    <strong>Landmark:</strong>{" "}
                    {selectedOrder.deliveryInfo.landmark}
                  </p>
                )}
              </div>
            )}

            <div className="modal-section">
              <h3>Items Ordered</h3>
              <div className="modal-items">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="modal-item">
                    {item.image && <img src={item.image} alt={item.name} />}
                    <div className="modal-item-details">
                      <p className="modal-item-name">{item.name}</p>
                      <p className="modal-item-price">
                        ${item.price.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                    <div className="modal-item-total">
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
