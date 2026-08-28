import { useEffect, useState } from "react";
import { getflight, gethotel } from "@/api";
import { useRouter } from "next/router";

const dealPct = (id: string) => {
  const seed = String(id || "")
    .split("")
    .reduce((a, c) => a + c.charCodeAt(0), 0);
  return 12 + (seed % 20);
};

export default function DealsSection() {
  const [items, setItems] = useState<any[]>([]);
  const router = useRouter();
  useEffect(() => {
    let active = true;
    (async () => {
      const flights = await getflight();
      const hotels = await gethotel();
      if (!active) return;
      const f = (Array.isArray(flights) ? flights : [])
        .slice(0, 3)
        .map((x: any) => ({
          id: x.id,
          type: "flight",
          title: x.flightName,
          sub: x.from + " to " + x.to,
          price: x.price,
        }));
      const h = (Array.isArray(hotels) ? hotels : [])
        .slice(0, 3)
        .map((x: any) => ({
          id: x.id,
          type: "hotel",
          title: x.hotelName,
          sub: x.location,
          price: x.pricePerNight,
        }));
      setItems([...f, ...h]);
    })();
    return () => {
      active = false;
    };
  }, []);
  if (items.length === 0) return null;
  return (
    <section className="my-12">
      <h2 className="text-2xl font-bold text-white mb-1">Today&apos;s Deals</h2>
      <p className="text-white/80 mb-4">
        Limited-time prices — grab them before they are gone.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((d) => {
          const off = dealPct(d.id);
          const original = Math.round(d.price / (1 - off / 100) / 10) * 10;
          return (
            <div
              key={d.type + d.id}
              className="bg-white rounded-xl shadow p-4 relative"
            >
              <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                {off}% OFF
              </span>
              <p className="text-xs uppercase text-blue-600 font-semibold">
                {d.type}
              </p>
              <h3 className="font-bold">{d.title}</h3>
              <p className="text-sm text-gray-500">{d.sub}</p>
              <div className="mt-2 flex items-end gap-2">
                <span className="text-xl font-bold">
                  ₹{d.price.toLocaleString()}
                </span>
                <span className="text-sm text-gray-400 line-through mb-0.5">
                  ₹{original.toLocaleString()}
                </span>
              </div>
              <button
                onClick={() =>
                  router.push(
                    (d.type === "flight" ? "/book-flight/" : "/book-hotel/") + d.id
                  )
                }
                className="w-full mt-3 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700"
              >
                Grab Deal
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
