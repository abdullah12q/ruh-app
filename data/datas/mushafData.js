export function groupWordsByLine(verses) {
  const lines = new Map();

  for (const verse of verses) {
    if (!verse.words || verse.words.length === 0) continue;

    for (const word of verse.words) {
      const lineNum = word.line_number;
      if (!lineNum) continue; // guard against malformed data

      const enrichedWord = {
        // Text
        text: word.text_qpc_hafs ?? word.text ?? "",

        // Parent verse identity
        verse_key: verse.verse_key,
        verse_number: verse.verse_number,

        // Positional metadata
        line_number: lineNum,
        position: word.position ?? 0,

        // "word" for normal Arabic tokens, "end" for the ۝ ayah number ornament
        char_type: word.char_type_name ?? "word",
      };

      if (!lines.has(lineNum)) {
        lines.set(lineNum, []);
      }
      lines.get(lineNum).push(enrichedWord);
    }
  }

  // Return a sorted Map to be ascending line order
  return new Map([...lines.entries()].sort((a, b) => a[0] - b[0]));
}

export function derivePageRange(verses) {
  if (!verses || verses.length === 0) {
    return { firstPage: 1, lastPage: 1 };
  }

  let firstPage = Infinity;
  let lastPage = -Infinity;

  for (const verse of verses) {
    const p = verse.page_number;
    if (typeof p !== "number") continue;
    if (p < firstPage) firstPage = p;
    if (p > lastPage) lastPage = p;
  }

  if (firstPage === Infinity) return { firstPage: 1, lastPage: 1 };

  return { firstPage, lastPage };
}

export function buildVerseToPageMap(verses) {
  const map = new Map();
  for (const verse of verses ?? []) {
    if (
      typeof verse.verse_number === "number" &&
      typeof verse.page_number === "number"
    ) {
      map.set(verse.verse_number, verse.page_number);
    }
  }
  return map;
}

const ARABIC_NUMBERS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

export function toArabicNumbers(value) {
  return String(value)
    .split("")
    .map((ch) => (/\d/.test(ch) ? ARABIC_NUMBERS[Number(ch)] : ch))
    .join("");
}
