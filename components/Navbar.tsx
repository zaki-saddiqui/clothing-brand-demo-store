"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const btnRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Cart context
  const cart = useCart();
  const items = cart?.items ?? [];

  const itemCount = items.reduce((sum: number, it: any) => {
    const qty =
      typeof it.qty === "number"
        ? it.qty
        : typeof it.quantity === "number"
        ? it.quantity
        : 1;
    return sum + qty;
  }, 0);

  // Scroll Logic
  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 10) setScrolled(true);
      else setScrolled(false);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  // Close on ESC + click outside
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function onClick(e: MouseEvent) {
      if (!open) return;
      const t = e.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(t) &&
        btnRef.current &&
        !btnRef.current.contains(t)
      ) {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("click", onClick);
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-60">
      <nav
        className={`transition-all duration-300 border-b ${
          scrolled
            ? "backdrop-blur-md bg-black/5 border-white/10"
            : "backdrop-blur-sm bg-black/20 border-white/5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* LOGO */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                <img src="/logo.png" alt="logo" />
              </div>
              <span className="text-md font-bold tracking-tight text-gray-700">
                NevBird
              </span>
            </Link>

            {/* DESKTOP NAV */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                className="text-md text-gray-700 hover:text-gray-500 font-bold"
              >
                Home
              </Link>
              <Link
                href="/shop"
                className="text-md text-gray-700 hover:text-gray-500 font-bold"
              >
                Shop
              </Link>
              <Link
                href="/about"
                className="text-md text-gray-700 hover:text-gray-500 font-bold"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-md text-gray-700 hover:text-gray-500 font-bold"
              >
                Contact
              </Link>
            </div>

            {/* RIGHT SIDE ACTIONS */}
            <div className="flex items-center gap-3">
              {/* CART ICON + BADGE */}
              <Link
                href="/cart"
                className="relative inline-flex h-9 items-center justify-center rounded-md px-3 py-2 bg-white/5 hover:bg-white/10"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-700 hover:text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path d="M6 6h15l-1.5 9h-11z" />
                  <circle cx="9" cy="20" r="1" />
                  <circle cx="18" cy="20" r="1" />
                </svg>

                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center text-xs font-semibold bg-rose-500 text-white rounded-full px-1">
                    {itemCount}
                  </span>
                )}
              </Link>

              {/* MOBILE MENU BUTTON */}
              <button
                ref={btnRef}
                onClick={() => setOpen((v) => !v)}
                className="md:hidden p-2 rounded-md hover:bg-white/10"
                aria-expanded={open}
                aria-controls="mobile-menu"
              >
                {open ? (
                  <svg
                    className="h-6 w-6 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE MENU */}
        <div
          ref={menuRef}
          id="mobile-menu"
          className={`md:hidden fixed inset-x-0 top-16 z-40 transition-all duration-200 ${
            open
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
        >
          {/* MATCH NAVBAR BLUR + DARK BACKGROUND */}
          <div
            className={`
      absolute inset-0 
      backdrop-blur-md 
      bg-black/30 
      transition-all duration-300
      ${open ? "opacity-100" : "opacity-0"}
    `}
          />

          <div className="relative max-w-3xl mx-auto p-4">
            {/* PANEL: same blur aesthetic as navbar, darkened + inner glass */}
            <div
              className={`
        rounded-xl p-4 space-y-3 shadow-xl 
        ring-1 ring-white/10 
        backdrop-blur-xl 
        transition-all duration-300
        ${open ? "bg-black/40" : "bg-black/20 pointer-events-none"}
      `}
            >
              {[
                ["Home", "/"],
                ["Shop", "/shop"],
                ["About", "/about"],
                ["Contact", "/contact"],
              ].map(([label, href]) => (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-bold text-white hover:bg-white/10"
                >
                  {label}
                </Link>
              ))}

              {/* CART ROW */}
              <Link
                href="/cart"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-md font-bold text-white hover:bg-white/10"
              >
                <span>Cart</span>
                {itemCount > 0 && (
                  <span className="ml-auto inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold bg-rose-500 text-white rounded-full">
                    {itemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
