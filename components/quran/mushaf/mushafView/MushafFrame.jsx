import CornerSvg from "./CornerSvg";

export default function MushafFrame({ surahId, versesInPage, children }) {
  return (
    <div className="relative glass rounded-4xl overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-accent/50 to-transparent" />
      <CornerSvg position="top-left" />
      <CornerSvg position="top-right" />
      <CornerSvg position="bottom-right" />
      <CornerSvg position="bottom-left" />
      {versesInPage?.some((verse) => verse.verse_key === `${surahId}:1`) &&
        surahId !== 1 &&
        surahId !== 9 && (
          <>
            <p
              className="font-quran text-[15px] sm:text-4xl mt-3 sm:mt-0 text-center! text-text-secondary"
              dir="rtl"
              lang="ar"
            >
              بِــــــــسْــــــــمِ ٱللَّهِ ٱلرَّحْمَــــــــٰنِ
              ٱلرَّحِــــــــيــــــــمِ
            </p>
            <div className="h-px w-full bg-linear-to-r from-transparent via-accent/50 to-transparent mt-1" />
          </>
        )}
      <div className="relative px-4.5 sm:px-10 py-4 sm:py-3">{children}</div>
    </div>
  );
}
