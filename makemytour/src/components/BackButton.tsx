import { useRouter } from "next/router";
import { ArrowLeft, Home } from "lucide-react";

export default function BackButton({ label = "Back" }: any) {
  const router = useRouter();
  return (
    <div className="flex items-center gap-4 mb-4">
      <button
        onClick={() =>
          window.history.length > 1 ? router.back() : router.push("/")
        }
        className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-blue-600"
      >
        <ArrowLeft className="w-4 h-4" /> {label}
      </button>
      <button
        onClick={() => router.push("/")}
        className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-blue-600"
      >
        <Home className="w-4 h-4" /> Home
      </button>
    </div>
  );
}
