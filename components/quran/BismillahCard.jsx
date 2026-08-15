export default function BismillahCard({ surahId }) {
  // hide bismillah card for surah 1 and 9 ely hya al-fatiha w at-tawbah
  if (surahId === 1 || surahId === 9) return null;

  return (
    <div className="glass rounded-2xl p-6 text-center mb-6">
      <p
        className="font-quran text-[15px] sm:text-4xl text-center! text-text-secondary"
        dir="rtl"
        lang="ar"
      >
        بِــــــــسْــــــــمِ ٱللَّهِ ٱلرَّحْمَــــــــٰنِ
        ٱلرَّحِــــــــيــــــــمِ
      </p>
    </div>
  );
}
