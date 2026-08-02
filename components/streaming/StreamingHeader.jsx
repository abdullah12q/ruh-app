import { motion } from "framer-motion";

export default function StreamingHeader({
  isRadio,
  radioStations,
  liveChannels,
}) {
  const content = isRadio
    ? {
        bgText: "الإذاعة",
        bgClasses: "top-[60%] sm:top-10 text-[6rem] sm:text-[9rem]",
        badge: "Live Streaming",
        titlePrefix: "Islamic",
        titleHighlight: "Radio",
        titleArabic: "الإذاعة",
        description: `${radioStations.length} stations streaming live Quran & Islamic content 24/7`,
      }
    : {
        bgText: "البث المباشر",
        bgClasses: "top-[60%] sm:top-0 text-[4rem] sm:text-[9rem]",
        badge: "Live Now",
        titlePrefix: "Live",
        titleHighlight: "TV",
        titleArabic: "البث المباشر",
        description: `${liveChannels.length} Islamic channels streaming live 24/7`,
      };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", damping: 20 }}
      className="relative text-center mb-10"
    >
      {/* Decorative Arabic background text */}
      <span
        className={`font-quran pointer-events-none select-none absolute left-1/2 -translate-x-1/2 text-accent/4 whitespace-nowrap -z-10 ${content.bgClasses}`}
        dir="rtl"
        lang="ar"
        aria-hidden="true"
      >
        {content.bgText}
      </span>

      {/* Live Indicator Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-accent text-xs font-semibold tracking-wider uppercase mb-6">
        <span className="relative flex items-center">
          <span className="size-1.5 rounded-full bg-red-400 animate-ping absolute" />
          <span className="size-1.5 rounded-full bg-red-400 relative" />
        </span>
        {content.badge}
      </div>

      {/* Main Title */}
      <h1 className="font-jakarta font-extrabold text-4xl sm:text-5xl text-text-primary mb-4">
        {content.titlePrefix}{" "}
        <span className="gradient-text">{content.titleHighlight}</span>{" "}
        <span className="font-arabic-ui text-accent" dir="rtl" lang="ar">
          {content.titleArabic}
        </span>
      </h1>

      {/* Subtitle / Item Count */}
      <p className="font-inter text-text-secondary text-lg max-w-xl mx-auto">
        {content.description}
      </p>
    </motion.div>
  );
}
