// components/SocialProof.tsx
"use client";

import { useEffect, useRef, useState } from "react";

type Stat = {
  icon: JSX.Element;
  label: string;
  end: number;
  suffix?: string;
};

const STATS: Stat[] = [
  {
    icon: <img src="/star.svg" width={"40px"} alt="Star" />,
    label: "Average rating",
    end: 49,
    suffix: "",
  },
  {
    icon: <img src="/sold.svg" width={"40px"} alt="" />,
    label: "Units sold (test mode)",
    end: 10000,
    suffix: "+",
  },
  {
    icon: <img src="/return.svg" width={"40px"} alt="" />,
    label: "30-day returns",
    end: 30,
    suffix: "",
  },
];

export default function SocialProof() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;

    const duration = 1000;
    const start = performance.now();

    function frame(now: number) {
      const pct = Math.min((now - start) / duration, 1);
      setProgress(pct);
      if (pct < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }, [visible]);

  return (
    <section ref={ref} className="bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold text-gray-800 uppercase tracking-wide">
          Trusted by
        </h2>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {STATS.map((stat, idx) => {
            const raw = Math.floor(stat.end * progress);
            const display =
              stat.label === "Average rating"
                ? (raw / 10).toFixed(1)
                : raw + (stat.suffix ?? "");

            return (
              <div key={idx} className="flex flex-col items-center">
                {stat.icon}
                <div className="mt-4 text-4xl font-bold text-gray-900">
                  {display}
                </div>
                <div className="mt-1 text-sm text-gray-600">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
