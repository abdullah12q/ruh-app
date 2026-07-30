export default function SurahAlKahfSource({ kahfContent }) {
  return (
    <div className=" text-xs text-text-secondary/70 border-t border-white/10 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
      <p className="font-jakarta tracking-wide">
        {kahfContent.hadith.source.en}
      </p>
      <p className="font-arabic-ui" dir="rtl" lang="ar">
        {kahfContent.hadith.source.ar}
      </p>
    </div>
  );
}
