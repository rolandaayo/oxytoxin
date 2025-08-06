"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa";

export default function VerifyEmail() {
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        setMessage("No verification token provided");
        return;
      }

      try {
        const response = await fetch(
          `https://oxytoxin-backend.vercel.app/api/auth/verify-email/${token}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const result = await response.json();

        if (result.status === "success") {
          setStatus("success");
          setMessage(result.message);
          toast.success("Email verified successfully!", { duration: 5000 });
        } else {
          setStatus("error");
          setMessage(result.message || "Verification failed");
          toast.error(result.message || "Verification failed", {
            duration: 5000,
          });
        }
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("error");
        setMessage("An error occurred during verification. Please try again.");
        toast.error("Verification failed. Please try again.", {
          duration: 5000,
        });
      }
    };

    verifyEmail();
  }, [token]);

  const handleLogin = () => {
    router.push("/login");
  };

  const handleResend = async () => {
    // This would need the user's email, which we don't have in this context
    // You might want to redirect to a resend page or show a form
    router.push("/login?resend=true");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          {status === "loading" && (
            <>
              <FaSpinner className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-spin" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Verifying Email
              </h1>
              <p className="text-gray-600">
                Please wait while we verify your email address...
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <FaCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Email Verified!
              </h1>
              <p className="text-gray-600 mb-6">{message}</p>
              <button
                onClick={handleLogin}
                className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors font-semibold"
              >
                Continue to Login
              </button>
            </>
          )}

          {status === "error" && (
            <>
              <FaTimesCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Verification Failed
              </h1>
              <p className="text-gray-600 mb-6">{message}</p>
              <div className="space-y-3">
                <button
                  onClick={handleResend}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Resend Verification Email
                </button>
                <button
                  onClick={handleLogin}
                  className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors font-semibold"
                >
                  Go to Login
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
