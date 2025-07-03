"use client";

import { Toaster } from "react-hot-toast";
import Link from "next/link";
import { Poppins } from "next/font/google";
import { usePathname } from "next/navigation";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const menu = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: (
      <svg
        width="22"
        height="22"
        fill="none"
        viewBox="0 0 24 24"
        className="mr-3"
      >
        <path
          d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    label: "Products",
    href: "/admin",
    icon: (
      <svg
        width="22"
        height="22"
        fill="none"
        viewBox="0 0 24 24"
        className="mr-3"
      >
        <path
          d="M21 16V8a2 2 0 0 0-2-2h-2V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2v2a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-2h2a2 2 0 0 0 2-2zm-8 4H9v-2h6v2zm6-4h-2v-2H5v2H3V8h2v2h14V8h2v8z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    label: "Users",
    icon: (
      <svg
        width="22"
        height="22"
        fill="none"
        viewBox="0 0 24 24"
        className="mr-3"
      >
        <path
          d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05C17.16 14.1 19 15.03 19 16.5V19h5v-2.5c0-2.33-4.67-3.5-7-3.5z"
          fill="currentColor"
        />
      </svg>
    ),
    sub: [{ label: "All Users", href: "/admin/users" }],
  },
  {
    label: "Orders",
    icon: (
      <svg
        width="22"
        height="22"
        fill="none"
        viewBox="0 0 24 24"
        className="mr-3"
      >
        <path
          d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-7-3c-2.21 0-4-1.79-4-4h2a2 2 0 0 0 4 0h2c0 2.21-1.79 4-4 4z"
          fill="currentColor"
        />
      </svg>
    ),
    sub: [{ label: "All Orders", href: "/admin/orders" }],
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: (
      <svg
        width="22"
        height="22"
        fill="none"
        viewBox="0 0 24 24"
        className="mr-3"
      >
        <path
          d="M19.14 12.94c.04-.31.06-.63.06-.94s-.02-.63-.06-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.61-.22l-2.39.96a7.007 7.007 0 0 0-1.62-.94l-.36-2.53A.486.486 0 0 0 14 2h-4a.486.486 0 0 0-.5.41l-.36 2.53c-.59.22-1.14.52-1.62.94l-2.39-.96a.5.5 0 0 0-.61.22l-1.92 3.32a.5.5 0 0 0 .12.64l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58a.5.5 0 0 0-.12.64l1.92 3.32c.14.24.44.32.68.22l2.39-.96c.48.42 1.03.77 1.62.94l.36 2.53c.05.29.29.41.5.41h4c.21 0 .45-.12.5-.41l.36-2.53c.59-.17 1.14-.52 1.62-.94l2.39.96c.24.1.54.02.68-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.58zM12 15.5A3.5 3.5 0 1 1 12 8.5a3.5 3.5 0 0 1 0 7z"
          fill="#9CA3AF"
        />
      </svg>
    ),
  },
];

function Sidebar({ pathname }) {
  return (
    <aside className="w-64 bg-white text-black flex flex-col py-8 px-4 min-h-screen border-r border-gray-200">
      {/* Menu */}
      <nav className="flex flex-col gap-1">
        {menu.map((item, idx) => (
          <div key={item.label}>
            <Link
              href={item.href || "#"}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors text-base font-medium ${
                pathname.startsWith(item.href || "")
                  ? "bg-gray-100 text-black font-semibold"
                  : "hover:bg-gray-100"
              }`}
            >
              <span className="mr-3 text-gray-500">{item.icon}</span>
              {item.label}
              {item.sub && (
                <svg
                  className="ml-auto w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              )}
            </Link>
          </div>
        ))}
      </nav>
    </aside>
  );
}

function AdminNavbar() {
  return (
    <div className="sticky top-0 z-30 w-full bg-white flex items-center justify-between px-8 py-4 shadow rounded-b-xl">
      {/* Search box */}
      <div className="flex-1 flex items-center max-w-md">
        <input
          type="text"
          placeholder="Search with keyword"
          className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-700 placeholder-gray-400"
        />
      </div>
      <div className="flex items-center gap-6 ml-8">
        {/* Settings icon */}
        <button className="p-2 rounded-full hover:bg-gray-100">
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
            <path
              d="M19.14 12.94c.04-.31.06-.63.06-.94s-.02-.63-.06-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.61-.22l-2.39.96a7.007 7.007 0 0 0-1.62-.94l-.36-2.53A.486.486 0 0 0 14 2h-4a.486.486 0 0 0-.5.41l-.36 2.53c-.59.22-1.14.52-1.62.94l-2.39-.96a.5.5 0 0 0-.61.22l-1.92 3.32a.5.5 0 0 0 .12.64l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58a.5.5 0 0 0-.12.64l1.92 3.32c.14.24.44.32.68.22l2.39-.96c.48.42 1.03.77 1.62.94l.36 2.53c.05.29.29.41.5.41h4c.21 0 .45-.12.5-.41l.36-2.53c.59-.17 1.14-.52 1.62-.94l2.39.96c.24.1.54.02.68-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.58zM12 15.5A3.5 3.5 0 1 1 12 8.5a3.5 3.5 0 0 1 0 7z"
              fill="#9CA3AF"
            />
          </svg>
        </button>
        {/* Notification icon */}
        <button className="p-2 rounded-full hover:bg-gray-100">
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
            <path
              d="M18 16v-5a6 6 0 1 0-12 0v5l-2 2v1h16v-1l-2-2zm-6 5a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2z"
              fill="#9CA3AF"
            />
          </svg>
        </button>
        {/* Super Admin box */}
        <div className="flex items-center bg-orange-50 border border-orange-200 rounded-lg px-4 py-2 gap-3">
          <span className="font-medium text-gray-800">Super Admin</span>
          <span className="w-8 h-8 rounded-full bg-orange-200 flex items-center justify-center">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="4" fill="#F59E42" />
              <path
                d="M4 20c0-2.21 3.58-4 8-4s8 1.79 8 4v1H4v-1z"
                fill="#F59E42"
              />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }) {
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "";
  return (
    <div className={`min-h-screen ${poppins.className} bg-gray-50`}>
      <AdminNavbar />
      <div className="flex">
        <Sidebar pathname={pathname} />
        {/* Main Content */}
        <main className="flex-1 p-8 overflow-auto">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#363636",
                color: "#fff",
              },
              success: {
                duration: 3000,
                theme: {
                  primary: "#4aed88",
                },
              },
              error: {
                duration: 4000,
                theme: {
                  primary: "#ff4b4b",
                },
              },
            }}
          />
          {children}
        </main>
      </div>
    </div>
  );
}
