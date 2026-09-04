import { LogOut, Mail, ShieldCheck, LogIn } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function AccountSection({ onClose }) {
  const { data: session } = useSession();
  const user = session?.user;

  async function handleSignOut() {
    onClose();
    await signOut({ callbackUrl: "/" });
  }

  if (!user) {
    return (
      <div className="px-5 py-4 space-y-3">
        {/* Section Title */}
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-lg bg-text-secondary/10 flex items-center justify-center">
            <ShieldCheck size={13} className="text-text-secondary" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-text-secondary">
            Account
          </span>
        </div>

        {/* Sign In prompt */}
        <Link
          href="/auth/signin"
          onClick={onClose}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-accent/20 bg-accent/5 text-accent hover:bg-accent/15 hover:border-accent/40 text-sm font-semibold font-jakarta transition-all duration-400"
        >
          <LogIn size={15} />
          Sign In to Your Account
        </Link>
      </div>
    );
  }

  return (
    <div className="px-5 py-4 space-y-3">
      {/* Section Title */}
      <div className="flex items-center gap-2">
        <div className="size-7 rounded-lg bg-accent/10 flex items-center justify-center">
          <ShieldCheck size={13} className="text-accent" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-text-secondary">
          Account
        </span>
      </div>

      {/* Email row */}
      <div className="glass rounded-xl px-4 py-3 flex items-center gap-3">
        <Mail size={14} className="text-text-secondary shrink-0" />
        <p className="text-sm text-text-primary truncate flex-1">
          {user.email}
        </p>
      </div>

      {/* Sign Out */}
      <button
        onClick={handleSignOut}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-400 hover:bg-rose-500/15 hover:border-rose-500/40 text-sm font-semibold font-jakarta transition-all duration-400 cursor-pointer"
        aria-label="Sign out of your account"
      >
        <LogOut size={15} />
        Sign Out
      </button>
    </div>
  );
}
