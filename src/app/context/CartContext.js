"use client";
import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [mounted, setMounted] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
    try {
      const savedCart = localStorage.getItem("cartItems");
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Error loading cart:", error);
    }
  }, []);

  // Save cart to localStorage only after mounting
  useEffect(() => {
    if (!mounted) return;
    try {
      if (cartItems.length > 0) {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
      } else {
        localStorage.removeItem("cartItems");
      }
    } catch (error) {
      console.error("Error saving cart:", error);
    }
  }, [cartItems, mounted]);

  const addToCart = (item) => {
    if (!mounted) return;
    setCartItems((prev) => {
      const newItems = [...prev, item];
      try {
        localStorage.setItem("cartItems", JSON.stringify(newItems));
      } catch (error) {
        console.error("Error saving cart:", error);
      }
      return newItems;
    });
  };

  const removeFromCart = (itemId) => {
    if (!mounted) return;
    setCartItems((prev) => {
      const newItems = prev.filter((item) => item.id !== itemId);
      try {
        localStorage.setItem("cartItems", JSON.stringify(newItems));
      } catch (error) {
        console.error("Error saving cart:", error);
      }
      return newItems;
    });
  };

  const clearCart = () => {
    if (!mounted) return;
    setCartItems([]);
    try {
      localStorage.removeItem("cartItems");
    } catch (error) {
      console.error("Error clearing cart:", error);
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
    setLoading(true);
    try {
      const handler = PaystackPop.setup({
        key: "pk_live_e800a07fd891e2e418e93c56e409efede3a9ad35",
        // email: "customer@email.com",
        amount: totalAmount * 100,
        currency: "NGN",
        ref: "" + Math.floor(Math.random() * 1000000000 + 1),
        callback: function (response) {
          toast.success(`Payment complete! Reference: ${response.reference}`, {
            icon: "✅",
            duration: 3000,
          });
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
