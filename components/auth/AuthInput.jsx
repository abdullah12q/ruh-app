import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function AuthInput({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  required,
  minLength,
  icon: Icon,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-semibold font-jakarta text-text-secondary mb-2"
      >
        {label}
      </label>
      <div className="relative">
        <Icon
          size={15}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary"
        />
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          minLength={minLength}
          className={`w-full glass rounded-xl pl-11 py-3 text-sm text-text-primary placeholder:text-text-secondary/50 font-inter transition-all duration-500 focus:outline-none focus:border-accent! ${
            isPassword ? "pr-12" : "pr-4"
          }`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 size-8 flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          >
            {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        )}
      </div>
    </div>
  );
}
