"use client";

import { useEffect, useState } from "react";

const pad = (n) => String(n).padStart(2, "0");

export default function Countdown({ seconds = 1237 }) {
  const [left, setLeft] = useState(seconds);

  useEffect(() => {
    const id = setInterval(() => {
      setLeft((current) => (current > 0 ? current - 1 : seconds));
    }, 1000);
    return () => clearInterval(id);
  }, [seconds]);

  const parts = [
    pad(Math.floor(left / 3600)),
    pad(Math.floor((left % 3600) / 60)),
    pad(left % 60),
  ];

  return (
    <span className="inline-flex items-center gap-1.5 rounded bg-sale px-3 py-1.5 text-[11px] font-semibold text-white">
      Expires in
      <span className="font-mono tabular-nums tracking-wider">
        {parts.join(" : ")}
      </span>
    </span>
  );
}
