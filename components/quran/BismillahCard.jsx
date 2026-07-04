export default function BismillahCard({ surahId }) {
  // hide bismillah card for surah 9 ely hya at-tawbah
  if (surahId === 9) return null;

  return (
    <div className="glass rounded-2xl p-6 text-center mb-6">
      <p
        className="font-quran text-2xl sm:text-3xl text-text-secondary"
        dir="rtl"
        lang="ar"
      >
        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
      </p>
    </div>
  );
}
