import Image from "next/image";
import { useSession } from "next-auth/react";
import { User, LogIn } from "lucide-react";
import Link from "next/link";

export default function ProfileHeader({ onClose }) {
  const { data: session, status } = useSession();
  const user = session?.user;

  const isGuest = status !== "loading" && !user;

  return (
    <div className="px-6 py-5">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="relative shrink-0">
          {user?.image ? (
            <Image
              src={user.image}
              alt={user.name || "User"}
              width={64}
              height={64}
              className="rounded-2xl object-cover ring-2 ring-accent/30"
            />
          ) : (
            <div
              className={`size-16 rounded-2xl flex items-center justify-center ${isGuest ? "bg-text-secondary/10 border-2 border-text-secondary/20" : "bg-accent/10 border-2 border-accent/20"}`}
            >
              {user?.name ? (
                <span className="text-2xl font-extrabold text-accent font-jakarta">
                  {user.name[0].toUpperCase()}
                </span>
              ) : (
                <User
                  size={28}
                  className={isGuest ? "text-text-secondary" : "text-accent"}
                />
              )}
            </div>
          )}

          {/* Online / guest dot */}
          <span
            className={`absolute -bottom-1 -right-1 size-3.5 rounded-full border-2 border-background ${
              isGuest ? "bg-text-secondary/40" : "bg-emerald-500"
            }`}
          />
        </div>

        {/* Name & Email / Guest prompt */}
        <div className="flex-1 min-w-0">
          {isGuest ? (
            <>
              <p className="text-base font-bold font-jakarta text-text-primary">
                Guest
              </p>
              <p className="text-xs text-text-secondary mt-0.5">
                Sign in to unlock all features
              </p>
              <Link
                href="/auth/signin"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-lg bg-accent text-white text-xs font-semibold font-jakarta hover:opacity-90 active:scale-95 transition-all duration-400"
              >
                <LogIn size={12} />
                Sign In
              </Link>
            </>
          ) : (
            <>
              <p className="text-base font-bold font-jakarta text-text-primary truncate">
                {user?.name ?? "User"}
              </p>
              <p className="text-xs text-text-secondary truncate mt-0.5">
                {user?.email ?? ""}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
