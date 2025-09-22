"use client";
import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaMapMarkerAlt,
  FaPhone,
  FaUser,
  FaEdit,
  FaSave,
} from "react-icons/fa";
import toast from "react-hot-toast";

export default function CustomerDeliveryModal({ customer, onClose, onUpdate }) {
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState({});

  useEffect(() => {
    if (customer) {
      loadDeliveryInfo();
    }
  }, [customer]);

  const loadDeliveryInfo = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");

      const response = await fetch(
        `https://oxytoxin-backend.vercel.app/api/delivery/admin/user/${customer._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setDeliveryInfo(data.deliveryInfo);
        setEditedInfo(data.deliveryInfo || {});
      } else {
        setDeliveryInfo(null);
      }
    } catch (error) {
      console.error("Error loading delivery info:", error);
      toast.error("Failed to load delivery information");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedInfo(deliveryInfo || {});
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch(
        `https://oxytoxin-backend.vercel.app/api/delivery/admin/user/${customer._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedInfo),
        }
      );

      if (response.ok) {
        setDeliveryInfo(editedInfo);
        setIsEditing(false);
        toast.success("Delivery information updated successfully");
        if (onUpdate) onUpdate();
      } else {
        toast.error("Failed to update delivery information");
      }
    } catch (error) {
      console.error("Error updating delivery info:", error);
      toast.error("Failed to update delivery information");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedInfo(deliveryInfo || {});
  };

  if (!customer) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto relative shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white pb-4 border-b flex justify-between items-center p-6">
          <div>
            <h2 className="text-xl font-bold text-black">
              Customer Delivery Information
            </h2>
            <p className="text-sm text-gray-600">
              {customer.name} ({customer.email})
            </p>
          </div>
          <FaTimes
            className="cursor-pointer text-black hover:text-gray-700"
            onClick={onClose}
          />
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
          ) : deliveryInfo ? (
            <div className="space-y-6">
              {!isEditing ? (
                <>
                  {/* View Mode */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-black flex items-center gap-2">
                        <FaMapMarkerAlt className="w-4 h-4" />
                        Delivery Information
                      </h3>
                      <button
                        onClick={handleEdit}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                      >
                        <FaEdit className="w-3 h-3" />
                        Edit
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <FaUser className="w-4 h-4 text-black" />
                        <div>
                          <span className="font-medium">Name:</span>
                          <p className="text-gray-700">
                            {deliveryInfo.fullName}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <FaPhone className="w-4 h-4 text-black" />
                        <div>
                          <span className="font-medium">Phone:</span>
                          <p className="text-gray-700">
                            {deliveryInfo.phoneNumber}
                          </p>
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <span className="font-medium">Address:</span>
                        <p className="text-gray-700">{deliveryInfo.address}</p>
                      </div>

                      <div>
                        <span className="font-medium">City:</span>
                        <p className="text-gray-700">{deliveryInfo.city}</p>
                      </div>

                      <div>
                        <span className="font-medium">State:</span>
                        <p className="text-gray-700">{deliveryInfo.state}</p>
                      </div>

                      {deliveryInfo.postalCode && (
                        <div>
                          <span className="font-medium">Postal Code:</span>
                          <p className="text-gray-700">
                            {deliveryInfo.postalCode}
                          </p>
                        </div>
                      )}

                      {deliveryInfo.landmark && (
                        <div>
                          <span className="font-medium">Landmark:</span>
                          <p className="text-gray-700">
                            {deliveryInfo.landmark}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t text-xs text-gray-500">
                      <p>
                        Created:{" "}
                        {new Date(deliveryInfo.createdAt).toLocaleDateString()}
                      </p>
                      <p>
                        Updated:{" "}
                        {new Date(deliveryInfo.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Edit Mode */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-black mb-4">
                      Edit Delivery Information
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={editedInfo.fullName || ""}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={editedInfo.phoneNumber || ""}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address *
                        </label>
                        <textarea
                          name="address"
                          value={editedInfo.address || ""}
                          onChange={handleInputChange}
                          rows="3"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
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
                            value={editedInfo.city || ""}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            State *
                          </label>
                          <input
                            type="text"
                            name="state"
                            value={editedInfo.state || ""}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
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
                            value={editedInfo.postalCode || ""}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Landmark
                          </label>
                          <input
                            type="text"
                            name="landmark"
                            value={editedInfo.landmark || ""}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                          />
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <button
                          onClick={handleSave}
                          className="flex-1 bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                        >
                          <FaSave className="w-4 h-4" />
                          Save Changes
                        </button>
                        <button
                          onClick={handleCancel}
                          className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <FaMapMarkerAlt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No Delivery Information
              </h3>
              <p className="text-gray-500">
                This customer hasn't added any delivery information yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
