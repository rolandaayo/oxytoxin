"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaSpinner, FaArrowLeft } from "react-icons/fa";
import Image from "next/image";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    if (!email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        "https://oxytoxin-backend.vercel.app/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const result = await response.json();

      if (result.status === "success") {
        setIsSubmitted(true);
        toast.success(result.message, { duration: 5000 });
        // Store email for the next step
        localStorage.setItem("pendingResetEmail", email);
      } else {
        toast.error(result.message || "Failed to send reset code", {
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error("An error occurred. Please try again.", { duration: 5000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className={`min-h-screen flex items-center justify-center bg-gray-50 px-2 ${poppins.className}`}>
        <div className="flex flex-col md:flex-row shadow-lg overflow-hidden w-full max-w-3xl items-stretch">
          <div className="md:w-1/2 w-full p-6 md:p-8 flex flex-col justify-center items-center bg-white min-h-[400px]">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Check Your Email
              </h1>
              <p className="text-gray-600 mb-6">
                We&apos;ve sent a 6-digit verification code to{" "}
                <strong>{email}</strong>. Please check your inbox and enter the
                code to reset your password.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() =>
                    router.push(`/reset-password-code?email=${email}`)
                  }
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition"
                >
                  Enter Verification Code
                </button>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="w-full py-2 px-4 bg-gray-600 text-white rounded-md font-semibold hover:bg-gray-700 transition"
                >
                  Send Another Code
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-gray-50 px-2 ${poppins.className}`}
    >
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-center text-blue-700 mb-2">
            Welcome to Oxytoxin
          </h2>
          <h1 className="text-2xl font-bold mb-6 text-gray-900">
            Forgot Password
          </h1>
          <p className="text-gray-600 mb-6 text-center">
            Enter your email address and we&apos;ll send you a 6-digit code to
            reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 w-full">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              placeholder="Enter your email address"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <FaSpinner className="animate-spin mr-2" />
                Sending Reset Code...
              </div>
            ) : (
              "Send Reset Code"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push("/login")}
            className="flex items-center justify-center mx-auto text-gray-600 hover:text-gray-800 text-sm"
          >
            <FaArrowLeft className="mr-2" />
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
