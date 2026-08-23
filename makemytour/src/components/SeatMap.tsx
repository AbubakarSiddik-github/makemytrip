import React, { useEffect, useState } from "react";
import { Armchair, Check } from "lucide-react";

const ROWS = 18;
const COLS = ["A", "B", "C", "D", "E", "F"];

const seatClassInfo = (row: number) => {
  if (row <= 2) return { name: "Business", surcharge: 3000 };
  if (row <= 6) return { name: "Premium", surcharge: 1200 };
  return { name: "Economy", surcharge: 0 };
};

export default function SeatMap({ quantity, onChange, prefKey }: any) {
  const [selected, setSelected] = useState<string[]>([]);
  const [occupied, setOccupied] = useState<string[]>([]);
  const [savedPref, setSavedPref] = useState<string>("");

  useEffect(() => {
    const occ: string[] = [];
    for (let r = 1; r <= ROWS; r++) {
      for (let c = 0; c < COLS.length; c++) {
        if ((r * 7 + c * 13) % 10 < 3) occ.push(r + COLS[c]);
      }
    }
    setOccupied(occ);
    try {
      const p = localStorage.getItem(prefKey || "seatPref");
      if (p) setSavedPref(p);
    } catch (e) {}
  }, [prefKey]);

  // Real-time availability: flip a random seat every 8s
  useEffect(() => {
    const t = setInterval(() => {
      setOccupied((prev) => {
        const r = 1 + Math.floor(Math.random() * ROWS);
        const c = COLS[Math.floor(Math.random() * COLS.length)];
        const id = r + c;
        if (selected.includes(id)) return prev;
        return prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      });
    }, 8000);
    return () => clearInterval(t);
  }, [selected]);

  useEffect(() => {
    setSelected((prev) => prev.slice(0, quantity));
  }, [quantity]);

  useEffect(() => {
    const total = selected.reduce(
      (sum, id) => sum + seatClassInfo(parseInt(id)).surcharge,
      0
    );
    if (onChange) onChange(selected, total);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const toggle = (id: string) => {
    if (occupied.includes(id)) return;
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= quantity) return [...prev.slice(1), id];
      return [...prev, id];
    });
  };

  const savePreference = () => {
    if (selected.length === 0) {
      alert("Select a seat first to save it as your preference.");
      return;
    }
    const id = selected[0];
    const row = parseInt(id);
    const col = id.replace(/[0-9]/g, "");
    const pos =
      col === "A" || col === "F"
        ? "Window"
        : col === "C" || col === "D"
        ? "Aisle"
        : "Middle";
    const pref = seatClassInfo(row).name + " - " + pos;
    try {
      localStorage.setItem(prefKey || "seatPref", pref);
    } catch (e) {}
    setSavedPref(pref);
    alert("Preference saved: " + pref);
  };

  const seatColor = (id: string, row: number) => {
    if (occupied.includes(id))
      return "bg-gray-300 text-gray-400 cursor-not-allowed";
    if (selected.includes(id)) return "bg-green-600 text-white";
    const info = seatClassInfo(row);
    if (info.name === "Business")
      return "bg-amber-50 border border-amber-400 text-amber-700 hover:bg-amber-100";
    if (info.name === "Premium")
      return "bg-indigo-50 border border-indigo-400 text-indigo-700 hover:bg-indigo-100";
    return "bg-blue-50 border border-blue-300 text-blue-700 hover:bg-blue-100";
  };

  const total = selected.reduce(
    (s, id) => s + seatClassInfo(parseInt(id)).surcharge,
    0
  );

  return (
    <div>
      <h2 className="text-lg font-bold mb-1 flex items-center gap-2">
        <Armchair className="w-5 h-5" /> Select Your Seats
      </h2>
      <p className="text-sm text-gray-500 mb-3">
        Choose {quantity} seat{quantity > 1 ? "s" : ""}. Premium and Business
        seats offer extra comfort and legroom.
      </p>

      {savedPref && (
        <div className="text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded px-3 py-2 mb-3">
          Saved preference: <b>{savedPref}</b>
        </div>
      )}

      <div className="flex flex-wrap gap-3 text-xs mb-4">
        <span className="flex items-center gap-1">
          <span className="w-4 h-4 rounded bg-amber-100 border border-amber-400 inline-block" />{" "}
          Business +₹3000
        </span>
        <span className="flex items-center gap-1">
          <span className="w-4 h-4 rounded bg-indigo-100 border border-indigo-400 inline-block" />{" "}
          Premium +₹1200
        </span>
        <span className="flex items-center gap-1">
          <span className="w-4 h-4 rounded bg-blue-100 border border-blue-300 inline-block" />{" "}
          Economy
        </span>
        <span className="flex items-center gap-1">
          <span className="w-4 h-4 rounded bg-green-600 inline-block" /> Selected
        </span>
        <span className="flex items-center gap-1">
          <span className="w-4 h-4 rounded bg-gray-300 inline-block" /> Taken
        </span>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block bg-gray-50 rounded-xl p-4">
          {Array.from({ length: ROWS }, (_, i) => i + 1).map((row) => (
            <div key={row} className="flex items-center gap-1 mb-1">
              <span className="w-6 text-xs text-gray-400 text-right mr-1">
                {row}
              </span>
              {COLS.map((col, ci) => (
                <React.Fragment key={col}>
                  {ci === 3 && <span className="inline-block w-4" />}
                  <button
                    onClick={() => toggle(row + col)}
                    disabled={occupied.includes(row + col)}
                    className={
                      "w-7 h-7 rounded text-[10px] font-semibold flex items-center justify-center " +
                      seatColor(row + col, row)
                    }
                    title={row + col + " - " + seatClassInfo(row).name}
                  >
                    {selected.includes(row + col) ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      col
                    )}
                  </button>
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
        <div className="text-sm">
          <span className="text-gray-500">Selected: </span>
          <b>{selected.length > 0 ? selected.join(", ") : "None"}</b>
          {total > 0 && (
            <span className="ml-2 text-gray-700">
              (+₹{total.toLocaleString()})
            </span>
          )}
        </div>
        <button
          onClick={savePreference}
          className="text-sm text-blue-600 font-medium hover:text-blue-700"
        >
          Save as my preference
        </button>
      </div>
    </div>
  );
}
