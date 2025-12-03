// components/Newsletter.tsx
"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "sent">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function isValidEmail(email: string) {
    return /^\S+@\S+\.\S+$/.test(email);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidEmail(email.trim())) {
      setErrorMsg("Please enter a valid email address");
      setStatus("error");
      return;
    }
    // TEMP: client-side only. Replace with real API when ready.
    setStatus("sent");
    setErrorMsg("");
  }

  return (
    <section className="max-w-xl mx-auto px-6 py-16">
      <div className="bg-black/90 text-white rounded-2xl p-10 md:p-12 shadow-xl transform transition-all duration-300 hover:scale-[1.01]">
        <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">
          Join the list
        </h3>
        <p className="mt-4 text-gray-300">
          Get restock alerts and exclusive drops. No spam. Unsubscribe anytime.
        </p>

        {status === "sent" ? (
          <div className="mt-8 p-6 bg-white text-black rounded-lg text-center animate-fadeIn">
            <p className="text-lg font-semibold">Thanks for joining!</p>
            <p className="mt-2 text-sm text-gray-700">You’ll hear from us soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <input
                type="email"
                aria-label="Email address"
                placeholder="you@youremail.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                className="w-full px-4 py-3 rounded-full focus:outline-none focus:ring focus:ring-white/50 bg-gray-100 text-gray-800 placeholder-gray-500 transition"
              />
            </div>

            {status === "error" && (
              <p className="text-red-400 text-sm">{errorMsg}</p>
            )}

            <button
              type="submit"
              className="w-full inline-flex justify-center items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-200 active:scale-95 transition-transform duration-150"
            >
              Join
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l3-8H6.4" />
              </svg>
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
