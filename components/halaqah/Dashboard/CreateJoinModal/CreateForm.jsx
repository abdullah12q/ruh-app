export default function CreateForm({ name, setName, goalDate, setGoalDate }) {
  return (
    <>
      {/* Circle Name */}
      <div>
        <label
          htmlFor="circle-name"
          className="block text-xs font-semibold font-jakarta text-text-secondary mb-1.5 uppercase tracking-wider"
        >
          Circle Name
        </label>
        <input
          id="circle-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Elsiefy Family Circle"
          className="w-full glass rounded-xl px-4 py-3 text-sm font-inter text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-accent! transition-colors duration-500"
        />
      </div>

      {/* Optional Khatm Goal */}
      <div>
        <label
          htmlFor="khatm-goal"
          className="block text-xs font-semibold font-jakarta text-text-secondary mb-1.5 uppercase tracking-wider"
        >
          Khatm Goal Date{" "}
          <span className="font-normal normal-case opacity-60">(optional)</span>
        </label>
        <input
          id="khatm-goal"
          type="date"
          value={goalDate}
          onChange={(e) => setGoalDate(e.target.value)}
          className="w-full glass rounded-xl px-4 py-3 text-sm font-inter text-text-primary focus:outline-none focus:border-accent! transition-colors duration-500"
        />
      </div>
    </>
  );
}
