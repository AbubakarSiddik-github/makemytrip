import React, { useEffect, useState } from "react";
import { Star, ThumbsUp, Flag, MessageSquare, ImagePlus } from "lucide-react";
import { useSelector } from "react-redux";
import {
  getreviews,
  addreview,
  addreviewreply,
  markreviewhelpful,
  flagreview,
} from "@/api";

const fileToResizedDataUrl = (file: File): Promise<string> =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const img = new window.Image();
      img.onload = () => {
        const max = 800;
        let w = img.width;
        let h = img.height;
        if (w > max || h > max) {
          if (w > h) {
            h = (h * max) / w;
            w = max;
          } else {
            w = (w * max) / h;
            h = max;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (ctx) ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });

const Stars = ({ value, px = 16 }: any) => (
  <span className="inline-flex">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        size={px}
        className={
          i <= value ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }
      />
    ))}
  </span>
);

const StarInput = ({ value, onChange }: any) => (
  <span className="inline-flex gap-1">
    {[1, 2, 3, 4, 5].map((i) => (
      <button key={i} type="button" onClick={() => onChange(i)}>
        <Star
          size={24}
          className={
            i <= value ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }
        />
      </button>
    ))}
  </span>
);

export default function Reviews({ itemId, itemType }: any) {
  const user = useSelector((state: any) => state.user.user);
  const [reviews, setReviews] = useState<any[]>([]);
  const [sort, setSort] = useState("helpful");
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [replyOpen, setReplyOpen] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    if (!itemId) return;
    const data = await getreviews(itemId, itemType, sort);
    setReviews(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId, itemType, sort]);

  const count = reviews.length;
  const avg = count ? reviews.reduce((s, r) => s + r.rating, 0) / count : 0;
  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    n: reviews.filter((r) => r.rating === star).length,
  }));

  const userName = () =>
    (((user?.firstName || "") + " " + (user?.lastName || "")).trim() ||
      "Traveler");

  const onPhotoChange = async (e: any) => {
    const files = Array.from(e.target.files || []).slice(0, 4 - photos.length);
    const urls: string[] = [];
    for (const f of files as any[]) {
      urls.push(await fileToResizedDataUrl(f));
    }
    setPhotos((p) => [...p, ...urls].slice(0, 4));
  };

  const submitReview = async () => {
    if (!user) {
      alert("Please log in to write a review.");
      return;
    }
    if (!rating) {
      alert("Please select a star rating.");
      return;
    }
    if (!text.trim()) {
      alert("Please write your review.");
      return;
    }
    setSubmitting(true);
    const res = await addreview({
      itemId,
      itemType,
      userId: user.id || user._id,
      userName: userName(),
      rating,
      text: text.trim(),
      photos,
    });
    setSubmitting(false);
    if (res) {
      setRating(0);
      setText("");
      setPhotos([]);
      load();
    } else {
      alert("Could not submit review. Make sure the backend is running.");
    }
  };

  const doHelpful = async (id: string) => {
    await markreviewhelpful(id);
    load();
  };
  const doFlag = async (id: string) => {
    await flagreview(id);
    alert("Thanks. This review has been reported to our moderators.");
    load();
  };
  const submitReply = async (id: string) => {
    if (!user) {
      alert("Please log in to reply.");
      return;
    }
    if (!replyText.trim()) return;
    await addreviewreply(id, {
      userId: user.id || user._id,
      userName: userName(),
      text: replyText.trim(),
    });
    setReplyText("");
    setReplyOpen(null);
    load();
  };

  const fmt = (iso: string) => {
    const d = new Date(iso);
    return isNaN(d.getTime())
      ? ""
      : d.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-bold mb-4">Reviews &amp; Ratings</h2>

      {/* Summary */}
      <div className="flex flex-col sm:flex-row gap-6 mb-6">
        <div className="text-center">
          <div className="text-4xl font-bold">{avg.toFixed(1)}</div>
          <Stars value={Math.round(avg)} px={18} />
          <div className="text-sm text-gray-500 mt-1">
            {count} review{count !== 1 ? "s" : ""}
          </div>
        </div>
        <div className="flex-1">
          {dist.map((d) => (
            <div key={d.star} className="flex items-center gap-2 text-xs mb-1">
              <span className="w-12">{d.star} star</span>
              <div className="flex-1 h-2 bg-gray-100 rounded">
                <div
                  className="h-2 bg-yellow-400 rounded"
                  style={{ width: (count ? (d.n / count) * 100 : 0) + "%" }}
                />
              </div>
              <span className="w-6 text-right">{d.n}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Write review */}
      {user ? (
        <div className="border rounded-lg p-4 mb-6 bg-gray-50">
          <h3 className="font-semibold mb-2">Write a review</h3>
          <StarInput value={rating} onChange={setRating} />
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share details of your experience..."
            className="w-full border rounded-lg p-2 mt-2 text-sm"
            rows={3}
          />
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <label className="flex items-center gap-1 text-sm text-blue-600 cursor-pointer">
              <ImagePlus className="w-4 h-4" /> Add photos
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={onPhotoChange}
              />
            </label>
            {photos.map((p, i) => (
              <div key={i} className="relative">
                <img src={p} className="w-12 h-12 object-cover rounded" alt="" />
                <button
                  onClick={() => setPhotos(photos.filter((_, j) => j !== i))}
                  className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={submitReview}
            disabled={submitting}
            className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      ) : (
        <p className="text-sm text-gray-500 mb-6">Log in to write a review.</p>
      )}

      {/* Sort */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-600">
          {count} review{count !== 1 ? "s" : ""}
        </span>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border rounded-lg px-2 py-1 text-sm"
        >
          <option value="helpful">Most Helpful</option>
          <option value="newest">Newest</option>
          <option value="highest">Highest Rated</option>
          <option value="lowest">Lowest Rated</option>
        </select>
      </div>

      {/* List */}
      {count === 0 ? (
        <p className="text-gray-500 text-sm">
          No reviews yet. Be the first to review!
        </p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="border-b pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold">
                    {(r.userName || "?").charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{r.userName}</p>
                    <Stars value={r.rating} px={14} />
                  </div>
                </div>
                <span className="text-xs text-gray-400">
                  {fmt(r.createdAt)}
                </span>
              </div>
              <p className="text-sm text-gray-700 mt-2">{r.text}</p>
              {r.photos && r.photos.length > 0 && (
                <div className="flex gap-2 mt-2 flex-wrap">
                  {r.photos.map((p: string, i: number) => (
                    <img
                      key={i}
                      src={p}
                      onClick={() => setLightbox(p)}
                      className="w-16 h-16 object-cover rounded cursor-pointer"
                      alt=""
                    />
                  ))}
                </div>
              )}
              <div className="flex items-center gap-4 mt-2 text-xs">
                <button
                  onClick={() => doHelpful(r.id)}
                  className="flex items-center gap-1 text-gray-500 hover:text-blue-600"
                >
                  <ThumbsUp className="w-3.5 h-3.5" /> Helpful ({r.helpfulCount})
                </button>
                <button
                  onClick={() =>
                    setReplyOpen(replyOpen === r.id ? null : r.id)
                  }
                  className="flex items-center gap-1 text-gray-500 hover:text-blue-600"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> Reply
                </button>
                <button
                  onClick={() => doFlag(r.id)}
                  className="flex items-center gap-1 text-gray-500 hover:text-red-600"
                >
                  <Flag className="w-3.5 h-3.5" /> Report
                </button>
              </div>

              {r.replies && r.replies.length > 0 && (
                <div className="ml-6 mt-2 space-y-2 border-l pl-3">
                  {r.replies.map((rp: any, i: number) => (
                    <div key={i} className="text-sm">
                      <span className="font-semibold">{rp.userName}</span>{" "}
                      <span className="text-gray-400 text-xs">
                        {fmt(rp.createdAt)}
                      </span>
                      <p className="text-gray-700">{rp.text}</p>
                    </div>
                  ))}
                </div>
              )}
              {replyOpen === r.id && (
                <div className="ml-6 mt-2 flex gap-2">
                  <input
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a reply..."
                    className="flex-1 border rounded-lg px-2 py-1 text-sm"
                  />
                  <button
                    onClick={() => submitReply(r.id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm"
                  >
                    Post
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {lightbox && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <img
            src={lightbox}
            className="max-h-[80vh] max-w-full rounded-lg"
            alt=""
          />
        </div>
      )}
    </div>
  );
}
