export default function RatingBadge({ id }: any) {
  const seed = String(id || "")
    .split("")
    .reduce((a: number, c: string) => a + c.charCodeAt(0), 0);
  const rating = (3.8 + (seed % 11) / 10).toFixed(1);
  const count = 20 + (seed % 480);
  const r = Number(rating);
  const label = r >= 4.5 ? "Excellent" : r >= 4.2 ? "Very Good" : "Good";
  return (
    <span className="inline-flex items-center gap-1 text-xs mt-1">
      <span className="bg-blue-600 text-white font-bold px-1.5 py-0.5 rounded">
        {rating}
      </span>
      <span className="text-gray-600">
        {label} · {count} reviews
      </span>
    </span>
  );
}
