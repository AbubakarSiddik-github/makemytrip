import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

export const getWishlist = () => {
  try {
    return JSON.parse(localStorage.getItem("wishlist") || "[]");
  } catch (e) {
    return [];
  }
};
const saveWishlist = (list: any[]) => {
  try {
    localStorage.setItem("wishlist", JSON.stringify(list));
  } catch (e) {}
  if (typeof window !== "undefined")
    window.dispatchEvent(new Event("wishlist-changed"));
};

export default function WishlistButton({ item }: any) {
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    const check = () =>
      setSaved(getWishlist().some((w: any) => w.id === item.id));
    check();
    window.addEventListener("wishlist-changed", check);
    return () => window.removeEventListener("wishlist-changed", check);
  }, [item.id]);

  const toggle = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    const list = getWishlist();
    const exists = list.some((w: any) => w.id === item.id);
    saveWishlist(exists ? list.filter((w: any) => w.id !== item.id) : [...list, item]);
  };

  return (
    <button
      onClick={toggle}
      title={saved ? "Remove from wishlist" : "Save to wishlist"}
      className="p-1.5 rounded-full bg-white shadow hover:scale-110 transition"
    >
      <Heart
        className={"w-4 h-4 " + (saved ? "fill-red-500 text-red-500" : "text-gray-400")}
      />
    </button>
  );
}
