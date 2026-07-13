import { useState, useMemo } from "react";

export const TABS = [
  { key: "introduction", label: "Overview", labelAr: "نبذة مختصرة" },
  { key: "grace", label: "Virtues", labelAr: "فضائلها" },
  { key: "topics", label: "Topics", labelAr: "موضوعاتها" },
  { key: "purposes", label: "Purposes", labelAr: "مقاصدها" },
  { key: "asmaoha", label: "Names", labelAr: "أسماؤها" },
  { key: "prophet", label: "Prophetic Practice", labelAr: "الهدي النبوي" },
  { key: "revelation", label: "Revelation", labelAr: "أسباب النزول" },
];

export function SurahTraditionalCommentary({ surahInfo }) {
  const availableTabs = useMemo(
    () => TABS.filter((tab) => surahInfo?.[tab.key]?.value),
    [surahInfo],
  );
  const [activeTab, setActiveTab] = useState(null);
  const currentTabKey = activeTab ?? availableTabs[0]?.key;
  const activeContent = surahInfo?.[currentTabKey]?.value;

  if (availableTabs.length === 0) return null;

  return (
    <div className="border-t border-(--surface-glass-border) pt-6">
      <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
        <p className="font-jakarta text-[10px] uppercase tracking-[0.2em] text-text-secondary/50">
          Traditional Commentary
        </p>
        <p className="text-xs opacity-40">•</p>
        <p
          className="font-arabic-ui text-[12px] text-text-secondary/50"
          dir="rtl"
        >
          التفسير التقليدي
        </p>
      </div>

      {/* Tab selector */}
      <div className="mb-5 flex flex-wrap items-center justify-center gap-2">
        {availableTabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-full px-3.5 py-1.5 text-xs tracking-wide transition-colors cursor-pointer flex items-center gap-2 ${
              currentTabKey === tab.key
                ? "bg-accent text-background"
                : "bg-(--surface-glass) text-text-secondary hover:text-text-primary"
            }`}
          >
            <p className="font-jakarta">{tab.label}</p>
            <p className="opacity-40">•</p>
            <p className="font-arabic-ui text-[11px]" dir="rtl">
              {tab.labelAr}
            </p>
          </button>
        ))}
      </div>

      {/* Active tab content */}
      {activeContent && (
        <div
          dir="rtl"
          lang="ar"
          className="rounded-2xl bg-(--surface-glass) p-5 text-right font-arabic-ui text-base leading-loose text-text-secondary [&_p]:mb-4 [&_p:last-child]:mb-0 [&_span]:font-arabic-ui! [&_span]:text-accent"
          dangerouslySetInnerHTML={{ __html: activeContent }}
        />
      )}
    </div>
  );
}
