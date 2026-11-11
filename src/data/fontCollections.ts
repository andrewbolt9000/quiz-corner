export const fontCollections = [
  {
    id: "historically-important",
    name: "Historically Important",
    description:
      "A curated highlight of supplied type styles with historical importance. Classification does not authenticate any font file as an original historical typeface.",
  },
  {
    id: "blackletter-gothic",
    name: "Blackletter & Gothic",
    description:
      "Blackletter forms and related Gothic display styles represented in the local collection.",
  },
  {
    id: "serif-book",
    name: "Serif & Book Typography",
    description:
      "Serif families and faces suited to book and long-form typography.",
  },
  {
    id: "sans-geometric",
    name: "Sans Serif & Geometric",
    description:
      "Sans-serif families with geometric or modernist characteristics.",
  },
  {
    id: "display-decorative",
    name: "Display & Decorative",
    description:
      "Expressive styles intended to attract attention at display sizes.",
  },
  {
    id: "handwriting-script",
    name: "Handwriting & Script",
    description:
      "Fonts that evoke handwriting, lettering, or script.",
  },
  {
    id: "experimental-novelty",
    name: "Experimental & Novelty",
    description:
      "Playful or unusual styles that do not fit conventional text categories.",
  },
  {
    id: "symbols-writing-systems",
    name: "Symbols & Writing Systems",
    description:
      "Fonts focused on symbols or non-Latin writing systems.",
  },
  {
    id: "classic-typefaces",
    name: "Classic Typefaces",
    description:
      "A curated collection of influential typefaces. Membership does not authenticate any font file as an original historical design.",
  },
  {
    id: "historical-typography",
    name: "Historical Typography",
    description:
      "A collection focused on historical eras, typographic traditions, and the development of type.",
  },
] as const;

export type FontCollection = (typeof fontCollections)[number];
export type FontCollectionId = FontCollection["id"];
