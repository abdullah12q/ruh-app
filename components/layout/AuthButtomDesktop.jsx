import { UserRound } from "lucide-react";
import Image from "next/image";

export default function AuthButtomDesktop({ status, user, onOpenProfile }) {
  return status === "authenticated" ? (
    <div className="hidden lg:flex items-center gap-3">
      <button
        onClick={onOpenProfile}
        aria-label="Open profile"
        className="relative group cursor-pointer"
        title={`Open profile — ${user?.name ?? "User"}`}
      >
        {user?.image ? (
          <Image
            src={user.image}
            alt={user.name || "User"}
            width={34}
            height={34}
            className="rounded-full object-cover ring-2 ring-transparent group-hover:ring-accent/50 transition-all duration-200"
          />
        ) : (
          <div className="size-8.5 rounded-full bg-accent/10 border border-accent/20 group-hover:border-accent/40 flex items-center justify-center font-bold text-accent text-sm transition-all duration-200">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
        )}
        {/* Hover tooltip */}
        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium text-text-secondary bg-background border border-text-secondary/10 rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
          Profile
        </span>
      </button>
    </div>
  ) : status === "loading" ? (
    <div className="hidden lg:block size-8 rounded-full bg-text-secondary/5 animate-pulse" />
  ) : (
    <div className="hidden lg:flex items-center gap-3">
      <button
        onClick={onOpenProfile}
        aria-label="Open profile"
        className="relative group cursor-pointer"
        title="Guest — open profile"
      >
        <div className="size-8.5 rounded-full bg-text-secondary/10 border border-text-secondary/20 group-hover:border-accent/40 group-hover:bg-accent/10 flex items-center justify-center transition-all duration-400">
          <UserRound
            size={16}
            className="text-text-secondary group-hover:text-accent transition-colors duration-400"
          />
        </div>
        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium text-text-secondary bg-background border border-text-secondary/10 rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
          Profile
        </span>
      </button>
    </div>
  );
}
