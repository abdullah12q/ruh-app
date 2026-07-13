import { SurahTraditionalCommentary } from "./SurahTraditionalCommentary";

export function SurahExpandablePanel({ expanded, surahContext, surahInfo }) {
  return (
    <div
      className={`grid transition-[grid-template-rows] duration-500 ease-out ${
        expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
      }`}
    >
      <div className="overflow-hidden">
        <div className="mt-6 space-y-6 border-t border-(--surface-glass-border) pt-6 text-left">
          {/* Arabic summary */}
          {surahContext?.summary && (
            <p
              dir="rtl"
              lang="ar"
              className="text-right font-arabic-ui text-lg leading-loose text-text-primary"
            >
              {surahContext.summary}
            </p>
          )}

          {/* Revelation reason english w arabic */}
          {(surahContext?.revelation_reason_english ||
            surahContext?.revelation_reason) && (
            <div className="grid gap-4 sm:grid-cols-2">
              {surahContext?.revelation_reason_english && (
                <div className="rounded-2xl bg-(--surface-glass) p-4">
                  <p className="mb-2 block font-jakarta text-[10px] uppercase tracking-[0.2em] text-text-secondary/60">
                    Occasion of Revelation
                  </p>
                  <p className="font-inter text-sm leading-relaxed text-text-primary">
                    {surahContext.revelation_reason_english}
                  </p>
                </div>
              )}
              {surahContext?.revelation_reason && (
                <div className="rounded-2xl bg-(--surface-glass) p-4 font-arabic-ui">
                  <p
                    dir="rtl"
                    className="mb-2 block text-right text-sm tracking-[0.2em] text-text-secondary/60"
                  >
                    سبب النزول
                  </p>
                  <p
                    dir="rtl"
                    lang="ar"
                    className="text-right text-base leading-relaxed text-text-primary"
                  >
                    {surahContext.revelation_reason}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Other names */}
          {surahContext?.other_names?.length > 0 && (
            <div className="flex flex-wrap flex-col items-center justify-center gap-2 pt-2">
              <p className="font-jakarta text-[10px] uppercase tracking-[0.2em] text-text-secondary/60">
                Also Known As
              </p>
              {surahContext.other_names.map((name) => (
                <p
                  key={name}
                  dir="rtl"
                  lang="ar"
                  className="font-arabic-ui text-sm text-text-primary"
                >
                  {name}
                </p>
              ))}
            </div>
          )}

          {/* Traditional commentary */}
          <SurahTraditionalCommentary surahInfo={surahInfo} />
        </div>
      </div>
    </div>
  );
}
