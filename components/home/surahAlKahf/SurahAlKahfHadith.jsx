export default function SurahAlKahfHadith({ kahfContent }) {
  return (
    <div className="text-center mb-6">
      <p
        className="font-arabic-ui text-xl sm:text-2xl text-text-primary leading-loose mb-4"
        dir="rtl"
        lang="ar"
      >
        {kahfContent.hadith.arabic}
      </p>

      {/* Divider */}
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-amber-400/20" />
        <span className="text-amber-400/50 text-xs">✦</span>
        <div className="flex-1 h-px bg-amber-400/20" />
      </div>

      <p className="font-jakarta text-text-secondary text-base sm:text-lg leading-relaxed italic">
        {kahfContent.hadith.english}
      </p>
    </div>
  );
}
