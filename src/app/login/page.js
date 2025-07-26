"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://oxytoxin-backend.vercel.app";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.status === "success" && data.token) {
        localStorage.setItem("authToken", data.token);
        if (data.user) {
          localStorage.setItem("userName", data.user.name);
          localStorage.setItem("userEmail", data.user.email);
        }
        toast.success("Login successful!");
        
        // Check if there's a redirect URL stored
        const redirectUrl = localStorage.getItem("redirectAfterLogin");
        if (redirectUrl) {
          localStorage.removeItem("redirectAfterLogin"); // Clear the stored URL
          router.push(redirectUrl);
        } else {
          router.push("/");
        }
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (err) {
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-2xl font-bold mb-6 text-gray-900">Sign In</h1>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black pr-16"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-blue-600 focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
