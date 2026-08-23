import { getflaggedreviews, removereview, keepreview } from "@/api";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Star, ShieldAlert, Trash2, Check } from "lucide-react";
import BackButton from "@/components/BackButton";

const Stars = ({ value }: any) => (
  <span className="inline-flex">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        size={14}
        className={
          i <= value ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }
      />
    ))}
  </span>
);

export default function Moderation() {
  const user = useSelector((s: any) => s.user.user);
  const [flagged, setFlagged] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);

  const load = async () => {
    const d = await getflaggedreviews();
    setFlagged(Array.isArray(d) ? d : []);
    setLoaded(true);
  };

  useEffect(() => {
    if (user?.role === "ADMIN") load();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Please log in.
      </div>
    );
  }
  if (user.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 font-semibold">
        Access denied. This page is for moderators only.
      </div>
    );
  }

  const remove = async (id: string) => {
    await removereview(id);
    load();
  };
  const keep = async (id: string) => {
    await keepreview(id);
    load();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <BackButton />
        <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-red-600" /> Review Moderation
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          Reviews reported by users appear here. Remove inappropriate content or
          keep it if it is fine.
        </p>

        {!loaded ? (
          <p className="text-gray-500">Loading flagged reviews...</p>
        ) : flagged.length === 0 ? (
          <p className="text-gray-500">
            No flagged reviews. Everything looks clean.
          </p>
        ) : (
          <div className="space-y-4">
            {flagged.map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-xl shadow-sm p-5 border border-red-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{r.userName}</p>
                    <Stars value={r.rating} />
                  </div>
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                    Reported {r.flagCount}x
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {r.itemType} • {r.itemId}
                </p>
                <p className="text-sm text-gray-700 mt-2">{r.text}</p>
                {r.photos && r.photos.length > 0 && (
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {r.photos.map((p: string, i: number) => (
                      <img
                        key={i}
                        src={p}
                        className="w-16 h-16 object-cover rounded"
                        alt=""
                      />
                    ))}
                  </div>
                )}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => remove(r.id)}
                    className="flex items-center gap-1 bg-red-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-700"
                  >
                    <Trash2 className="w-4 h-4" /> Remove Review
                  </button>
                  <button
                    onClick={() => keep(r.id)}
                    className="flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-200"
                  >
                    <Check className="w-4 h-4" /> Keep (Dismiss Flag)
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
