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
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

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
        console.log("Loading cart from database for:", userEmail);
        const dbCart = await publicApi.getCart(userEmail);
        console.log("Loaded cart from database:", dbCart);

        // Deduplicate cart items by cartItemId
        const uniqueCartItems = dbCart
          ? dbCart.filter(
              (item, index, self) =>
                index ===
                self.findIndex((t) => t.cartItemId === item.cartItemId)
            )
          : [];

        console.log("Deduplicated cart items:", uniqueCartItems);
        setCartItems(uniqueCartItems);
      } catch (error) {
        console.error("Error loading cart:", error);
        toast.error("Failed to load cart items");
      }
    };

    loadCart();
  }, [mounted, isLoggedIn, userEmail]);

  // Save cart to database (only for logged-in users)

  // Listen for login/logout changes
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("authToken");
      const email = localStorage.getItem("userEmail");

      console.log(
        "Storage change detected - Token:",
        token ? "Present" : "Missing"
      );
      console.log("Storage change detected - Email:", email);

      if (token && email) {
        setIsLoggedIn(true);
        setUserEmail(email);
        setShowLoginPrompt(false); // Close login prompt when user logs in
        // Immediately load cart for the logged-in user
        const loadCartForUser = async () => {
          try {
            const dbCart = await publicApi.getCart(email);
            setCartItems(dbCart || []);
          } catch (error) {
            console.error("Error loading cart after login:", error);
          }
        };
        loadCartForUser();
      } else {
        setIsLoggedIn(false);
        setUserEmail("");
        setCartItems([]); // Clear cart when logged out
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Also check login status on mount and when showLoginPrompt changes
  useEffect(() => {
    if (showLoginPrompt) {
      const token = localStorage.getItem("authToken");
      const email = localStorage.getItem("userEmail");

      if (token && email) {
        setIsLoggedIn(true);
        setUserEmail(email);
        setShowLoginPrompt(false); // Close modal if user is already logged in
      }
    }
  }, [showLoginPrompt]);

  const addToCart = async (item) => {
    if (!mounted) return;

    if (!isLoggedIn) {
      // Store current page URL to redirect back after login
      const currentPath = window.location.pathname + window.location.search;
      localStorage.setItem("redirectAfterLogin", currentPath);

      // Show login prompt modal instead of redirecting
      setShowLoginPrompt(true);
      return; // Return early to prevent any further execution
    }

    try {
      console.log("Adding item to cart:", item);
      console.log("Current user email:", userEmail);
      console.log("Current cart items:", cartItems);

      // Get current cart items and add new item
      const updatedCart = [...cartItems, item];
      console.log("Updated cart items:", updatedCart);

      // Save to database first
      const result = await publicApi.updateCart(userEmail, updatedCart);

      if (result.status === "success") {
        // Then update frontend state
        setCartItems(updatedCart);
        toast.success("Item added to cart!", { duration: 2000 });
        console.log("Cart updated successfully in frontend");
      } else {
        console.error("Backend returned error:", result);
        toast.error("Failed to add item to cart");
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast.error("Failed to add item to cart");
    }
  };

  const removeFromCart = async (cartItemId) => {
    if (!mounted || !isLoggedIn || !userEmail) return;

    // Optimistically remove from frontend for snappy UI
    const prevCart = [...cartItems];
    const updatedCart = cartItems.filter(
      (item) => item.cartItemId !== cartItemId
    );
    setCartItems(updatedCart);

    try {
      // Save updated cart to database (hard delete)
      const result = await publicApi.updateCart(userEmail, updatedCart);

      if (result.status === "success") {
        // Confirm frontend state
        setCartItems(updatedCart);
        toast.success("Item removed from cart!");
      } else {
        // Restore previous cart if backend fails
        setCartItems(prevCart);
        toast.error("Failed to remove item from cart");
      }
    } catch (error) {
      setCartItems(prevCart);
      console.error("Error removing item from cart:", error);
      toast.error("Failed to remove item from cart");
    }
  };

  const clearCart = async () => {
    if (!mounted || !isLoggedIn || !userEmail) return;

    try {
      console.log("Clearing cart from database");
      await publicApi.clearCart(userEmail);
      setCartItems([]);
      console.log("Cart cleared successfully");
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error("Failed to clear cart");
    }
  };

  // Force clear cart (for when clearCart doesn't work)
  const forceClearCart = async () => {
    if (!mounted || !isLoggedIn || !userEmail) return;

    try {
      console.log("Force clearing cart from database");
      // First clear from database
      await publicApi.clearCart(userEmail);
      // Then set empty array in frontend
      setCartItems([]);
      console.log("Cart force cleared successfully");
    } catch (error) {
      console.error("Error force clearing cart:", error);
      // Even if database fails, clear frontend
      setCartItems([]);
    }
  };

  const updateCartItemQuantity = async (cartItemId, newQuantity) => {
    if (!mounted || !isLoggedIn || !userEmail) return;

    if (newQuantity <= 0) {
      await removeFromCart(cartItemId);
      return;
    }

    try {
      console.log("Updating item quantity:", cartItemId, "to", newQuantity);

      // Call backend API to update item
      const result = await publicApi.updateCartItem(
        userEmail,
        cartItemId,
        newQuantity
      );

      if (result.status === "success") {
        // Update frontend state with the updated cart from backend
        setCartItems(result.data || []);
        console.log("Item quantity updated successfully in database");
      } else {
        console.error("Failed to update item quantity:", result.message);
        toast.error("Failed to update item quantity");
      }
    } catch (error) {
      console.error("Error updating item quantity:", error);
      toast.error("Failed to update item quantity");
    }
  };

  const handleLoginClick = () => {
    setShowLoginPrompt(false);
    window.location.href = "/login";
  };

  const handleSignupClick = () => {
    setShowLoginPrompt(false);
    window.location.href = "/signup";
  };

  const handleCloseLoginPrompt = () => {
    setShowLoginPrompt(false);
  };

  // Function to manually trigger cart loading (can be called from login page)
  const loadUserCart = async (email) => {
    if (!email) return;

    try {
      console.log("Manually loading cart for:", email);
      const dbCart = await publicApi.getCart(email);
      console.log("Manually loaded cart from database:", dbCart);

      // Deduplicate cart items by cartItemId
      const uniqueCartItems = dbCart
        ? dbCart.filter(
            (item, index, self) =>
              index === self.findIndex((t) => t.cartItemId === item.cartItemId)
          )
        : [];

      console.log("Setting cart items to:", uniqueCartItems);
      setCartItems(uniqueCartItems);
    } catch (error) {
      console.error("Error manually loading cart:", error);
    }
  };

  // Function to refresh cart (useful after login/signup)
  const refreshCart = async () => {
    if (!userEmail) {
      console.log("No user email available for cart refresh");
      return;
    }

    console.log("Refreshing cart for:", userEmail);
    await loadUserCart(userEmail);
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

    // Check if PaystackPop is available
    if (typeof window !== "undefined" && !window.PaystackPop) {
      toast.error("Payment system is loading. Please try again in a moment.");
      return;
    }

    // Add a small delay to ensure PaystackPop is fully initialized
    await new Promise((resolve) => setTimeout(resolve, 100));

    setLoading(true);
    let createdOrder = null;
    try {
      // For now, skip backend order creation to test payment
      const userEmail = localStorage.getItem("userEmail") || "";

      console.log("Proceeding with payment for:", {
        userEmail,
        items: cartItems,
        totalAmount,
      });

      // Comment out backend order creation for now
      // createdOrder = await publicApi.createOrder({
      //   userEmail,
      //   items: cartItems.map((item) => ({
      //     productId: item.id,
      //     name: item.name,
      //     image: item.mainImage || item.image,
      //     price: item.price,
      //     quantity: item.quantity || 1,
      //   })),
      //   totalAmount,
      // });

      console.log("Payment proceeding without backend order creation");

      // Validate email before proceeding
      if (!userEmail || !userEmail.includes("@")) {
        toast.error(
          "Please log in with a valid email address to proceed with payment.",
          {
            icon: "⚠️",
            duration: 3000,
          }
        );
        return;
      }

      console.log("Setting up Paystack with email:", userEmail);

      const handler = window.PaystackPop.setup({
        key: "pk_live_e800a07fd891e2e418e93c56e409efede3a9ad35",
        email: userEmail || "customer@oxytoxin.com", // Fallback email
        amount: totalAmount * 100,
        currency: "NGN",
        ref: "" + Math.floor(Math.random() * 1000000000 + 1),
        callback: function (response) {
          toast.success(`Payment complete! Reference: ${response.reference}`, {
            icon: "✅",
            duration: 3000,
          });
          // Mark order as successful in backend
          if (createdOrder && createdOrder._id) {
            adminApi
              .updateOrderStatus(
                createdOrder._id,
                "successful",
                response.reference
              )
              .catch((error) => {
                console.error("Error updating order status:", error);
              });
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
      console.error("Error message:", error.message);
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
        forceClearCart,
        updateCartItemQuantity,
        loadUserCart,
        refreshCart,
        totalAmount,
        loading,
        setLoading,
        initializePayment,
        isLoggedIn,
        userEmail,
        showLoginPrompt,
        setShowLoginPrompt,
        handleLoginClick,
        handleSignupClick,
        handleCloseLoginPrompt,
      }}
    >
      {children}

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Login Required
              </h3>
              <p className="text-gray-600 mb-6">
                Please log in to add items to your cart and continue shopping.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleLoginClick}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={handleSignupClick}
                  className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                  Sign Up
                </button>
              </div>
              <button
                onClick={handleCloseLoginPrompt}
                className="mt-4 text-gray-500 hover:text-gray-700 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
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
