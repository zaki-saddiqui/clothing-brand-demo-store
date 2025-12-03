// components/CardNumberInput.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  className?: string;
  placeholder?: string;
  required?: boolean;
  onChangeRaw?: (digits: string) => void; // optional: receive raw digits (no spaces)
};

export default function CardNumberInput({ className = "", placeholder = "Card number (mock)", required = false, onChangeRaw }: Props) {
  const [display, setDisplay] = useState("");
  const [brand, setBrand] = useState<"visa" | "mastercard" | "amex" | "discover" | "unknown">("unknown");
  const ref = useRef<HTMLInputElement | null>(null);

  // detect brand from digits
  const detectBrand = useCallback((d: string) => {
    if (/^3[47]/.test(d)) return "amex";
    if (/^4/.test(d)) return "visa";
    if (/^(5[1-5])/.test(d) || /^(222[1-9]|22[3-9]\d|2[3-6]\d{2}|27[0-1]\d|2720)/.test(d)) return "mastercard";
    if (/^(6011|65|64[4-9])/.test(d)) return "discover";
    return "unknown";
  }, []);

  // format digits to groups depending on brand
  const formatDigits = useCallback((digits: string, b: string) => {
    if (b === "amex") {
      // 4 - 6 - 5 (max 15)
      const g1 = digits.slice(0, 4);
      const g2 = digits.slice(4, 10);
      const g3 = digits.slice(10, 15);
      return [g1, g2, g3].filter(Boolean).join(" ");
    } else {
      // default groups of 4, max 16
      return digits.match(/.{1,4}/g)?.join(" ") ?? digits;
    }
  }, []);

  // handler for input change
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.target;
    // preserve cursor position roughly
    const prevSelection = input.selectionStart ?? input.value.length;

    // extract digits only
    let digits = input.value.replace(/\D/g, "");

    // detect brand early from current digits (before truncating)
    const b = detectBrand(digits);
    setBrand(b);

    // cap digits to brand max
    const maxDigits = b === "amex" ? 15 : 16;
    if (digits.length > maxDigits) digits = digits.slice(0, maxDigits);

    // format for display
    const formatted = formatDigits(digits, b);

    setDisplay(formatted);
    onChangeRaw?.(digits);

    // maintain caret roughly at end (simple & robust)
    requestAnimationFrame(() => {
      const el = ref.current;
      if (!el) return;
      // Try to place caret right after the character that was under the cursor.
      // Best-effort: move to end if can't calculate safely.
      const newPos = formatted.length;
      el.setSelectionRange(newPos, newPos);
    });
  }

  // allow paste to be nicely handled too
  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const text = e.clipboardData.getData("text");
    if (!text) return;
    e.preventDefault();
    const digits = text.replace(/\D/g, "");
    const b = detectBrand(digits);
    const maxDigits = b === "amex" ? 15 : 16;
    const truncated = digits.slice(0, maxDigits);
    const formatted = formatDigits(truncated, b);
    setBrand(b);
    setDisplay(formatted);
    onChangeRaw?.(truncated);

    requestAnimationFrame(() => {
      const el = ref.current;
      if (el) {
        const pos = formatted.length;
        el.setSelectionRange(pos, pos);
      }
    });
  }

  // allow external clearing if needed (example)
  useEffect(() => {
    // nothing for now, placeholder for future
  }, []);

  // small visual brand label
  const brandLabel = brand === "unknown" ? "" : brand.toUpperCase();

  return (
    <div className={`relative`}>
      <input
        ref={ref}
        inputMode="numeric"
        autoComplete="cc-number"
        placeholder={placeholder}
        className={`${className} pr-20`} // room for brand label
        value={display}
        onChange={handleChange}
        onPaste={handlePaste}
        maxLength={19} // spaces included (16 digits + 3 spaces)
        required={required}
        data-raw={display.replace(/\s/g, "")}
        aria-label="Card number"
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-300">
        {brandLabel && (
          <span className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-white/6 text-white/95">
            {/* Small brand icons (SVG simple) */}
            {brand === "visa" && (
              <svg width="28" height="18" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <rect width="36" height="24" rx="3" fill="#1A1F71" />
              </svg>
            )}
            {brand === "mastercard" && (
              <svg width="28" height="18" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <rect width="36" height="24" rx="3" fill="#EB001B" />
              </svg>
            )}
            {brand === "amex" && (
              <svg width="28" height="18" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <rect width="36" height="24" rx="3" fill="#2E77BB" />
              </svg>
            )}
            {brand === "discover" && (
              <svg width="28" height="18" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <rect width="36" height="24" rx="3" fill="#F76B00" />
              </svg>
            )}
            <span className="ml-1 text-white text-[11px]">{brandLabel}</span>
          </span>
        )}
      </div>
    </div>
  );
}
