/**
 * Server-side Hadith data helpers.
 * Uses Node.js `fs` + `path` — these functions run ONLY in Server Components / Route Handlers.
 * Never import this file in any "use client" component.
 */

import fs from "fs";
import path from "path";
import { getBookById } from "@/data/datas/hadithData";

const DATA_ROOT = path.join(process.cwd(), "data", "jsons", "hadith");

/**
 * Resolve the absolute path to a book's JSON file.
 * @param {{ collection: string, filename: string }} bookInfo
 */
function resolveBookPath(bookInfo) {
  return path.join(DATA_ROOT, bookInfo.collection, bookInfo.filename);
}

/**
 * Read and parse a book's full JSON.
 * @param {number} bookId
 * @returns {{ metadata: object, chapters: Array, hadiths: Array } | null}
 */
function readBookJson(bookId) {
  const bookInfo = getBookById(bookId);
  if (!bookInfo) return null;

  const filePath = resolveBookPath(bookInfo);
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error(`[hadith] Failed to read book ${bookId}:`, err.message);
    return null;
  }
}

/**
 * Returns metadata + chapters + per-chapter hadith count for one book.
 * Used on the `/hadith/[bookId]` page.
 *
 * @param {number|string} bookId
 * @returns {{ bookInfo: object, chapters: Array, chapterCounts: Record<number, number> } | null}
 */
export function getBookChapters(bookId) {
  const bookInfo = getBookById(bookId);
  if (!bookInfo) return null;

  const data = readBookJson(Number(bookId));
  if (!data) return null;

  // Build per-chapter hadith count from hadiths array
  const chapterCounts = {};
  for (const hadith of data.hadiths) {
    chapterCounts[hadith.chapterId] =
      (chapterCounts[hadith.chapterId] ?? 0) + 1;
  }

  return {
    bookInfo,
    metadata: data.metadata,
    chapters: data.chapters,
    chapterCounts,
  };
}

/**
 * Returns the hadiths for a specific chapter of a book.
 * Used on the `/hadith/[bookId]/[chapterId]` page.
 *
 * @param {number|string} bookId
 * @param {number|string} chapterId
 * @returns {{ bookInfo: object, chapter: object, hadiths: Array } | null}
 */
export function getChapterHadiths(bookId, chapterId) {
  const bookInfo = getBookById(bookId);
  if (!bookInfo) return null;

  const data = readBookJson(Number(bookId));
  if (!data) return null;

  const chapId = Number(chapterId);
  const chapter = data.chapters.find((c) => c.id === chapId) ?? null;
  const hadiths = data.hadiths.filter((h) => h.chapterId === chapId);

  return {
    bookInfo,
    metadata: data.metadata,
    chapter,
    hadiths,
  };
}
