// Helper to format numbers to 3 digits (e.g., 2 -> "002") 3shan el external api 3aiz el format keda : 002255.mp3 not 2255.mp3
export function formatAudioFileName(surah, ayah) {
  if (!surah || !ayah) return "";
  const paddedSurah = String(surah).padStart(3, "0");
  const paddedAyah = String(ayah).padStart(3, "0");
  return `${paddedSurah}${paddedAyah}.mp3`;
}

// Helper to format seconds into mm:ss
export function formatTime(time) {
  if (isNaN(time)) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
