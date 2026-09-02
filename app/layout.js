import {
  plusJakartaSans,
  inter,
  ibmPlexSansArabic,
  qpcHafs,
  surahHeader,
} from "./fonts";
import Providers from "./providers";
import Navbar from "@/components/layout/Navbar";
import GlobalAudioPlayer from "@/components/layout/GlobalAudioPlayer";
import "./globals.css";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(appUrl), // this is used for defining the base url for the website and for social media open graph images and links and twitter images and links in cards , for example when you share the link on social media
  title: {
    default: "Rُuh | رُوح — Feed your soul, distraction-free.",
    template: "%s | Rُuh رُوح",
  },
  description:
    "A next-generation Islamic platform for Quran Reading, Prayer Times, Azkar, Hadith, Study Circles, Islamic Radio, and Live TV. Designed for deep focus and spiritual immersion.",
  keywords: [
    "Quran",
    "Islamic",
    "Prayer Times",
    "Azkar",
    "Hadith",
    "Islamic Radio",
    "Live TV",
    "Study Circle",
    "Halaqah",
    "رُوح",
    "Rُuh",
    "Muslim",
    "Islam",
  ],
  authors: [{ name: "Rُuh" }],
  creator: "Rُuh Platform",
  alternates: {
    canonical: "/", // canonical url is used to define the main url of the website
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Rُuh | رُوح",
    title: "Rُuh | رُوح — Feed your soul, distraction-free.",
    description:
      "A next-generation Islamic platform for Quran reading, Prayer Times, Azkar, Hadith, Islamic radio, live TV, and study circles.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Rُuh | رُوح — Feed your soul, distraction-free.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rُuh | رُوح",
    description: "Feed your soul, distraction-free.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  const fontClasses = [
    plusJakartaSans.variable,
    inter.variable,
    ibmPlexSansArabic.variable,
    qpcHafs.variable,
    surahHeader.variable,
  ].join(" ");

  return (
    <html
      lang="en"
      dir="ltr"
      data-scroll-behavior="smooth"
      className={`${fontClasses} h-full antialiased`}
      suppressHydrationWarning // Required by next-themes
    >
      <body className="min-h-full flex flex-col bg-background text-text-primary transition-colors duration-300">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <GlobalAudioPlayer />
        </Providers>
      </body>
    </html>
  );
}
