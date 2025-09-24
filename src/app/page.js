"use client";

import Navbar from "./components/Navbar";
import Body from "./components/Body";
import Footer from "./components/Footer";
import { Goldman } from "next/font/google";

const goldman = Goldman({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

export default function Home() {
  return (
    <div className={`${goldman.className} min-h-screen bg-white flex flex-col`}>
      <Navbar />
      <main className="flex-grow">
        <Body />
      </main>
      <Footer />
    </div>
  );
}
