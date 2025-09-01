"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { FaSpinner, FaArrowLeft } from "react-icons/fa";
import Image from "next/image";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

function VerifyCodeContent() {
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get email from URL params or localStorage
    const emailFromParams = searchParams.get("email");
    const emailFromStorage = localStorage.getItem("pendingVerificationEmail");

    if (emailFromParams) {
      setEmail(emailFromParams);
      localStorage.setItem("pendingVerificationEmail", emailFromParams);
    } else if (emailFromStorage) {
      setEmail(emailFromStorage);
    } else {
      // No email found, redirect to signup
      router.push("/signup");
    }
  }, [searchParams, router]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setCode(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email not found. Please sign up again.");
      router.push("/signup");
      return;
    }

    if (code.length !== 6) {
      toast.error("Please enter a 6-digit verification code");
      return;
    }

    if (!/^\d{6}$/.test(code)) {
      toast.error("Verification code must contain only numbers");
      return;
    }

    setIsSubmitting(true);

    try {
      const BACKEND_URL =
        process.env.NEXT_PUBLIC_BACKEND_URL ||
        "https://oxytoxin-backend.vercel.app";
      const response = await fetch(
        `${BACKEND_URL}/api/auth/verify-email-code`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.toLowerCase(),
            code: code.trim(),
          }),
        }
      );

      const result = await response.json();

      if (result.status === "success") {
        toast.success(
          result.message ||
            "Welcome to Oxytoxin! Your account has been successfully created and verified.",
          { duration: 5000 }
        );
        localStorage.removeItem("pendingVerificationEmail");

        // If we get a token, store it and the user data (auto-login)
        if (result.token && result.user) {
          localStorage.setItem("authToken", result.token);
          localStorage.setItem("userEmail", result.user.email);
          localStorage.setItem("userName", result.user.name);

          // Show success message and redirect to home page
          setTimeout(() => {
            router.push("/");
          }, 2000);
        } else {
          // Fallback to login page if no token provided
          setTimeout(() => {
            router.push("/login");
          }, 2000);
        }
      } else {
        toast.error(result.message || "Verification failed", {
          duration: 5000,
        });

        // If code is invalid/expired, offer to resend
        if (
          result.message &&
          (result.message.includes("Invalid") ||
            result.message.includes("expired"))
        ) {
          setTimeout(() => {
            toast(
              (t) => (
                <div className="flex flex-col space-y-2">
                  <span>Code expired or invalid?</span>
                  <button
                    onClick={() => {
                      handleResendCode();
                      toast.dismiss(t.id);
                    }}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                  >
                    Resend Code
                  </button>
                </div>
              ),
              { duration: 8000 }
            );
          }, 1000);
        }
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("An error occurred. Please try again.", { duration: 5000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      toast.error("Email not found. Please sign up again.");
      router.push("/signup");
      return;
    }

    setIsResending(true);

    try {
      const BACKEND_URL =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
      const response = await fetch(
        `${BACKEND_URL}/api/auth/resend-verification-code`,
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
        toast.success("Verification code sent successfully!", {
          duration: 5000,
        });
        setCountdown(60); // 60 second cooldown
      } else {
        toast.error(result.message || "Failed to send code", {
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Resend error:", error);
      toast.error("An error occurred. Please try again.", { duration: 5000 });
    } finally {
      setIsResending(false);
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
              <FaSpinner className="w-8 h-8 text-blue-500 mx-auto mb-4 animate-spin" />
              <p className="text-gray-600">Loading...</p>
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
            src="/images/welcome2.JPG"
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
            Verify Your Email
          </h1>
          <p className="text-gray-600 mb-6 text-center">
            We&apos;ve sent a 6-digit verification code to
          </p>
          <p className="text-gray-900 font-semibold mb-6">{email}</p>

          <form className="space-y-5 w-full" onSubmit={handleSubmit}>
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
                value={code}
                onChange={handleCodeChange}
                required
                maxLength={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black text-center text-xl font-mono tracking-widest"
                placeholder="000000"
                autoComplete="one-time-code"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || code.length !== 6}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <FaSpinner className="animate-spin mr-2" />
                  Verifying...
                </div>
              ) : (
                "Verify Email"
              )}
            </button>
          </form>

          <div className="mt-6 text-center space-y-3 w-full">
            <button
              onClick={handleResendCode}
              disabled={isResending || countdown > 0}
              className={`text-sm transition-colors ${
                isResending || countdown > 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-blue-600 hover:underline"
              }`}
            >
              {isResending ? (
                <div className="flex items-center justify-center">
                  <FaSpinner className="animate-spin mr-2" />
                  Sending...
                </div>
              ) : countdown > 0 ? (
                `Resend code in ${countdown}s`
              ) : (
                "Didn't receive the code? Resend"
              )}
            </button>

            <div>
              <button
                onClick={() => router.push("/signup")}
                className="flex items-center justify-center mx-auto text-gray-600 hover:text-gray-800 text-sm"
              >
                <FaArrowLeft className="mr-2" />
                Back to Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyCode() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      }
    >
      <VerifyCodeContent />
    </Suspense>
  );
}
