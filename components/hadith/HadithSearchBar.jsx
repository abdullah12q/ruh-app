import { Search } from "lucide-react";
import AnimatedSearchCloseIcon from "../AnimatedSearchCloseIcon";

export default function HadithSearchBar({
  margin,
  value,
  onChange,
  placeholder = "Search hadiths…",
}) {
  return (
    <div className={`relative max-w-lg mx-auto ${margin}`}>
      <Search
        size={16}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full glass rounded-full py-3 pl-11 pr-10 text-sm font-inter text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent/50! transition-colors duration-400"
      />
      <AnimatedSearchCloseIcon
        value={value}
        position="right-3"
        onChange={onChange}
      />
    </div>
  );
}
