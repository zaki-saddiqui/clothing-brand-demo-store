// app/layout.tsx
import "./globals.css";
import { CartProvider } from "../context/CartContext";
import Navbar from "../components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Clothing Brand",
  description: "Clothing brand"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
