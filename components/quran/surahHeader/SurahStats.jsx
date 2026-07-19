import {
  BookOpen,
  MapPin,
  Sparkles,
  Layers,
  FileText,
  Type,
} from "lucide-react";
import { Stat } from "./Stat";

export function SurahStats({ surah, surahInfo, startJuz, endJuz }) {
  return (
    <div className="glass-light mx-auto flex max-w-lg flex-wrap items-stretch justify-center divide-x divide-y divide-(--surface-glass-border) overflow-hidden rounded-2xl">
      <Stat icon={BookOpen} label="Verses" value={surah.verses_count} />
      <Stat
        icon={MapPin}
        label="Revealed"
        value={surah.revelation_place}
        capitalize
      />
      {startJuz && (
        <Stat
          icon={Layers}
          label="Juz"
          value={startJuz === endJuz ? startJuz : `${startJuz} - ${endJuz}`}
        />
      )}
      <Stat
        icon={FileText}
        label={surah.pages?.[0] === surah.pages?.[1] ? "Page" : "Pages"}
        value={
          surah.pages?.[0] === surah.pages?.[1]
            ? surah.pages?.[0]
            : `${surah.pages?.[0]} - ${surah.pages?.[1]}`
        }
      />
      {surah.revelation_order && (
        <Stat icon={Sparkles} label="Order" value={surah.revelation_order} />
      )}
      {surahInfo?.words_count?.value && (
        <Stat icon={Type} label="Words" value={surahInfo.words_count.value} />
      )}
    </div>
  );
}
