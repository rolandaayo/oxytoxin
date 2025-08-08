"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  FaUser,
  FaLock,
  FaShoppingBag,
  FaTrash,
  FaCamera,
  FaEdit,
  FaEye,
  FaEyeSlash,
  FaSignOutAlt,
  FaHistory,
} from "react-icons/fa";
import { publicApi, userApi } from "../services/api";

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Profile form states
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Password change states
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Profile picture states
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [uploadingPicture, setUploadingPicture] = useState(false);

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    const token = localStorage.getItem("authToken");
    const userEmail = localStorage.getItem("userEmail");

    if (!token || !userEmail) {
      toast.error("Please login to access your profile");
      router.push("/login");
      return;
    }

    await loadUserData();
    await loadOrders();
  };

  const loadUserData = async () => {
    try {
      setLoading(true);
      const userEmail = localStorage.getItem("userEmail");
      const response = await userApi.getUserProfile(userEmail);
      setUser(response);
      setProfileForm({
        name: response.name || "",
        email: response.email || "",
        address: response.address || "",
        phone: response.phone || "",
      });
      if (response.profilePicture) {
        setProfilePicturePreview(response.profilePicture);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      toast.error("Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      const userEmail = localStorage.getItem("userEmail");
      const response = await userApi.getUserOrders(userEmail);
      setOrders(response);
    } catch (error) {
      console.error("Error loading orders:", error);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      setLoading(true);
      const userEmail = localStorage.getItem("userEmail");
      await userApi.updateUserProfile(userEmail, profileForm);
      toast.success("Profile updated successfully");
      setIsEditingProfile(false);
      await loadUserData();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    try {
      setLoading(true);
      const userEmail = localStorage.getItem("userEmail");
      await userApi.changePassword(userEmail, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success("Password changed successfully");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error(error.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a valid image file (JPEG, PNG, WebP)");
      return;
    }

    setProfilePicture(file);
    setProfilePicturePreview(URL.createObjectURL(file));
  };

  const uploadProfilePicture = async () => {
    if (!profilePicture) return;

    try {
      setUploadingPicture(true);
      const formData = new FormData();
      formData.append("profilePicture", profilePicture);

      const userEmail = localStorage.getItem("userEmail");
      await userApi.uploadProfilePicture(userEmail, formData);
      toast.success("Profile picture updated successfully");
      await loadUserData();
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      toast.error("Failed to upload profile picture");
    } finally {
      setUploadingPicture(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      const userEmail = localStorage.getItem("userEmail");
      await userApi.deleteAccount(userEmail);
      toast.success("Account deleted successfully");
      localStorage.clear();
      router.push("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account");
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully");
    router.push("/");
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: FaUser },
    { id: "security", label: "Security", icon: FaLock },
    { id: "orders", label: "Orders", icon: FaShoppingBag },
    { id: "account", label: "Account", icon: FaTrash },
  ];

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your account and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? "bg-black text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow"
            >
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Profile Information
                    </h2>
                    <button
                      onClick={() => setIsEditingProfile(!isEditingProfile)}
                      className="flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      <FaEdit className="w-4 h-4" />
                      <span>{isEditingProfile ? "Cancel" : "Edit"}</span>
                    </button>
                  </div>

                  {/* Profile Picture Section */}
                  <div className="mb-8">
                    <div className="flex items-center space-x-6">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
                          {profilePicturePreview ? (
                            <img
                              src={profilePicturePreview}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FaUser className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <label className="absolute bottom-0 right-0 bg-black text-white p-2 rounded-full cursor-pointer hover:bg-gray-800 transition-colors">
                          <FaCamera className="w-4 h-4" />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleProfilePictureUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Profile Picture
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          Upload a new profile picture (max 5MB)
                        </p>
                        {profilePicture && (
                          <button
                            onClick={uploadProfilePicture}
                            disabled={uploadingPicture}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                          >
                            {uploadingPicture ? "Uploading..." : "Save Picture"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Profile Form */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            name: e.target.value,
                          })
                        }
                        disabled={!isEditingProfile}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={profileForm.email}
                        disabled
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            phone: e.target.value,
                          })
                        }
                        disabled={!isEditingProfile}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <textarea
                        value={profileForm.address}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            address: e.target.value,
                          })
                        }
                        disabled={!isEditingProfile}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                  </div>

                  {isEditingProfile && (
                    <div className="mt-6 flex space-x-4">
                      <button
                        onClick={handleProfileUpdate}
                        disabled={loading}
                        className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                      >
                        {loading ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        onClick={() => setIsEditingProfile(false)}
                        className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Security Settings
                  </h2>

                  <div className="max-w-md space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.current ? "text" : "password"}
                          value={passwordForm.currentPassword}
                          onChange={(e) =>
                            setPasswordForm({
                              ...passwordForm,
                              currentPassword: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent pr-12"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPasswords({
                              ...showPasswords,
                              current: !showPasswords.current,
                            })
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.new ? "text" : "password"}
                          value={passwordForm.newPassword}
                          onChange={(e) =>
                            setPasswordForm({
                              ...passwordForm,
                              newPassword: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent pr-12"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPasswords({
                              ...showPasswords,
                              new: !showPasswords.new,
                            })
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.confirm ? "text" : "password"}
                          value={passwordForm.confirmPassword}
                          onChange={(e) =>
                            setPasswordForm({
                              ...passwordForm,
                              confirmPassword: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent pr-12"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPasswords({
                              ...showPasswords,
                              confirm: !showPasswords.confirm,
                            })
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handlePasswordChange}
                      disabled={
                        loading ||
                        !passwordForm.currentPassword ||
                        !passwordForm.newPassword ||
                        !passwordForm.confirmPassword
                      }
                      className="w-full bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                      {loading ? "Changing Password..." : "Change Password"}
                    </button>
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === "orders" && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Order History
                  </h2>

                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <FaHistory className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No orders yet
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Start shopping to see your order history here
                      </p>
                      <button
                        onClick={() => router.push("/")}
                        className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        Start Shopping
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map((order) => (
                        <div
                          key={order._id}
                          className="border border-gray-200 rounded-lg p-6"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                Order #{order._id.slice(-8)}
                              </h3>
                              <p className="text-gray-600 text-sm">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-gray-900">
                                ₦{order.totalAmount.toLocaleString()}
                              </p>
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                  order.status === "successful"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {order.status}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-3">
                            {order.items.map((item, index) => (
                              <div
                                key={index}
                                className="flex items-center space-x-4"
                              >
                                <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                                  {item.image && (
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="w-full h-full object-cover"
                                    />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-900">
                                    {item.name}
                                  </h4>
                                  <p className="text-gray-600 text-sm">
                                    Quantity: {item.quantity} × ₦
                                    {item.price.toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {order.paymentRef && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <p className="text-sm text-gray-600">
                                Payment Reference: {order.paymentRef}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Account Tab */}
              {activeTab === "account" && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Account Management
                  </h2>

                  <div className="space-y-8">
                    {/* Logout Section */}
                    <div className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Logout
                          </h3>
                          <p className="text-gray-600 text-sm mt-1">
                            Sign out of your account
                          </p>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <FaSignOutAlt className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>

                    {/* Delete Account Section */}
                    <div className="border border-red-200 rounded-lg p-6 bg-red-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-red-900">
                            Delete Account
                          </h3>
                          <p className="text-red-700 text-sm mt-1">
                            This action cannot be undone. All your data will be
                            permanently deleted.
                          </p>
                        </div>
                        <button
                          onClick={() => setShowDeleteModal(true)}
                          className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <FaTrash className="w-4 h-4" />
                          <span>Delete Account</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Delete Account
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete your account? This action cannot
              be undone and all your data will be permanently lost.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={handleDeleteAccount}
                disabled={loading}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Yes, Delete"}
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
