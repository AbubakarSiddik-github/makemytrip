import { getrecommendations, recfeedback } from "@/api";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  Info,
  ThumbsUp,
  ThumbsDown,
  Plane,
  Building2,
  MapPin,
  Sparkles,
} from "lucide-react";

function RecCard({ rec, userId, onDismiss, router }: any) {
  const [showReason, setShowReason] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const explore = () => {
    if (rec.type === "flight") router.push("/book-flight/" + rec.refId);
    else if (rec.type === "hotel") router.push("/book-hotel/" + rec.refId);
    else
      alert(
        "Search flights & hotels to " +
          rec.title +
          " from the home page to plan your trip!"
      );
  };

  const helpful = async () => {
    setFeedback("helpful");
    if (userId) await recfeedback(userId, rec.recKey, rec.tags?.[0], true);
  };
  const irrelevant = async () => {
    if (userId) await recfeedback(userId, rec.recKey, rec.tags?.[0], false);
    onDismiss(rec.recKey);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col">
      {rec.type === "destination" && rec.image ? (
        <img
          src={rec.image}
          alt={rec.title}
          className="w-full h-32 object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      ) : (
        <div className="h-20 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
          {rec.type === "flight" ? (
            <Plane className="w-8 h-8 text-white" />
          ) : rec.type === "hotel" ? (
            <Building2 className="w-8 h-8 text-white" />
          ) : (
            <MapPin className="w-8 h-8 text-white" />
          )}
        </div>
      )}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-1">
          <h3 className="font-bold text-sm">{rec.title}</h3>
          <div className="relative">
            <button
              onClick={() => setShowReason((v) => !v)}
              title={rec.reason}
              className="text-gray-400 hover:text-blue-600"
            >
              <Info className="w-4 h-4" />
            </button>
            {showReason && (
              <div className="absolute right-0 top-6 z-20 w-52 bg-gray-900 text-white text-xs rounded-lg p-2 shadow-lg">
                <p className="font-semibold mb-1">Why this recommendation?</p>
                {rec.reason}
              </div>
            )}
          </div>
        </div>
        <p className="text-xs text-gray-500">{rec.subtitle}</p>
        {rec.price > 0 && (
          <p className="text-sm font-bold mt-1">
            ₹{rec.price.toLocaleString("en-IN")}
          </p>
        )}
        <p className="text-[11px] text-blue-600 italic mt-1 line-clamp-2">
          {rec.reason}
        </p>

        <div className="mt-auto pt-3">
          <button
            onClick={explore}
            className="w-full bg-blue-600 text-white text-sm py-2 rounded-lg hover:bg-blue-700"
          >
            {rec.type === "destination" ? "Explore" : "Book Now"}
          </button>
          <div className="flex items-center justify-center gap-4 mt-2 text-xs text-gray-400">
            {feedback === "helpful" ? (
              <span className="text-green-600">Thanks for your feedback!</span>
            ) : (
              <>
                <button
                  onClick={helpful}
                  className="flex items-center gap-1 hover:text-green-600"
                >
                  <ThumbsUp className="w-3.5 h-3.5" /> Helpful
                </button>
                <button
                  onClick={irrelevant}
                  className="flex items-center gap-1 hover:text-red-600"
                >
                  <ThumbsDown className="w-3.5 h-3.5" /> Not relevant
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Recommendations() {
  const user = useSelector((s: any) => s.user.user);
  const userId = user?.id || user?._id;
  const router = useRouter();
  const [recs, setRecs] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);

  const load = async () => {
    const d = await getrecommendations(userId);
    setRecs(Array.isArray(d) ? d : []);
    setLoaded(true);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const dismiss = (key: string) =>
    setRecs((prev) => prev.filter((r) => r.recKey !== key));

  if (loaded && recs.length === 0) return null;

  return (
    <section className="my-10">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-6 h-6 text-yellow-400" />
        <h2 className="text-2xl font-bold text-white">
          {user ? "Recommended for You" : "Popular Picks"}
        </h2>
      </div>
      {!loaded ? (
        <p className="text-white/80">Personalizing your recommendations...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recs.map((r) => (
            <RecCard
              key={r.recKey}
              rec={r}
              userId={userId}
              onDismiss={dismiss}
              router={router}
            />
          ))}
        </div>
      )}
    </section>
  );
}
