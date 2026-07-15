export function calculateNextVerse(currentSurah, currentAyah, totalVerses) {
  let nextSurah = currentSurah;
  let nextAyah = currentAyah + 1;

  if (nextAyah > totalVerses) {
    nextSurah = currentSurah + 1 > 114 ? 1 : currentSurah + 1;
    nextAyah = 1;
  }

  return { surah: nextSurah, ayah: nextAyah };
}
