import { RefreshCw } from "lucide-react";

export default function RefreshButton({ onClick, isLoading }) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`p-2 rounded-lg transition-colors ${
        isLoading
          ? "text-accent/50 cursor-not-allowed"
          : "hover:bg-white/10 text-text-secondary hover:text-text-primary cursor-pointer"
      }`}
      title="Refresh Stream"
    >
      <RefreshCw
        className={`size-4 sm:size-4.5 ${isLoading && "animate-spin"}`}
      />
    </button>
  );
}
