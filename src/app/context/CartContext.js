"use client";
import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { publicApi, adminApi } from "../services/api";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [mounted, setMounted] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  // Handle client-side mounting and check login status
  useEffect(() => {
    setMounted(true);
    try {
      const token = localStorage.getItem("authToken");
      const email = localStorage.getItem("userEmail");

      if (token && email) {
        setIsLoggedIn(true);
        setUserEmail(email);
      } else {
        setIsLoggedIn(false);
        setUserEmail("");
      }
    } catch (error) {
      console.error("Error checking login status:", error);
    }
  }, []);

  // Load cart items on mount (only for logged-in users)
  useEffect(() => {
    if (!mounted || !isLoggedIn || !userEmail) return;

    const loadCart = async () => {
      try {
        const dbCart = await publicApi.getCart(userEmail);
        setCartItems(dbCart || []);
      } catch (error) {
        console.error("Error loading cart:", error);
        toast.error("Failed to load cart items");
      }
    };

    loadCart();
  }, [mounted, isLoggedIn, userEmail]);

  // Save cart to database (only for logged-in users)
  useEffect(() => {
    if (!mounted || !isLoggedIn || !userEmail) return;

    const saveCart = async () => {
      try {
        await publicApi.updateCart(userEmail, cartItems);
      } catch (error) {
        console.error("Error saving cart:", error);
        toast.error("Failed to save cart items");
      }
    };

    saveCart();
  }, [cartItems, mounted, isLoggedIn, userEmail]);

  // Listen for login/logout changes
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("authToken");
      const email = localStorage.getItem("userEmail");

      if (token && email) {
        setIsLoggedIn(true);
        setUserEmail(email);
      } else {
        setIsLoggedIn(false);
        setUserEmail("");
        setCartItems([]); // Clear cart when logged out
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const addToCart = (item) => {
    if (!mounted) return;

    if (!isLoggedIn) {
      // Store current page URL to redirect back after login
      const currentPath = window.location.pathname + window.location.search;
      localStorage.setItem("redirectAfterLogin", currentPath);

      toast.error("Please log in to add items to cart", {
        duration: 3000,
      });

      // Redirect to login page
      window.location.href = "/login";
      return;
    }

    setCartItems((prev) => {
      const newItems = [...prev, item];
      return newItems;
    });

    toast.success("Item added to cart!", {
      duration: 2000,
    });
  };

  const removeFromCart = (itemId) => {
    if (!mounted) return;
    setCartItems((prev) => {
      const newItems = prev.filter((item) => item.id !== itemId);
      return newItems;
    });
  };

  const clearCart = async () => {
    if (!mounted || !isLoggedIn || !userEmail) return;

    try {
      await publicApi.clearCart(userEmail);
      setCartItems([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error("Failed to clear cart");
    }
  };

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0
  );

  const clearStoredData = (paymentReference) => {
    // Create order data before clearing cart
    const orderData = {
      id: Date.now(),
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

  const initializePayment = async () => {
    // Check for auth token
    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    if (!token) {
      toast.error("You must be logged in to proceed to payment.");
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return;
    }
    setLoading(true);
    let createdOrder = null;
    try {
      // Create pending order in backend
      const userEmail = localStorage.getItem("userEmail") || "";
      createdOrder = await publicApi.createOrder({
        userEmail,
        items: cartItems.map((item) => ({
          productId: item.id,
          name: item.name,
          image: item.mainImage || item.image,
          price: item.price,
          quantity: item.quantity || 1,
        })),
        totalAmount,
      });
      const handler = PaystackPop.setup({
        key: "pk_live_e800a07fd891e2e418e93c56e409efede3a9ad35",
        email: userEmail,
        amount: totalAmount * 100,
        currency: "NGN",
        ref: "" + Math.floor(Math.random() * 1000000000 + 1),
        callback: async function (response) {
          toast.success(`Payment complete! Reference: ${response.reference}`, {
            icon: "✅",
            duration: 3000,
          });
          // Mark order as successful in backend
          if (createdOrder && createdOrder._id) {
            await adminApi.updateOrderStatus(
              createdOrder._id,
              "successful",
              response.reference
            );
          }
          clearStoredData(response.reference);
        },
        onClose: function () {
          toast.error("Transaction was not completed", {
            icon: "❌",
            duration: 3000,
          });
        },
      });
      handler.openIframe();
    } catch (error) {
      console.error("Payment initialization failed:", error);
      toast.error("Payment initialization failed. Please try again.", {
        icon: "⚠️",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        showCart,
        setShowCart,
        addToCart,
        removeFromCart,
        clearCart,
        totalAmount,
        loading,
        setLoading,
        initializePayment,
        isLoggedIn,
        userEmail,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
