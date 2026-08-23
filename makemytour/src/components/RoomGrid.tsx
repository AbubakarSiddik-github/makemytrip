import React, { useEffect, useState } from "react";
import { Users, Box } from "lucide-react";

const ROOMS = [
  {
    key: "Standard Room",
    surcharge: 0,
    capacity: "2 Adults",
    img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800",
    amenities: ["Free WiFi", "AC", "TV"],
  },
  {
    key: "Deluxe Room",
    surcharge: 2000,
    capacity: "2 Adults + 1 Child",
    img: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800",
    amenities: ["Free WiFi", "Breakfast", "City View", "Mini Bar"],
  },
  {
    key: "Executive Suite",
    surcharge: 5000,
    capacity: "3 Adults",
    img: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800",
    amenities: ["Living Area", "Breakfast", "Pool Access", "Lounge"],
  },
  {
    key: "Premium Suite",
    surcharge: 9000,
    capacity: "4 Adults",
    img: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800",
    amenities: ["Private Balcony", "Butler", "Jacuzzi", "All Meals"],
  },
];

export default function RoomGrid({ quantity, onChange, prefKey }: any) {
  const [selected, setSelected] = useState<string>("Standard Room");
  const [avail, setAvail] = useState<any>({});
  const [preview, setPreview] = useState<any>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const a: any = {};
    ROOMS.forEach((r, i) => (a[r.key] = 3 + ((i * 5 + 4) % 6)));
    setAvail(a);
    try {
      const p = localStorage.getItem(prefKey || "roomPref");
      if (p && ROOMS.find((r) => r.key === p)) setSelected(p);
    } catch (e) {}
  }, [prefKey]);

  // Real-time availability changes
  useEffect(() => {
    const t = setInterval(() => {
      setAvail((prev: any) => {
        const r = ROOMS[Math.floor(Math.random() * ROOMS.length)].key;
        const delta = Math.random() > 0.5 ? -1 : 1;
        const val = Math.max(0, Math.min(9, (prev[r] ?? 3) + delta));
        return { ...prev, [r]: val };
      });
    }, 7000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const room = ROOMS.find((r) => r.key === selected);
    if (onChange) onChange(selected, room ? room.surcharge : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const savePreference = () => {
    try {
      localStorage.setItem(prefKey || "roomPref", selected);
    } catch (e) {}
    alert("Room preference saved: " + selected);
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-1 flex items-center gap-2">
        <Box className="w-5 h-5" /> Choose Your Room
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Upgrade for more comfort. Upgrade price is per night and added to your
        total.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {ROOMS.map((room) => {
          const isSel = selected === room.key;
          const left = avail[room.key] ?? 0;
          return (
            <div
              key={room.key}
              className={
                "rounded-xl border-2 overflow-hidden transition-all " +
                (isSel ? "border-blue-600 shadow-md" : "border-gray-200")
              }
            >
              <div className="relative h-40 bg-gradient-to-br from-blue-100 to-indigo-200">
                <img
                  src={room.img}
                  alt={room.key}
                  className="w-full h-40 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <button
                  onClick={() => setPreview(room)}
                  className="absolute bottom-2 right-2 bg-white/90 text-xs px-2 py-1 rounded-full font-medium hover:bg-white"
                >
                  3D Preview
                </button>
                {room.surcharge === 0 && (
                  <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                    Included
                  </span>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold">{room.key}</h3>
                  <span className="text-sm font-semibold text-blue-700">
                    {room.surcharge === 0
                      ? "Base"
                      : "+₹" + room.surcharge.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                  <Users className="w-3 h-3" /> {room.capacity}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {room.amenities.map((a) => (
                    <span
                      key={a}
                      className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                    >
                      {a}
                    </span>
                  ))}
                </div>
                <p
                  className={
                    "text-xs mt-2 " +
                    (left <= 2 ? "text-red-600 font-semibold" : "text-gray-500")
                  }
                >
                  {left > 0
                    ? left <= 2
                      ? "Only " + left + " left!"
                      : left + " rooms available"
                    : "Sold out"}
                </p>
                <button
                  onClick={() => setSelected(room.key)}
                  disabled={left === 0}
                  className={
                    "w-full mt-3 py-2 rounded-lg text-sm font-medium " +
                    (isSel
                      ? "bg-blue-600 text-white"
                      : left === 0
                      ? "bg-gray-100 text-gray-400"
                      : "bg-blue-50 text-blue-700 hover:bg-blue-100")
                  }
                >
                  {isSel ? "Selected" : left === 0 ? "Sold out" : "Select"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between mt-4">
        <span className="text-sm text-gray-600">
          Selected: <b>{selected}</b>
        </span>
        <button
          onClick={savePreference}
          className="text-sm text-blue-600 font-medium hover:text-blue-700"
        >
          Save as my preference
        </button>
      </div>

      {preview && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => setPreview(null)}
        >
          <div
            className="bg-white rounded-xl overflow-hidden max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
            onMouseMove={(e) => {
              const rect = (
                e.currentTarget as HTMLElement
              ).getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
              const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20;
              setTilt({ x: y, y: x });
            }}
            onMouseLeave={() => setTilt({ x: 0, y: 0 })}
            style={{ perspective: "1000px" }}
          >
            <div className="p-3 flex items-center justify-between border-b">
              <h3 className="font-semibold">{preview.key} - 3D Preview</h3>
              <button
                onClick={() => setPreview(null)}
                className="text-gray-500 text-xl leading-none"
              >
                ×
              </button>
            </div>
            <div className="p-6 bg-gray-100 flex items-center justify-center">
              <img
                src={preview.img}
                alt={preview.key}
                className="rounded-lg shadow-lg max-h-72 object-cover transition-transform"
                style={{
                  transform:
                    "rotateX(" + tilt.x + "deg) rotateY(" + tilt.y + "deg)",
                }}
              />
            </div>
            <p className="text-xs text-center text-gray-500 pb-3">
              Move your mouse over the image to look around the room.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
