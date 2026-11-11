import type { FontCollectionId } from "./fontCollections";

export { fontCollections } from "./fontCollections";
export type { FontCollection, FontCollectionId } from "./fontCollections";

export type FontArticle = {
  title: string;
  url: string;
  excerpt: string;
};

export type FontSpecimenSource = {
  title: string;
  url: string;
  text: string;
};

export type FontLicenseStatus = "cleared" | "unverified";

export type FontRecord = {
  id: string;
  name: string;
  family: string;
  filename: string;
  fileLocation: string;
  licensingStatus: FontLicenseStatus;
  collections: readonly FontCollectionId[];
  weight: 400 | 500 | 600 | 700;
  style: "normal" | "italic";
  designer: string | null;
  wikipediaArticle: FontArticle | null;
  continuousSpecimen: FontSpecimenSource;
};

const fontCatalogEntries = [
  {
    id: "crimson-roman",
    name: "Crimson Roman",
    family: "Crimson",
    filename: "Crimson-Roman.otf",
    fileLocation: "public/fonts/cleared/Crimson-Roman.otf",
    licensingStatus: "cleared",
    collections: ["serif-book"],
    weight: 400,
    style: "normal",
    designer: null,
    wikipediaArticle: null,
    continuousSpecimen: {
      title: "Typography",
      url: "https://en.wikipedia.org/wiki/Typography",
      text: "Typography is the art and technique of arranging type to make written language legible and readable when displayed. The arrangement involves selecting typefaces, point sizes, line lengths, line spacing, letter spacing, and spaces between pairs of letters.",
    },
  },
  {
    id: "crimson-semibold",
    name: "Crimson Semibold",
    family: "Crimson",
    filename: "Crimson-Semibold.otf",
    fileLocation: "public/fonts/cleared/Crimson-Semibold.otf",
    licensingStatus: "cleared",
    collections: ["serif-book"],
    weight: 600,
    style: "normal",
    designer: null,
    wikipediaArticle: null,
    continuousSpecimen: {
      title: "Manuscript",
      url: "https://en.wikipedia.org/wiki/Manuscript",
      text: "A manuscript is any text written by hand as opposed to mechanically printed or reproduced using automated printing technologies. In modern usage, the word also includes an original, unpublished copy of an author's work, regardless of the technology used to create it.",
    },
  },
  {
    id: "crimson-bold",
    name: "Crimson Bold",
    family: "Crimson",
    filename: "Crimson-Bold.otf",
    fileLocation: "public/fonts/cleared/Crimson-Bold.otf",
    licensingStatus: "cleared",
    collections: ["serif-book"],
    weight: 700,
    style: "normal",
    designer: null,
    wikipediaArticle: null,
    continuousSpecimen: {
      title: "Printing",
      url: "https://en.wikipedia.org/wiki/Printing",
      text: "Printing is a process for mass reproducing text and images using a master form or template.",
    },
  },
  {
    id: "crimson-italic",
    name: "Crimson Italic",
    family: "Crimson",
    filename: "Crimson-Italic.otf",
    fileLocation: "public/fonts/cleared/Crimson-Italic.otf",
    licensingStatus: "cleared",
    collections: ["serif-book"],
    weight: 400,
    style: "italic",
    designer: null,
    wikipediaArticle: null,
    continuousSpecimen: {
      title: "Renaissance",
      url: "https://en.wikipedia.org/wiki/Renaissance",
      text: "The Renaissance was a European period of history and cultural movement taking place at the end of the Late Middle Ages and the beginning of the early modern era. It was characterized by the revival of literary, philosophical, and artistic achievements of classical antiquity.",
    },
  },
  {
    id: "crimson-semibold-italic",
    name: "Crimson Semibold Italic",
    family: "Crimson",
    filename: "Crimson-SemiboldItalic.otf",
    fileLocation: "public/fonts/cleared/Crimson-SemiboldItalic.otf",
    licensingStatus: "cleared",
    collections: ["serif-book"],
    weight: 600,
    style: "italic",
    designer: null,
    wikipediaArticle: null,
    continuousSpecimen: {
      title: "Bookbinding",
      url: "https://en.wikipedia.org/wiki/Bookbinding",
      text: "Bookbinding is the process of building a book, usually in codex format, from an ordered stack of paper sheets by hand and with tools, or through automated processes in modern publishing. Pages may be joined with thread, adhesive, rings, posts, or coils.",
    },
  },
  {
    id: "crimson-bold-italic",
    name: "Crimson Bold Italic",
    family: "Crimson",
    filename: "Crimson-BoldItalic.otf",
    fileLocation: "public/fonts/cleared/Crimson-BoldItalic.otf",
    licensingStatus: "cleared",
    collections: ["serif-book"],
    weight: 700,
    style: "italic",
    designer: null,
    wikipediaArticle: null,
    continuousSpecimen: {
      title: "Papyrus",
      url: "https://en.wikipedia.org/wiki/Papyrus",
      text: "Papyrus is a substance used in ancient times as a writing surface. Similar to thick paper, it was first known to have been used in Egypt, where the papyrus plant grew abundantly across the Nile Delta.",
    },
  },
  {
    id: "fette-classic-unz-fraktur",
    name: "Fette Classic UNZ Fraktur",
    family: "Fette Classic UNZ Fraktur",
    filename: "FetteClassicUnzFraktur-KMne.ttf",
    fileLocation: "public/fonts/cleared/FetteClassicUnzFraktur-KMne.ttf",
    licensingStatus: "cleared",
    collections: [
      "historically-important",
      "blackletter-gothic",
      "display-decorative",
    ],
    weight: 400,
    style: "normal",
    designer: null,
    wikipediaArticle: {
      title: "Fraktur",
      url: "https://en.wikipedia.org/wiki/Fraktur",
      excerpt:
        "Fraktur is a book hand of the Latin alphabet and any of several blackletter typefaces derived from this hand.",
    },
    continuousSpecimen: {
      title: "Fraktur",
      url: "https://en.wikipedia.org/wiki/Fraktur",
      text: "Fraktur is a book hand of the Latin alphabet and any of several blackletter typefaces derived from this hand. Its letterforms emphasize the beginnings and ends of individual strokes.",
    },
  },
  {
    id: "fette-unz-fraktur",
    name: "Fette UNZ Fraktur",
    family: "Fette UNZ Fraktur",
    filename: "FetteUnzFraktur-2jRX.ttf",
    fileLocation: "public/fonts/cleared/FetteUnzFraktur-2jRX.ttf",
    licensingStatus: "cleared",
    collections: [
      "historically-important",
      "blackletter-gothic",
      "display-decorative",
    ],
    weight: 400,
    style: "normal",
    designer: null,
    wikipediaArticle: null,
    continuousSpecimen: {
      title: "Ancient Egyptian art",
      url: "https://en.wikipedia.org/wiki/Ancient_Egyptian_art",
      text: "Ancient Egyptian art refers to art produced in ancient Egypt between the sixth millennium BC and the fourth century AD. It includes paintings, sculptures, drawings on papyrus, faience, jewelry, ivories, architecture, and other media.",
    },
  },
  {
    id: "gloria-hallelujah",
    name: "Gloria Hallelujah",
    family: "Gloria Hallelujah",
    filename: "GloriaHallelujah-Regular.ttf",
    fileLocation: "public/fonts/cleared/GloriaHallelujah-Regular.ttf",
    licensingStatus: "cleared",
    collections: ["handwriting-script", "display-decorative"],
    weight: 400,
    style: "normal",
    designer: null,
    wikipediaArticle: null,
    continuousSpecimen: {
      title: "Calligraphy",
      url: "https://en.wikipedia.org/wiki/Calligraphy",
      text: "Calligraphy is fine handwriting as a visual art. It involves the design and execution of lettering or characters using a pen, ink brush, or other writing instruments.",
    },
  },
  {
    id: "gochi-hand",
    name: "Gochi Hand",
    family: "Gochi Hand",
    filename: "GochiHand-Regular.ttf",
    fileLocation: "public/fonts/cleared/GochiHand-Regular.ttf",
    licensingStatus: "cleared",
    collections: ["handwriting-script", "experimental-novelty"],
    weight: 400,
    style: "normal",
    designer: null,
    wikipediaArticle: null,
    continuousSpecimen: {
      title: "Impressionism",
      url: "https://en.wikipedia.org/wiki/Impressionism",
      text: "Impressionism was a 19th-century art movement characterised by visible brush strokes, open composition, and an emphasis on accurately depicting light as it changes. Its artists also explored ordinary subject matter, unusual visual angles, and movement.",
    },
  },
  {
    id: "jost-medium",
    name: "Jost Medium",
    family: "Jost",
    filename: "Jost-Medium.ttf",
    fileLocation: "public/fonts/cleared/Jost-Medium.ttf",
    licensingStatus: "cleared",
    collections: ["sans-geometric"],
    weight: 500,
    style: "normal",
    designer: null,
    wikipediaArticle: null,
    continuousSpecimen: {
      title: "Book",
      url: "https://en.wikipedia.org/wiki/Book",
      text: "A book is a written work of substantial length created by one or more authors. It is typically printed on many sheets of paper bound together, though books are also distributed as audiobooks and electronic books.",
    },
  },
  {
    id: "noto-egyptian-hieroglyphs",
    name: "Noto Sans Egyptian Hieroglyphs",
    family: "Noto Sans Egyptian Hieroglyphs",
    filename: "NotoSansEgyptianHieroglyphs-Regular.ttf",
    fileLocation: "public/fonts/cleared/NotoSansEgyptianHieroglyphs-Regular.ttf",
    licensingStatus: "cleared",
    collections: ["symbols-writing-systems"],
    weight: 400,
    style: "normal",
    designer: null,
    wikipediaArticle: {
      title: "Egyptian hieroglyphs",
      url: "https://en.wikipedia.org/wiki/Egyptian_hieroglyphs",
      excerpt:
        "Egyptian hieroglyphs were the formal writing system used in ancient Egypt for writing the Egyptian language.",
    },
    continuousSpecimen: {
      title: "Egyptian hieroglyphs",
      url: "https://en.wikipedia.org/wiki/Egyptian_hieroglyphs",
      text: "Egyptian hieroglyphs were the formal writing system used in ancient Egypt for writing the Egyptian language. They combined ideographic, logographic, syllabic, and alphabetic elements.",
    },
  },
] satisfies readonly FontRecord[];

export type PublicFontId = (typeof fontCatalogEntries)[number]["id"];

export const fontCatalog: readonly (FontRecord & { id: PublicFontId })[] =
  fontCatalogEntries.map((font) => font);
