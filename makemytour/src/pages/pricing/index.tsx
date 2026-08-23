import { getpricing, freezeprice, getfreezes } from "@/api";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Minus, Lock, Flame } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const formatTime = (iso: string) => {
  if (!iso) return "--";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "--";
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
};

const freezeCountdown = (iso: string, now: number) => {
  const t = new Date(iso).getTime();
  if (isNaN(t)) return "";
  const diff = t - now;
  if (diff <= 0) return "expired";
  const m = Math.floor(diff / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return m + "m " + s + "s left";
};

// Lightweight inline SVG line chart for price history
function PriceChart({ history }: any) {
  if (!history || history.length < 2) {
    return <div className="text-xs text-gray-400 h-16 flex items-center">Collecting price data...</div>;
  }
  const prices = history.map((h: any) => h.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const w = 260;
  const h = 60;
  const range = max - min || 1;
  const step = w / (prices.length - 1);
  const points = prices
    .map((p: number, i: number) => {
      const x = i * step;
      const y = h - ((p - min) / range) * (h - 8) - 4;
      return x.toFixed(1) + "," + y.toFixed(1);
    })
    .join(" ");
  const last = prices[prices.length - 1];
  const first = prices[0];
  const up = last >= first;
  const color = up ? "#dc2626" : "#16a34a";
  return (
    <svg width="100%" viewBox={"0 0 " + w + " " + h} className="mt-2">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        points={points}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function PricingPage() {
  const [prices, setPrices] = useState<any[]>([]);
  const [freezes, setFreezes] = useState<any[]>([]);
  const [now, setNow] = useState<number>(0);
  const [loaded, setLoaded] = useState(false);
  const user = useSelector((state: any) => state.user.user);
  const userId = user?.id || user?._id;

  const loadFreezes = async () => {
    if (userId) {
      const fz = await getfreezes(userId);
      setFreezes(Array.isArray(fz) ? fz : []);
    }
  };

  useEffect(() => {
    setNow(Date.now());
    let active = true;
    const load = async () => {
      const data = await getpricing();
      if (!active) return;
      setPrices(Array.isArray(data) ? data : []);
      setLoaded(true);
    };
    load();
    const poll = setInterval(load, 10000);
    const clock = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      active = false;
      clearInterval(poll);
      clearInterval(clock);
    };
  }, []);

  useEffect(() => {
    loadFreezes();
    const t = setInterval(loadFreezes, 15000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleFreeze = async (flightId: string) => {
    if (!userId) {
      alert("Please log in to freeze a price.");
      return;
    }
    const res = await freezeprice(userId, flightId);
    if (res) {
      alert("Price frozen at ₹" + res.frozenPrice + " for 15 minutes.");
      loadFreezes();
    } else {
      alert("Could not freeze price. Make sure the backend is running.");
    }
  };

  const trendIcon = (trend: string) => {
    if (trend === "up") return <TrendingUp className="w-4 h-4 text-red-600" />;
    if (trend === "down") return <TrendingDown className="w-4 h-4 text-green-600" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1">Dynamic Pricing</h1>
        <p className="text-gray-500 text-sm mb-6">
          Prices update in real time based on demand and season. Peak days and
          holidays add up to +20%. Lock a price with Freeze.
        </p>

        {/* Active freezes */}
        {freezes.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-600" /> Your Frozen Prices
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {freezes.map((fz) => (
                <div
                  key={fz.id}
                  className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                >
                  <p className="font-semibold">{fz.flightName}</p>
                  <p className="text-2xl font-bold text-blue-700">
                    ₹{fz.frozenPrice}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {freezeCountdown(fz.expiresAt, now)}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        <h2 className="text-lg font-semibold mb-3">Live Flight Prices</h2>
        {!loaded ? (
          <p className="text-gray-500">Loading live prices...</p>
        ) : prices.length === 0 ? (
          <p className="text-gray-500">
            No pricing data. Make sure the backend is running and has flights.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prices.map((p) => (
              <div
                key={p.flightId}
                className="bg-white rounded-xl shadow-md p-5 border border-gray-100"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-lg">{p.flightName}</h3>
                    <p className="text-gray-500 text-sm">
                      {p.from} → {p.to}
                    </p>
                  </div>
                  {p.peak && (
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-orange-100 text-orange-700 border border-orange-300 flex items-center gap-1">
                      <Flame className="w-3 h-3" /> Peak
                    </span>
                  )}
                </div>

                <div className="flex items-end gap-3 mt-3">
                  <span className="text-3xl font-bold">₹{p.currentPrice}</span>
                  <span className="text-sm text-gray-400 line-through mb-1">
                    ₹{p.basePrice}
                  </span>
                  <span
                    className={
                      "text-sm font-semibold mb-1 flex items-center gap-1 " +
                      (p.changePercent >= 0 ? "text-red-600" : "text-green-600")
                    }
                  >
                    {trendIcon(p.trend)}
                    {p.changePercent > 0 ? "+" : ""}
                    {p.changePercent}%
                  </span>
                </div>

                {/* Transparent factors */}
                <div className="flex flex-wrap gap-2 mt-3 text-xs">
                  <span className="px-2 py-1 rounded bg-gray-100 text-gray-600">
                    Demand x{p.demandFactor}
                  </span>
                  <span className="px-2 py-1 rounded bg-gray-100 text-gray-600">
                    Season x{p.seasonFactor}
                  </span>
                  <span className="px-2 py-1 rounded bg-gray-100 text-gray-600">
                    Seats left: {p.availableSeats}
                  </span>
                </div>

                {/* Price history graph */}
                <div>
                  <p className="text-xs text-gray-400 mt-3">Price history</p>
                  <PriceChart history={p.history} />
                </div>

                <Button
                  className="w-full mt-3 flex items-center gap-2"
                  onClick={() => handleFreeze(p.flightId)}
                >
                  <Lock className="w-4 h-4" /> Freeze this price (15 min)
                </Button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
