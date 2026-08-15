import { useMediaQuery } from "@custom-react-hooks/use-media-query";

export default function CornerSvg({ position }) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const rotation = {
    "top-left": "rotate-0",
    "top-right": "rotate-90",
    "bottom-right": "rotate-180",
    "bottom-left": "-rotate-90",
  }[position];

  const placement = {
    "top-left": isMobile ? "top-3 left-3" : "top-4 left-4",
    "top-right": isMobile ? "top-3 right-3" : "top-4 right-4",
    "bottom-right": isMobile ? "bottom-3 right-3" : "bottom-4 right-4",
    "bottom-left": isMobile ? "bottom-3 left-3" : "bottom-4 left-4",
  }[position];

  return (
    <svg
      viewBox="0 0 48 48"
      className={`absolute size-9 sm:size-18 text-accent opacity-50 pointer-events-none ${placement} ${rotation}`}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2 22 L2 2 L22 2"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path d="M2 13 C2 6.9 6.9 2 13 2" stroke="currentColor" strokeWidth="1" />
      <circle cx="2" cy="2" r="2" fill="currentColor" />
    </svg>
  );
}
