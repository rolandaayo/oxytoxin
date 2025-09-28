import { Goldman } from "next/font/google";
import "./globals.css";
import ClientLayout from "./components/ClientLayout";

const goldman = Goldman({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-goldman",
});

export const metadata = {
  title: "Oxytoxin - Clothing Store",
  description:
    "Oxtoyin is a clothing store that sells a wide range of products for men, women, and children.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${goldman.variable} ${goldman.className}`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
