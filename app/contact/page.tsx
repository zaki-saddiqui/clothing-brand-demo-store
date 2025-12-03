// app/contact/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function isValidEmail(v: string) {
    return /^\S+@\S+\.\S+$/.test(v);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg("Please complete all fields.");
      setStatus("error");
      return;
    }
    if (!isValidEmail(email.trim())) {
      setErrorMsg("Please enter a valid email address.");
      setStatus("error");
      return;
    }

    // client-only mock submit — replace with API call later
    try {
      setStatus("sending");
      await new Promise((r) => setTimeout(r, 700)); // simulate network
      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setStatus("error");
      setErrorMsg("Submission failed. Try again.");
    }
  }

  return (
    <main className="min-h-screen bg-[#070707] text-white">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <header className="mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold">Contact</h1>
          <p className="mt-4 text-gray-300 max-w-2xl mx-auto">
            Questions, wholesale or press inquiries, or product support — we’re here to help.
          </p>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: contact form */}
          <div className="lg:col-span-2">
            <div className="bg-[rgba(255,255,255,0.02)] ring-1 ring-white/6 rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">Get in touch</h2>
              <p className="text-gray-300 mb-6">Fill out the form and we’ll get back to you within 1-2 business days.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="flex flex-col">
                    <span className="text-sm text-gray-300 mb-2">Name</span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="px-4 py-3 rounded-md bg-white/5 border border-white/6 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
                    />
                  </label>

                  <label className="flex flex-col">
                    <span className="text-sm text-gray-300 mb-2">Email</span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="px-4 py-3 rounded-md bg-white/5 border border-white/6 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
                    />
                  </label>
                </div>

                <label className="flex flex-col">
                  <span className="text-sm text-gray-300 mb-2">Message</span>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={6}
                    placeholder="Tell us what you need..."
                    className="px-4 py-3 rounded-md bg-white/5 border border-white/6 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 resize-none"
                  />
                </label>

                {status === "error" && errorMsg && (
                  <div className="text-sm text-red-400">{errorMsg}</div>
                )}

                <div className="flex items-center gap-4">
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-white text-black font-semibold shadow hover:shadow-lg active:scale-95 transition"
                  >
                    {status === "sending" ? "Sending..." : status === "sent" ? "Sent" : "Send message"}
                  </button>

                  {status === "sent" && (
                    <div className="text-sm text-green-400">Thanks — we’ll reply soon.</div>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Right: contact details */}
          <aside className="space-y-6">
            <div className="bg-[rgba(255,255,255,0.02)] ring-1 ring-white/6 rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-white mb-2">Customer Support</h3>
              <p className="text-gray-300 text-sm">support@yourbrand.com</p>
              <p className="text-gray-500 text-xs mt-3">Hours: Mon — Fri, 9:00 — 18:00</p>
            </div>

            <div className="bg-[rgba(255,255,255,0.02)] ring-1 ring-white/6 rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-white mb-2">Wholesale & Press</h3>
              <p className="text-gray-300 text-sm">wholesale@yourbrand.com</p>
              <p className="text-gray-500 text-xs mt-3">Please include business details and tax ID.</p>
            </div>

            <div className="bg-[rgba(255,255,255,0.02)] ring-1 ring-white/6 rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-white mb-2">Headquarters</h3>
              <p className="text-gray-300 text-sm">City, State — Remote-friendly</p>
              <p className="text-gray-500 text-xs mt-3">No walk-ins — appointments only.</p>
            </div>
          </aside>
        </section>

        {/* Map / Illustration */}
        <section className="mt-12">
          <div className="bg-[rgba(255,255,255,0.02)] ring-1 ring-white/6 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-6 items-center">
            <div className="w-full md:w-1/2 h-56 rounded-lg overflow-hidden bg-linear-to-br from-white/3 to-white/2 flex items-center justify-center">
              {/* lightweight SVG placeholder map — replace with real map iframe if needed */}
              <svg className="w-3/4 h-3/4 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6.5V19l6-3 6 3 6-3V4.5L15 7 9 4 3 6.5z" />
              </svg>
            </div>

            <div className="flex-1">
              <h4 className="text-white font-semibold">Need help with an order?</h4>
              <p className="text-gray-300 mt-2">If you need help with an existing order, include your order number in the message above and we’ll prioritize it.</p>
              <div className="mt-4 flex gap-3">
                <a href="mailto:support@yourbrand.com" className="px-4 py-2 rounded-md bg-white text-black font-medium">Email Support</a>
                <Link href="/shop" className="px-4 py-2 rounded-md border border-white/10 text-white">Browse products</Link>
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
