import { useEffect, useState } from "react";
import { Zap, X } from "lucide-react";

export default function FlashSaleBanner() {
  const [left, setLeft] = useState("");
  const [show, setShow] = useState(true);
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const end = new Date(now);
      end.setHours(23, 59, 59, 999);
      const diff = Math.max(0, end.getTime() - now.getTime());
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      const p = (n: number) => String(n).padStart(2, "0");
      setLeft(p(h) + ":" + p(m) + ":" + p(s));
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);
  if (!show) return null;
  return (
    <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white">
      <div className="container mx-auto px-4 py-2 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-sm relative">
        <Zap className="w-4 h-4" />
        <span className="font-bold">FLASH SALE</span>
        <span className="hidden sm:inline">Flat 15% OFF on all bookings</span>
        <span className="font-mono bg-white/20 px-2 py-0.5 rounded">
          ends in {left}
        </span>
        <button
          onClick={() => setShow(false)}
          className="absolute right-3 top-1/2 -translate-y-1/2"
          aria-label="close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
