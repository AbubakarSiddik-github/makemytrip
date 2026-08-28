import { useState } from "react";

const VIBES: any = {
  Beach: [
    { name: "Goa", img: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600" },
    { name: "Bali", img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600" },
    { name: "Andaman", img: "https://images.unsplash.com/photo-1589979481223-deb893043163?auto=format&fit=crop&w=600" },
    { name: "Kochi", img: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600" },
  ],
  Hills: [
    { name: "Manali", img: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600" },
    { name: "Shimla", img: "https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=600" },
    { name: "Munnar", img: "https://images.unsplash.com/photo-1615529162924-f8605388461d?auto=format&fit=crop&w=600" },
    { name: "Darjeeling", img: "https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?auto=format&fit=crop&w=600" },
  ],
  Heritage: [
    { name: "Jaipur", img: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600" },
    { name: "Agra", img: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600" },
    { name: "Udaipur", img: "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=600" },
    { name: "Hampi", img: "https://images.unsplash.com/photo-1600100397608-f010b1e3c2c0?auto=format&fit=crop&w=600" },
  ],
  City: [
    { name: "Mumbai", img: "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&w=600" },
    { name: "Delhi", img: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600" },
    { name: "Bengaluru", img: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=600" },
    { name: "Dubai", img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600" },
  ],
};

export default function PickAVibe({ onPick }: any) {
  const [vibe, setVibe] = useState("Beach");
  return (
    <section className="my-12">
      <h2 className="text-2xl font-bold text-white mb-1">Pick a vibe</h2>
      <p className="text-white/80 mb-4">
        Explore top destinations by the mood you are in.
      </p>
      <div className="flex flex-wrap gap-2 mb-5">
        {Object.keys(VIBES).map((v) => (
          <button
            key={v}
            onClick={() => setVibe(v)}
            className={
              "px-4 py-1.5 rounded-full text-sm font-medium transition " +
              (vibe === v
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100")
            }
          >
            {v}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {VIBES[vibe].map((d: any) => (
          <button
            key={d.name}
            onClick={() => onPick && onPick(d.name)}
            className="relative rounded-xl overflow-hidden group text-left bg-blue-200 h-40"
          >
            <img
              src={d.img}
              alt={d.name}
              className="w-full h-40 object-cover group-hover:scale-105 transition"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-2 left-3 text-white">
              <p className="font-semibold">{d.name}</p>
              <p className="text-xs opacity-90">Explore stays &amp; flights</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
