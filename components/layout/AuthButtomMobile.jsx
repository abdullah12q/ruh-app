import { LogIn, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AuthButtomMobile({
  status,
  user,
  signOut,
  setMobileOpen,
}) {
  return (
    <div className="mt-auto">
      {status === "authenticated" ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5">
            {user?.image ? (
              <Image
                src={user.image}
                alt={user.name || "User"}
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="size-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center font-bold text-accent text-sm">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>
            )}
            <div className="truncate">
              <p className="text-sm font-semibold text-text-primary truncate">
                {user?.name}
              </p>
              <p className="text-xs text-text-secondary truncate">
                {user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setMobileOpen(false);
              signOut();
            }}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-text-primary font-semibold font-jakarta hover:bg-white/10 transition-all duration-200 cursor-pointer"
          >
            <LogOut size={16} className="text-accent" />
            Sign Out
          </button>
        </div>
      ) : status === "loading" ? (
        <div className="h-12 w-full rounded-xl bg-white/5 animate-pulse" />
      ) : (
        <Link
          href="/auth/signin"
          onClick={() => setMobileOpen(false)}
          className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-accent text-white font-semibold font-jakarta hover:opacity-90 transition-all duration-200"
        >
          <LogIn size={16} />
          Sign In
        </Link>
      )}
    </div>
  );
}
