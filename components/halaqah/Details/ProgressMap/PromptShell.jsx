import { Crosshair, X } from "lucide-react";

export default function PromptShell({ onDismiss, children }) {
  return (
    <div className="flex items-center gap-2 mx-4 my-2 px-3 py-2 rounded-xl bg-violet-500/10 border border-violet-500/25">
      <Crosshair size={12} className="text-violet-400 shrink-0" />
      {children}
      <button
        onClick={onDismiss}
        className="ml-auto text-violet-600 hover:text-violet-500 cursor-pointer"
      >
        <X size={12} />
      </button>
    </div>
  );
}
