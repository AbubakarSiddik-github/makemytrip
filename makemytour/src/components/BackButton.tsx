import { useRouter } from "next/router";
import { ArrowLeft } from "lucide-react";

export default function BackButton({ label = "Back" }: any) {
  const router = useRouter();
  return (
    <button
      onClick={() => (window.history.length > 1 ? router.back() : router.push("/"))}
      className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-blue-600 mb-4"
    >
      <ArrowLeft className="w-4 h-4" /> {label}
    </button>
  );
}
