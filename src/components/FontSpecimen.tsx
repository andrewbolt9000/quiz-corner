import type { CSSProperties, ReactNode } from "react";

type FontSpecimenProps = {
  fontFamily: string;
  sampleText: string;
  className?: string;
  fontSize?: CSSProperties["fontSize"];
  fontWeight?: CSSProperties["fontWeight"];
  fontStyle?: CSSProperties["fontStyle"];
  fontAvailable?: boolean;
  sampleTextLabel?: string;
  caption?: ReactNode;
  showCaption?: boolean;
};

export default function FontSpecimen({
  fontFamily,
  sampleText,
  className = "",
  fontSize = "2rem",
  fontWeight,
  fontStyle,
  fontAvailable = true,
  sampleTextLabel,
  caption,
  showCaption = true,
}: FontSpecimenProps) {
  return (
    <figure className={`min-w-0 max-w-full ${className}`}>
      {fontAvailable ? (
        <p
          className="whitespace-pre-wrap break-words leading-relaxed [overflow-wrap:anywhere]"
          aria-label={sampleTextLabel}
          style={{
            fontFamily: `"${fontFamily}", serif`,
            fontSize,
            fontWeight,
            fontStyle,
          }}
        >
          {sampleText}
        </p>
      ) : (
        <p
          role="status"
          className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm leading-6 text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100"
        >
          Specimen unavailable: this font is not cleared for public
          distribution and is not included in this site.
        </p>
      )}
      {showCaption && (
        <figcaption className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
          {caption ?? fontFamily}
        </figcaption>
      )}
    </figure>
  );
}
