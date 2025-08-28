"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { authApi } from "../services/api";

export default function TestEmailPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

  const testEmail = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Email is required");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      console.log("Testing email with API service...");

      const data = await authApi.testEmail(email);
      console.log("Raw response:", JSON.stringify(data));

      setResult(data);

      if (data.status === "success") {
        if (data.emailSent) {
          toast.success("Test email sent successfully!");
        } else {
          toast.error("Test email failed to send - check server logs");
        }
      } else {
        toast.error(data.message || "Test failed");
      }
    } catch (error) {
      console.error("Test email error:", error);
      toast.error("Test failed: " + error.message);
      setResult({
        status: "error",
        message: error.message,
        url: `${BACKEND_URL}/api/auth/test-email`,
        backend_url: BACKEND_URL,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-900">
          Test Email Service
        </h1>

        <form onSubmit={testEmail} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Test Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              placeholder="Enter email to test"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Testing..." : "Send Test Email"}
          </button>
        </form>

        {result && (
          <div className="mt-6 p-4 rounded-md bg-gray-100">
            <h3 className="font-semibold text-gray-900 mb-2">Test Result:</h3>
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-6 text-center">
          <a href="/signup" className="text-blue-600 hover:underline text-sm">
            Back to Signup
          </a>
        </div>
      </div>
    </div>
  );
}
