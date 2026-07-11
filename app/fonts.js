import {
  Plus_Jakarta_Sans,
  Inter,
  IBM_Plex_Sans_Arabic,
} from "next/font/google";
import localFont from "next/font/local";

// dah font english el asasy
export const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

// dah font english el secondary
export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["300", "400", "500"],
});

// dah font 3rby el asasy le ay 7aga 3rby 8er el ayat bt3t el quran
export const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  display: "swap",
  variable: "--font-arabic-ui",
  weight: ["300", "400", "500", "700"],
});

// dah font 3rby lel ayat bt3t el quran
// lw 7sl moshkla fel font aw ay error hy3ml fallback lel traditional arabic
// "traditional arabic" ely howa fe --font-quran fe globals.css
export const qpcHafs = localFont({
  src: "../public/fonts/QPCHafs_V22.woff2",
  variable: "--font-quran",
  display: "swap",
});
