"use client";

import { Toaster } from "react-hot-toast";
import { CartProvider } from "../context/CartContext";
import ActivityTracker from "./ActivityTracker";
import ChatWidget from "./ChatWidget";

export default function ClientLayout({ children }) {
  return (
    <CartProvider>
      <ActivityTracker>
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
        <ChatWidget />
      </ActivityTracker>
    </CartProvider>
  );
}
