"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash, FaSpinner, FaArrowLeft } from "react-icons/fa";
import Image from "next/image";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

function ResetPasswordCodeContent() {
  const [formData, setFormData] = useState({
    code: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get email from URL params or localStorage
  const emailFromParams = searchParams.get("email");
  const emailFromStorage = localStorage.getItem("pendingResetEmail");

  if (!email && emailFromParams) {
    setEmail(emailFromParams);
    localStorage.setItem("pendingResetEmail", emailFromParams);
  } else if (!email && emailFromStorage) {
    setEmail(emailFromStorage);
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "code") {
      // Only allow numbers and limit to 6 digits
      const numericValue = value.replace(/\D/g, "").slice(0, 6);
      setFormData((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email not found. Please request a password reset again.");
      router.push("/forgot-password");
      return;
    }

    if (formData.code.length !== 6) {
      toast.error("Please enter a 6-digit verification code");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        "https://oxytoxin-backend.vercel.app/api/auth/reset-password-code",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            code: formData.code,
            newPassword: formData.newPassword,
            confirmPassword: formData.confirmPassword,
          }),
        }
      );

      const result = await response.json();

      if (result.status === "success") {
        toast.success(result.message, { duration: 5000 });
        localStorage.removeItem("pendingResetEmail");
        router.push("/login");
      } else {
        toast.error(result.message || "Password reset failed", {
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error("An error occurred. Please try again.", { duration: 5000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!email) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center bg-gray-50 px-2 ${poppins.className}`}
      >
        <div className="flex flex-col md:flex-row shadow-lg overflow-hidden w-full max-w-3xl items-stretch">
          <div className="md:w-1/2 w-full p-6 md:p-8 flex flex-col justify-center items-center bg-white min-h-[400px]">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Invalid Reset Link
              </h1>
              <p className="text-gray-600 mb-6">
                This password reset link is invalid or has expired.
              </p>
              <button
                onClick={() => router.push("/forgot-password")}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition"
              >
                Request New Reset
              </button>
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
      <div className="flex flex-col md:flex-row shadow-lg overflow-hidden w-full max-w-3xl items-stretch">
        {/* Image Section */}
        <div className="hidden md:flex md:w-1/2 w-full flex-shrink-0 items-stretch">
          <Image
            src="/images/welcome.JPG"
            alt="Welcome"
            width={400}
            height={400}
            className="object-cover w-full h-full"
            style={{ height: "100%" }}
            priority
          />
        </div>
        {/* Form Section */}
        <div className="md:w-1/2 w-full p-6 md:p-8 flex flex-col justify-center items-center bg-white min-h-[400px]">
          <h2 className="text-xl md:text-2xl font-bold text-center text-blue-700 mb-2">
            Welcome to Oxytoxin
          </h2>
          <h1 className="text-2xl font-bold mb-6 text-gray-900">
            Reset Your Password
          </h1>
          <p className="text-gray-600 mb-6 text-center">
            Enter the 6-digit code sent to <strong>{email}</strong>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5 w-full">
            <div>
              <label
                htmlFor="code"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Verification Code
              </label>
              <input
                type="text"
                id="code"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                required
                maxLength={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black text-center text-xl font-mono tracking-widest"
                placeholder="000000"
                autoComplete="one-time-code"
              />
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  required
                  minLength={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black pr-16"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-blue-600 focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  minLength={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black pr-16"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-blue-600 focus:outline-none"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || formData.code.length !== 6}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <FaSpinner className="animate-spin mr-2" />
                  Resetting Password...
                </div>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => router.push("/forgot-password")}
              className="flex items-center justify-center mx-auto text-gray-600 hover:text-gray-800 text-sm"
            >
              <FaArrowLeft className="mr-2" />
              Back to Forgot Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordCode() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      }
    >
      <ResetPasswordCodeContent />
    </Suspense>
  );
}
