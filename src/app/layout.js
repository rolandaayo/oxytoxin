import { Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "./context/CartContext";
import { AnimatePresence } from "framer-motion";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata = {
  title: "Oxtoyin | Clothing Store",
  description:
    "Oxtoyin is a clothing store that sells a wide range of products for men, women, and children.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={montserrat.className}>
      <body>
        <CartProvider>
          <AnimatePresence mode="wait">{children}</AnimatePresence>
        </CartProvider>
        <Toaster />
      </body>
    </html>
  );
}