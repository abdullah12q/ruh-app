import { Loader2 } from "lucide-react";
import { useMushafPage } from "@/lib/queries/quran";
import { useSurahPlayback } from "@/lib/context/SurahPlaybackProvider";
import MushafFrame from "./MushafFrame";
import MushafPage from "../mushafPage/MushafPage";

export default function PageLoader({ pageNumber }) {
  const { surahId } = useSurahPlayback();
  const { data: verses, isLoading, isError } = useMushafPage(pageNumber);

  const versesInPage = verses?.filter(
    (verse) => verse.verse_key.split(":")[0] === String(surahId),
  );

  if (isLoading) {
    return (
      <MushafFrame surahId={surahId} versesInPage={versesInPage ?? []}>
        <div className="animate-pulse space-y-5">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="h-8 rounded-full bg-(--surface-glass-border)"
              style={{ width: `${85 + Math.sin(i) * 10}%`, marginLeft: "auto" }}
            />
          ))}
        </div>
        <div className="flex justify-center pt-6">
          <Loader2 className="size-4 text-accent animate-spin" />
        </div>
      </MushafFrame>
    );
  }

  if (isError) {
    return (
      <MushafFrame surahId={surahId} versesInPage={versesInPage ?? []}>
        <p className="text-text-secondary text-sm font-jakarta text-center py-6">
          Failed to load page {pageNumber}. Please check your connection.
        </p>
      </MushafFrame>
    );
  }

  return (
    <MushafFrame surahId={surahId} versesInPage={versesInPage ?? []}>
      <MushafPage versesInPage={versesInPage ?? []} pageNumber={pageNumber} />
    </MushafFrame>
  );
}
