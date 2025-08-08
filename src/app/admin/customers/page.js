"use client";
import { useState, useEffect } from "react";
import { adminApi } from "../../services/api";
import { format } from "date-fns";
import Image from "next/image";

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
  });
  const [editModal, setEditModal] = useState({ open: false, customer: null });
  const [deleteConfirm, setDeleteConfirm] = useState({
    open: false,
    customer: null,
  });
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [isDeletingCustomer, setIsDeletingCustomer] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const users = await adminApi.getUsers();
        // Map backend users to customer table format
        setCustomers(
          users.map((u) => ({
            id: u._id,
            name: u.name,
            email: u.email,
            address: u.address || "No address provided",
            avatar:
              u.avatar || "https://randomuser.me/api/portraits/lego/1.jpg",
            status: "Active",
            joined: u.createdAt ? u.createdAt.slice(0, 10) : "",
            lastLogin: u.lastLogin,
            loginHistory: u.loginHistory,
          }))
        );
      } catch (err) {
        // Optionally show a toast or fallback
      }
    }
    fetchUsers();
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    setIsAddingCustomer(true);
    try {
      await adminApi.createUser({
        name: newCustomer.name,
        email: newCustomer.email,
        address: newCustomer.address,
        password: newCustomer.password,
      });
      await refreshUsers();
      setShowModal(false);
      setNewCustomer({ name: "", email: "", address: "", password: "" });
    } catch (err) {
      alert("Failed to add user");
    } finally {
      setIsAddingCustomer(false);
    }
  };

  // Add a function to refresh users from the backend
  const refreshUsers = async () => {
    try {
      const users = await adminApi.getUsers();
      setCustomers(
        users.map((u) => ({
          id: u._id,
          name: u.name,
          email: u.email,
          address: u.address || "No address provided",
          avatar: u.avatar || "https://randomuser.me/api/portraits/lego/1.jpg",
          status: "Active",
          joined: u.createdAt ? u.createdAt.slice(0, 10) : "",
        }))
      );
    } catch (err) {}
  };

  // Update handleRemoveCustomer to show confirmation
  const handleRemoveCustomer = (customer) => {
    setDeleteConfirm({ open: true, customer });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.customer) return;
    setIsDeletingCustomer(true);
    try {
      await adminApi.deleteUser(deleteConfirm.customer.id);
      await refreshUsers();
      setDeleteConfirm({ open: false, customer: null });
    } catch (err) {
      alert("Failed to delete user");
    } finally {
      setIsDeletingCustomer(false);
    }
  };

  // Show edit modal
  const handleEditCustomer = (customer) => {
    setEditModal({ open: true, customer });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const { customer } = editModal;
    try {
      await adminApi.updateUser(customer.id, {
        name: customer.name,
        email: customer.email,
        address: customer.address,
      });
      await refreshUsers();
      setEditModal({ open: false, customer: null });
    } catch (err) {
      alert("Failed to update user");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-2 text-gray-900">Customers</h1>
      <p className="mb-6 text-gray-600 text-lg">
        Manage your store&apos;s customers
      </p>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <input
          type="text"
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-72 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
        />
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition"
          onClick={() => setShowModal(true)}
        >
          Add Customer
        </button>
      </div>
      <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200 w-full">
        <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Login
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Logins
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                  No customers found.
                </td>
              </tr>
            ) : (
              filtered.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
                    <Image
                      src={customer.avatar}
                      alt={customer.name}
                      className="w-10 h-10 rounded-full object-cover border"
                    />
                    <span className="font-medium text-gray-900">
                      {customer.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {customer.email}
                  </td>
                  <td
                    className="px-6 py-4 text-gray-700 max-w-xs truncate"
                    title={customer.address}
                  >
                    {customer.address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        customer.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {customer.lastLogin
                      ? format(
                          new Date(customer.lastLogin),
                          "MMM dd, yyyy HH:mm"
                        )
                      : "Never"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {customer.loginHistory ? customer.loginHistory.length : 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {customer.joined}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                    <button
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-xs font-medium"
                      onClick={() => handleEditCustomer(customer)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-xs font-medium"
                      onClick={() => handleRemoveCustomer(customer)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Modal for adding customer */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-black">
              Add New Customer
            </h2>
            <form onSubmit={handleAddCustomer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={newCustomer.name}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  value={newCustomer.address}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, address: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 resize-none"
                  placeholder="Enter customer address"
                  rows="3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={newCustomer.password}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, password: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isAddingCustomer}
                  className={`px-4 py-2 rounded-lg font-semibold shadow transition ${
                    isAddingCustomer
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {isAddingCustomer ? "Adding..." : "Add Customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Edit Customer Modal */}
      {editModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setEditModal({ open: false, customer: null })}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Edit Customer</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={editModal.customer.name}
                  onChange={(e) =>
                    setEditModal({
                      ...editModal,
                      customer: { ...editModal.customer, name: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={editModal.customer.email}
                  onChange={(e) =>
                    setEditModal({
                      ...editModal,
                      customer: {
                        ...editModal.customer,
                        email: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  value={editModal.customer.address || ""}
                  onChange={(e) =>
                    setEditModal({
                      ...editModal,
                      customer: {
                        ...editModal.customer,
                        address: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black resize-none"
                  placeholder="Enter customer address"
                  rows="3"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {deleteConfirm.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setDeleteConfirm({ open: false, customer: null })}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-red-600">
              Confirm Delete
            </h2>
            <p className="mb-6 text-gray-700">
              Are you sure you want to remove{" "}
              <span className="font-semibold">
                {deleteConfirm.customer?.name}
              </span>
              ?
            </p>
            <div className="flex justify-end gap-2">
              <button
                disabled={isDeletingCustomer}
                className={`px-4 py-2 rounded-lg font-semibold shadow transition ${
                  isDeletingCustomer
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                onClick={() =>
                  setDeleteConfirm({ open: false, customer: null })
                }
              >
                Cancel
              </button>
              <button
                disabled={isDeletingCustomer}
                className={`px-4 py-2 rounded-lg font-semibold shadow transition ${
                  isDeletingCustomer
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
                onClick={confirmDelete}
              >
                {isDeletingCustomer ? "Removing..." : "Yes, Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
