import { notFound } from "next/navigation";
import HadithChapterPage from "@/app/hadith/[bookId]/[chapterId]/HadithChapterPage";
import { getChapterHadiths } from "@/lib/hadith";
import { getBookById } from "@/data/datas/hadithData";

export async function generateMetadata({ params }) {
  const { bookId, chapterId } = await params;
  const bookInfo = getBookById(bookId);
  if (!bookInfo) return { title: "Chapter Not Found" };

  const data = getChapterHadiths(bookId, chapterId);
  const chapterName = data?.chapter?.english ?? `Chapter ${chapterId}`;

  return {
    title: `${chapterName} — ${bookInfo.englishTitle}`,
    description: `Read the hadiths of ${chapterName} from ${bookInfo.englishTitle} (${bookInfo.arabicTitle}) with Arabic text and English translation.`,
  };
}

export default async function HadithChapterRoute({ params }) {
  const { bookId, chapterId } = await params;
  const data = getChapterHadiths(bookId, chapterId);

  if (!data) notFound();

  return (
    <HadithChapterPage
      bookInfo={data.bookInfo}
      metadata={data.metadata}
      chapter={data.chapter}
      hadiths={data.hadiths}
    />
  );
}
