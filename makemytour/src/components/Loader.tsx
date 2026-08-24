import { Loader2 } from "lucide-react";
import React from "react";

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-3">
      <Loader2 className="animate-spin w-16 h-16 text-blue-600" />
      <p className="text-gray-500 text-sm">
        Loading... the first load can take a few seconds while the server wakes up.
      </p>
    </div>
  );
};

export default Loader;
