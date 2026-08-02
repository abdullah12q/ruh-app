import { LogIn, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AuthButtomDesktop({ status, user, signOut }) {
  return status === "authenticated" ? (
    <div className="hidden lg:flex items-center gap-3">
      {user?.image ? (
        <Image
          src={user.image}
          alt={user.name || "User"}
          width={32}
          height={32}
          className="rounded-full object-cover"
        />
      ) : (
        <div className="size-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center font-bold text-accent text-sm">
          {user?.name?.[0]?.toUpperCase() || "U"}
        </div>
      )}
      <button
        onClick={() => signOut()}
        className="flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-accent transition-all duration-200 cursor-pointer"
      >
        <LogOut size={14} />
        Sign Out
      </button>
    </div>
  ) : status === "loading" ? (
    <div className="hidden lg:block size-8 rounded-full bg-white/5 animate-pulse" />
  ) : (
    <Link
      href="/auth/signin"
      className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-white text-sm font-semibold font-jakarta hover:opacity-90 active:scale-95 transition-all duration-200"
    >
      <LogIn size={15} />
      Sign In
    </Link>
  );
}
