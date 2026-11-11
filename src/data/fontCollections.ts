export const fontCollections = [
  {
    id: "historically-important",
    name: "Historically Important",
    description:
      "A curated highlight of influential type traditions and modern interpretations. Collection membership does not authenticate a digital font as an original historical typeface.",
  },
  {
    id: "blackletter-gothic",
    name: "Blackletter & Gothic",
    description:
      "Blackletter forms and related Gothic display styles, including contemporary designs inspired by those traditions.",
  },
  {
    id: "serif-book",
    name: "Serif & Book Typography",
    description:
      "Serif families and faces suited to book typography, including modern revivals distinct from historical originals.",
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
      "Fonts focused on symbols or writing systems. A rendered glyph is not itself a translation or proof of historical provenance.",
  },
  {
    id: "classic-typefaces",
    name: "Classic Typefaces",
    description:
      "Compare influential type traditions with modern revivals and interpretations, without treating later digital designs as historical originals. Futura and Helvetica are discussed in the quiz but are not included as specimens: the local/system copies lack redistribution evidence. Jost is a contemporary geometric design inspired by 1920s German sans-serifs, not Futura; Inter is an independent modern sans serif, not Helvetica or a substitute for it.",
  },
  {
    id: "historical-typography",
    name: "Historical Typography",
    description:
      "A collection focused on historical eras and typographic traditions, with modern interpretations clearly distinguished from period artifacts.",
  },
] as const;

export type FontCollection = (typeof fontCollections)[number];
export type FontCollectionId = FontCollection["id"];
