"use client";
import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaEdit,
  FaSave,
  FaArrowLeft,
} from "react-icons/fa";
import { useCart } from "../context/CartContext";
import Image from "next/image";
import toast from "react-hot-toast";

export default function Checkout({ onClose, onProceedToPayment }) {
  const { cartItems, totalAmount, initializePayment } = useCart();
  const [deliveryInfo, setDeliveryInfo] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    landmark: "",
  });
  const [isEditing, setIsEditing] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Load saved delivery info from API
  useEffect(() => {
    const loadDeliveryInfo = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const response = await fetch(
          "https://oxytoxin-backend.vercel.app/api/delivery/get",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.deliveryInfo) {
            setDeliveryInfo(data.deliveryInfo);
            setIsEditing(false);
          }
        }
      } catch (error) {
        console.error("Error loading delivery info:", error);
      }
    };

    loadDeliveryInfo();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeliveryInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    // Basic validation
    if (!deliveryInfo.fullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    if (!deliveryInfo.phoneNumber.trim()) {
      toast.error("Please enter your phone number");
      return;
    }
    if (!deliveryInfo.address.trim()) {
      toast.error("Please enter your delivery address");
      return;
    }
    if (!deliveryInfo.city.trim()) {
      toast.error("Please enter your city");
      return;
    }
    if (!deliveryInfo.state.trim()) {
      toast.error("Please enter your state");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      console.log("=== DELIVERY INFO SAVE DEBUG ===");
      console.log("Token exists:", !!token);
      console.log("Token length:", token?.length);
      console.log(
        "Token preview:",
        token ? `${token.substring(0, 20)}...` : "No token"
      );
      console.log("User email:", localStorage.getItem("userEmail"));
      console.log("Delivery info:", deliveryInfo);

      if (!token) {
        toast.error("Please log in to save delivery information");
        return;
      }

      const response = await fetch(
        "https://oxytoxin-backend.vercel.app/api/delivery/save",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(deliveryInfo),
        }
      );

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (response.ok) {
        setIsEditing(false);
        toast.success("Delivery information saved successfully!");
      } else {
        const errorText = await response.text();
        console.log("Error response text:", errorText);

        // Handle authentication errors
        if (response.status === 401) {
          try {
            const errorData = await response.json();
            if (errorData.code === "SESSION_EXPIRED_INACTIVITY") {
              toast.error(
                "Your session has expired due to inactivity. Please log in again."
              );
            } else {
              toast.error("Your session has expired. Please log in again.");
            }
          } catch (parseError) {
            toast.error("Your session has expired. Please log in again.");
          }
          localStorage.removeItem("authToken");
          localStorage.removeItem("userEmail");
          window.location.href = "/login";
          return;
        }

        try {
          const error = JSON.parse(errorText);
          console.log("Parsed error:", error);
          toast.error(error.message || "Failed to save delivery information");
        } catch (parseError) {
          console.log("Could not parse error response:", parseError);
          toast.error(`Server error: ${response.status} - ${errorText}`);
        }
      }
    } catch (error) {
      console.error("Error saving delivery info:", error);
      toast.error("Failed to save delivery information. Please try again.");
    }
  };

  const handleProceedToPayment = async () => {
    if (isEditing) {
      toast.error("Please save your delivery information first");
      return;
    }

    setIsLoading(true);
    try {
      // Pass delivery info to payment initialization
      await initializePayment(deliveryInfo);
      onClose(); // Close checkout modal
    } catch (error) {
      console.error("Payment initialization error:", error);
      toast.error("Failed to proceed to payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleBackToCart = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto relative shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white pb-4 border-b flex justify-between items-center p-6">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBackToCart}
              className="text-gray-600 hover:text-gray-800 p-1"
            >
              <FaArrowLeft className="w-4 h-4" />
            </button>
            <h2 className="text-xl font-bold text-black">Checkout</h2>
          </div>
          <FaTimes
            className="cursor-pointer text-black hover:text-gray-700"
            onClick={onClose}
          />
        </div>

        <div className="p-6 space-y-6">
          {/* Order Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-black mb-3">Order Summary</h3>
            <div className="space-y-2">
              {cartItems.map((item) => (
                <div
                  key={item.cartItemId}
                  className="flex items-center gap-3 text-sm"
                >
                  <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                    <Image
                      src={
                        item.mainImage ||
                        (Array.isArray(item.images)
                          ? item.images[0]
                          : item.image) ||
                        "/images/logo.png"
                      }
                      alt={item.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-contain p-1"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-black truncate">
                      {item.name}
                    </p>
                    <p className="text-gray-600">
                      Size: {item.size} • Qty: {item.quantity || 1}
                    </p>
                  </div>
                  <p className="font-semibold text-black">
                    ₦{(item.price * (item.quantity || 1)).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg text-black">Total:</span>
                <span className="font-bold text-lg text-black">
                  ₦{totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="bg-white border rounded-lg p-4">
            <div className="mb-4">
              <h3 className="font-semibold text-black flex items-center gap-2">
                <FaMapMarkerAlt className="w-4 h-4" />
                Delivery Information
              </h3>
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      name="fullName"
                      value={deliveryInfo.fullName}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={deliveryInfo.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Address *
                  </label>
                  <textarea
                    name="address"
                    value={deliveryInfo.address}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                    placeholder="Enter your complete delivery address"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={deliveryInfo.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={deliveryInfo.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                      placeholder="State"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={deliveryInfo.postalCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                      placeholder="Postal code"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Landmark
                    </label>
                    <input
                      type="text"
                      name="landmark"
                      value={deliveryInfo.landmark}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                      placeholder="Nearby landmark"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSave}
                  className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  <FaSave className="w-4 h-4" />
                  Save Delivery Information
                </button>
              </div>
            ) : (
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900">
                    Delivery Details Preview
                  </h4>
                  <button
                    onClick={handleEdit}
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-medium"
                  >
                    <FaEdit className="w-3 h-3" />
                    Edit Details
                  </button>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <p className="text-gray-900">
                    <strong className="text-gray-700">Name:</strong>{" "}
                    {deliveryInfo.fullName}
                  </p>
                  <p className="text-gray-900">
                    <strong className="text-gray-700">Phone:</strong>{" "}
                    {deliveryInfo.phoneNumber}
                  </p>
                  <p className="text-gray-900">
                    <strong className="text-gray-700">Address:</strong>{" "}
                    {deliveryInfo.address}
                  </p>
                  <p className="text-gray-900">
                    <strong className="text-gray-700">City:</strong>{" "}
                    {deliveryInfo.city}, {deliveryInfo.state}
                  </p>
                  {deliveryInfo.postalCode && (
                    <p className="text-gray-900">
                      <strong className="text-gray-700">Postal Code:</strong>{" "}
                      {deliveryInfo.postalCode}
                    </p>
                  )}
                  {deliveryInfo.landmark && (
                    <p className="text-gray-900">
                      <strong className="text-gray-700">Landmark:</strong>{" "}
                      {deliveryInfo.landmark}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Proceed to Payment Button */}
          {!isEditing && (
            <button
              onClick={handleProceedToPayment}
              disabled={isLoading}
              className={`w-full py-4 rounded-lg transition-colors font-semibold text-lg ${
                isLoading
                  ? "opacity-50 cursor-not-allowed bg-gray-400"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {isLoading ? "Processing..." : "Proceed to Payment"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
