import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ProfileLayout({ children }) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
