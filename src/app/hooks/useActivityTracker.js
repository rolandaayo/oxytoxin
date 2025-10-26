import { useEffect, useRef, useCallback } from "react";
import { toast } from "react-hot-toast";

const INACTIVITY_TIMEOUT = 20 * 60 * 1000; // 20 minutes in milliseconds
const WARNING_TIME = 2 * 60 * 1000; // Show warning 2 minutes before logout

export const useActivityTracker = () => {
  const timeoutRef = useRef(null);
  const warningTimeoutRef = useRef(null);
  const lastActivityRef = useRef(Date.now());
  const warningShownRef = useRef(false);

  const logout = useCallback(() => {
    // Clear all auth data
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");

    // Show logout message
    toast.error(
      "You have been logged out due to inactivity. Please log in again.",
      {
        duration: 5000,
        position: "top-center",
      }
    );

    // Redirect to login page
    window.location.href = "/login";
  }, []);

  const showWarning = useCallback(() => {
    if (!warningShownRef.current) {
      warningShownRef.current = true;
      toast(
        "You will be logged out in 2 minutes due to inactivity. Move your mouse or click anywhere to stay logged in.",
        {
          duration: 4000,
          position: "top-center",
          icon: "⚠️",
        }
      );
    }
  }, []);

  const resetTimer = useCallback(() => {
    const now = Date.now();
    lastActivityRef.current = now;
    warningShownRef.current = false;

    // Clear existing timers
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }

    // Set warning timer (show warning 2 minutes before logout)
    warningTimeoutRef.current = setTimeout(() => {
      showWarning();
    }, INACTIVITY_TIMEOUT - WARNING_TIME);

    // Set logout timer
    timeoutRef.current = setTimeout(() => {
      logout();
    }, INACTIVITY_TIMEOUT);
  }, [logout, showWarning]);

  const handleActivity = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  useEffect(() => {
    // Only track activity if user is logged in
    const token = localStorage.getItem("authToken");
    if (!token) {
      return;
    }

    // Events that indicate user activity
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    // Add event listeners
    events.forEach((event) => {
      document.addEventListener(event, handleActivity, true);
    });

    // Start the timer
    resetTimer();

    // Cleanup function
    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity, true);
      });

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
    };
  }, [handleActivity, resetTimer]);

  // Return methods for manual control if needed
  return {
    resetTimer,
    logout,
  };
};
