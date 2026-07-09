import Link from "next/link";

export function FootnoteFormatter({ text }) {
  // The regex (\d+:\d+) looks for one or more digits, a colon, and one or more digits like 22:4.
  // The parentheses capture the match so it's included in the split array.
  const regex = /(\d+:\d+)/g;
  const parts = text.split(regex);

  return (
    <p className="text-sm">
      {parts.map((part, index) => {
        // If the part matches the "number:number" pattern, render it as a link
        if (part.match(/^\d+:\d+$/)) {
          const [chapter] = part.split(":");

          return (
            <Link
              key={index}
              href={`/quran/${chapter}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              {part}
            </Link>
          );
        }

        // If it doesn't match the pattern, just return the plain text
        return (
          <span key={index} className="text-text-secondary/60">
            {part}
          </span>
        );
      })}
    </p>
  );
}
