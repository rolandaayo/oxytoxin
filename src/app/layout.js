import { Montserrat } from "next/font/google";
import "./globals.css";
import ClientLayout from "./components/ClientLayout";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata = {
  title: "Oxtoyin - Clothing Store",
  description:
    "Oxtoyin is a clothing store that sells a wide range of products for men, women, and children.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={montserrat.className}>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
