import AyahCard from "./AyahCard";

export default function AyahList({ verses, surahId }) {
  return (
    <div className="space-y-4">
      {verses.map((ayah) => (
        <AyahCard key={ayah.id} ayah={ayah} surahId={surahId} />
      ))}
    </div>
  );
}
