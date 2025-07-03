"use client";

import { useState, useEffect } from "react";
import AdminContent from "./AdminContent";
import { redirect } from "next/navigation";

export default function AdminPage() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    console.log("AdminPage mounted on client");
    // Set isReady to true once we're on the client
    if (typeof window !== "undefined") {
      console.log("Window is defined, setting isReady to true");
      setIsReady(true);
    }
  }, []);

  console.log("AdminPage rendering, isReady:", isReady);

  if (!isReady) {
    console.log("AdminPage showing loading spinner");
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  console.log("AdminPage rendering AdminContent");
  redirect("/admin/dashboard");
  return null;
}
