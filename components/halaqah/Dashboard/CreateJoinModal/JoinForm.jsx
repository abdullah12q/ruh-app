export default function JoinForm({ code, setCode }) {
  return (
    <div>
      <label
        htmlFor="invite-code"
        className="block text-xs font-semibold font-jakarta text-text-secondary mb-1.5 uppercase tracking-wider"
      >
        Invite Code
      </label>
      <input
        id="invite-code"
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        placeholder="e.g. A3F9KX"
        maxLength={6}
        spellCheck={false}
        className="w-full glass rounded-xl px-4 py-3 text-center text-2xl font-mono font-bold tracking-[0.5em] text-accent placeholder-text-secondary/40 placeholder:tracking-normal focus:outline-none focus:border-accent! transition-colors duration-500 uppercase"
      />
      <p className="text-xs text-text-secondary font-inter mt-1.5 text-center">
        6-character code from your circle admin
      </p>
    </div>
  );
}
