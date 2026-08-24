import { notFound } from "next/navigation";
import HadithBookPage from "@/app/hadith/[bookId]/HadithBookPage";
import { getBookChapters } from "@/lib/hadith";
import { getBookById } from "@/data/datas/hadithData";

export async function generateMetadata({ params }) {
  const { bookId } = await params;
  const bookInfo = getBookById(bookId);
  if (!bookInfo) return { title: "Book Not Found", description: "This Hadith book could not be found. Browse the full Hadith library on Rُuh." };

  return {
    title: bookInfo.englishTitle,
    description: `Browse all chapters of ${bookInfo.englishTitle} (${bookInfo.arabicTitle}) by ${bookInfo.author}. ${bookInfo.length.toLocaleString()} hadiths.`,
  };
}

export default async function HadithBookRoute({ params }) {
  const { bookId } = await params;
  const data = getBookChapters(bookId);

  if (!data) notFound();

  return (
    <HadithBookPage
      bookInfo={data.bookInfo}
      metadata={data.metadata}
      chapters={data.chapters}
      chapterCounts={data.chapterCounts}
    />
  );
}
