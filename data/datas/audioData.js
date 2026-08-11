// Helper to format numbers to 3 digits (e.g., 2 -> "002") 3shan el external api 3aiz el format keda : 002255.mp3 not 2255.mp3
export function formatAudioFileName(surah, ayah) {
  if (!surah || !ayah) return "";
  const paddedSurah = String(surah).padStart(3, "0");
  const paddedAyah = String(ayah).padStart(3, "0");
  return `${paddedSurah}${paddedAyah}.mp3`;
}

// Helper to format seconds into hh:mm:ss or mm:ss
export function formatTime(time) {
  if (isNaN(time)) return "0:00";

  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = Math.floor(time % 60);

  // If the audio is an hour or longer, include the hours in the format
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  // Otherwise, default to mm:ss
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

// Map moshaf_type codes to human-readable style labels
export function getMoshafStyle(moshafType) {
  const type = String(moshafType);
  if (type === "11")
    return {
      label: "Murattal",
      labelAr: "مرتل",
      color: "text-teal-400 bg-teal-400/10 border-teal-400/20",
    };
  if (type === "222")
    return {
      label: "Mujawwad",
      labelAr: "مجود",
      color: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    };
  if (type === "213")
    return {
      label: "Mu'allim",
      labelAr: "معلم",
      color: "text-purple-400 bg-purple-400/10 border-purple-400/20",
    };
  if (type === "14")
    return {
      label: "Distinguished",
      labelAr: "تلاوة مميزة",
      color: "text-rose-400 bg-rose-400/10 border-rose-400/20",
    };
  if (type.startsWith("2"))
    return {
      label: "Warsh",
      labelAr: "ورش",
      color: "text-orange-400 bg-orange-400/10 border-orange-400/20",
    };
  if (type.startsWith("5"))
    return {
      label: "Qalon",
      labelAr: "قالون",
      color: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    };
  if (type.startsWith("13"))
    return {
      label: "Ad-Duri",
      labelAr: "الدوري",
      color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    };
  return {
    label: "Recitation",
    labelAr: "تلاوة",
    color:
      "text-text-secondary bg-(--surface-glass) border-(--surface-glass-border)",
  };
}
