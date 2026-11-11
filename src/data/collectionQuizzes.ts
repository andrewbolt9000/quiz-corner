import { fontCatalog } from "./fontCatalog";
import type { PublicFontId } from "./fontCatalog";
import type { FontCollectionId } from "./fontCollections";
import { QUIZ_IDS, type QuizId } from "./quizIds";
import type {
  AnswerIndex,
  QuizData,
  QuizQuestion,
} from "./quizzes";
import type {
  QuizDifficulty,
  QuizFormat,
} from "./quizRegistry";

type SpecimenQuestionDefinition = {
  id: string;
  fontId: PublicFontId;
  answerFontIds: readonly [
    PublicFontId,
    PublicFontId,
    PublicFontId,
    PublicFontId,
  ];
  correctAnswerIndex: AnswerIndex;
  explanation: string;
};

export type CollectionQuizDefinition = {
  id: QuizId;
  quiz: QuizData;
  route: string;
  collectionIds: readonly FontCollectionId[];
  format: QuizFormat;
  difficulty: QuizDifficulty;
};

function getPublicFont(fontId: PublicFontId) {
  const font = fontCatalog.find((entry) => entry.id === fontId);

  if (!font || font.licensingStatus !== "cleared") {
    throw new Error(
      `Collection quiz specimen "${fontId}" must reference a cleared public font.`,
    );
  }

  return font;
}

function specimenQuestion({
  id,
  fontId,
  answerFontIds,
  correctAnswerIndex,
  explanation,
}: SpecimenQuestionDefinition): QuizQuestion {
  if (
    new Set(answerFontIds).size !== 4 ||
    answerFontIds[correctAnswerIndex] !== fontId
  ) {
    throw new Error(
      `Specimen question "${id}" must have four distinct choices and the specimen as its correct answer.`,
    );
  }

  const font = getPublicFont(fontId);
  const answers = [
    getPublicFont(answerFontIds[0]).name,
    getPublicFont(answerFontIds[1]).name,
    getPublicFont(answerFontIds[2]).name,
    getPublicFont(answerFontIds[3]).name,
  ] as const;

  return {
    id,
    answers,
    correctAnswerIndex,
    content: {
      kind: "font-specimen",
      explanation,
      specimen: {
        fontId: font.id,
        fontFamily: font.family,
        fontWeight: font.weight,
        fontStyle: font.style,
        fontAvailable: true,
      },
    },
  };
}

function makeQuiz(
  id: QuizId,
  title: string,
  description: string,
  questions: readonly QuizQuestion[],
  maxQuestions = 8,
): QuizData {
  if (
    questions.length === 0 ||
    questions.length > maxQuestions ||
    questions.some((question) => question.content.kind !== "font-specimen")
  ) {
    throw new Error(
      `Collection quiz "${id}" must contain 1-${maxQuestions} font specimen questions.`,
    );
  }

  return { id, title, description, questions };
}

const historicallyImportantQuiz = makeQuiz(
  QUIZ_IDS.historicallyImportant,
  "Historically Important: Reading Type in Context",
  "Identify public specimens associated with influential type traditions. A specimen or catalog label does not establish a font file's provenance.",
  [
    specimenQuestion({
      id: "history-style-fette-specimen",
      fontId: "fette-classic-unz-fraktur",
      answerFontIds: [
        "fette-classic-unz-fraktur",
        "fette-unz-fraktur",
        "crimson-roman",
        "jost-medium",
      ],
      correctAnswerIndex: 0,
      explanation:
        "The public catalog identifies this specimen as Fette Classic UNZ Fraktur. That catalog name and collection assignment describe the record; they do not prove the age or provenance of this font file.",
    }),
    specimenQuestion({
      id: "history-style-eb-garamond-specimen",
      fontId: "eb-garamond-regular",
      answerFontIds: [
        "eb-garamond-regular",
        "fette-classic-unz-fraktur",
        "crimson-roman",
        "bodoni-moda-regular",
      ],
      correctAnswerIndex: 0,
      explanation:
        "EB Garamond is a contemporary digital interpretation of historical Garamond models. It is not an original period typeface or one of the local Garamond-labeled files.",
    }),
  ],
);

const blackletterGothicQuiz = makeQuiz(
  QUIZ_IDS.blackletterGothic,
  "Blackletter & Gothic: Forms and Printing",
  "Identify the collection's blackletter and related display specimens by their letterforms.",
  [
    specimenQuestion({
      id: "blackletter-fette-unz-specimen",
      fontId: "fette-unz-fraktur",
      answerFontIds: [
        "crimson-roman",
        "fette-unz-fraktur",
        "gloria-hallelujah",
        "noto-egyptian-hieroglyphs",
      ],
      correctAnswerIndex: 1,
      explanation:
        "The catalog identifies this specimen as Fette UNZ Fraktur. The name identifies the supplied catalog record; it is not evidence that this file is an original historical printing type.",
    }),
    specimenQuestion({
      id: "blackletter-pirata-one-specimen",
      fontId: "pirata-one-regular",
      answerFontIds: [
        "pirata-one-regular",
        "fette-unz-fraktur",
        "fette-classic-unz-fraktur",
        "gloria-hallelujah",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Pirata One is a contemporary display design using blackletter forms. Its style does not make the digital font a historical Fraktur artifact.",
    }),
  ],
);

const serifBookQuiz = makeQuiz(
  QUIZ_IDS.serifBook,
  "Serif & Book Typography: Reading the Page",
  "Identify serif and book-type specimens from their letterforms.",
  [
    specimenQuestion({
      id: "serif-book-libre-baskerville-specimen",
      fontId: "libre-baskerville-regular",
      answerFontIds: [
        "libre-baskerville-regular",
        "eb-garamond-regular",
        "crimson-roman",
        "bodoni-moda-regular",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Libre Baskerville is an independent modern revival for text use. It is not the historical Baskerville type or a copy of the local system font.",
    }),
    specimenQuestion({
      id: "serif-book-cormorant-specimen",
      fontId: "cormorant-garamond-regular",
      answerFontIds: [
        "cormorant-garamond-regular",
        "eb-garamond-regular",
        "lora-regular",
        "source-serif-4-regular",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Cormorant Garamond is a contemporary interpretation inspired by sixteenth-century Garamond models; it is not a period font.",
    }),
    specimenQuestion({
      id: "serif-book-arvo-specimen",
      fontId: "arvo-regular",
      answerFontIds: [
        "arvo-regular",
        "libre-baskerville-regular",
        "crimson-roman",
        "eb-garamond-regular",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Arvo is a contemporary slab serif. Its block-like serifs give it a different texture from the more bracketed forms in these text serifs.",
    }),
  ],
);

const sansGeometricQuiz = makeQuiz(
  QUIZ_IDS.sansGeometric,
  "Sans Serif & Geometric: Shape and Spacing",
  "Identify the collection's sans-serif specimens by their forms and proportions.",
  [
    specimenQuestion({
      id: "sans-inter-specimen",
      fontId: "inter-regular",
      answerFontIds: [
        "inter-regular",
        "jost-medium",
        "crimson-roman",
        "gochi-hand",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Inter is a contemporary typeface designed for user interfaces and screen reading. It is not a Helvetica or Futura build.",
    }),
    specimenQuestion({
      id: "sans-jost-specimen",
      fontId: "jost-medium",
      answerFontIds: [
        "crimson-roman",
        "jost-medium",
        "gochi-hand",
        "fette-classic-unz-fraktur",
      ],
      correctAnswerIndex: 1,
      explanation:
        "The public catalog identifies this specimen as Jost Medium. The specimen demonstrates the cataloged face; it does not by itself establish historical provenance.",
    }),
  ],
);

const displayDecorativeQuiz = makeQuiz(
  QUIZ_IDS.displayDecorative,
  "Display & Decorative: Type with a Voice",
  "Identify expressive display specimens by their distinctive letterforms.",
  [
    specimenQuestion({
      id: "display-gloria-specimen",
      fontId: "gloria-hallelujah",
      answerFontIds: [
        "gloria-hallelujah",
        "crimson-bold",
        "jost-medium",
        "noto-egyptian-hieroglyphs",
      ],
      correctAnswerIndex: 0,
      explanation:
        "The catalog identifies this specimen as Gloria Hallelujah. Its handwritten appearance is a design characteristic, not evidence that the file is actual handwriting.",
    }),
    specimenQuestion({
      id: "display-bodoni-moda-specimen",
      fontId: "bodoni-moda-regular",
      answerFontIds: [
        "bodoni-moda-regular",
        "gloria-hallelujah",
        "fette-unz-fraktur",
        "jost-medium",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Bodoni Moda is a modern Didone design and interpretation, not the original Bodoni type or the separate Bodoni 72 system font.",
    }),
    specimenQuestion({
      id: "display-bungee-specimen",
      fontId: "bungee-regular",
      answerFontIds: [
        "bungee-regular",
        "bodoni-moda-regular",
        "pirata-one-regular",
        "jost-medium",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Bungee is a contemporary display design drawing on urban signage. Its stacked, architectural forms differ from the serif contrast of Bodoni Moda and blackletter forms of Pirata One.",
    }),
  ],
);

const handwritingScriptQuiz = makeQuiz(
  QUIZ_IDS.handwritingScript,
  "Handwriting & Script: Strokes and Lettering",
  "Identify handwriting- and script-inspired specimens by their letterforms.",
  [
    specimenQuestion({
      id: "handwriting-gochi-specimen",
      fontId: "gochi-hand",
      answerFontIds: [
        "gloria-hallelujah",
        "gochi-hand",
        "crimson-italic",
        "fette-unz-fraktur",
      ],
      correctAnswerIndex: 1,
      explanation:
        "The public catalog identifies this font as Gochi Hand. Its appearance evokes handwriting, but the specimen is a digital font, not a handwritten document.",
    }),
    specimenQuestion({
      id: "handwriting-gloria-specimen",
      fontId: "gloria-hallelujah",
      answerFontIds: [
        "gloria-hallelujah",
        "gochi-hand",
        "crimson-italic",
        "pirata-one-regular",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Gloria Hallelujah is a designed digital font with informal handwritten cues; it is not a scan of a handwritten note.",
    }),
  ],
);

const experimentalNoveltyQuiz = makeQuiz(
  QUIZ_IDS.experimentalNovelty,
  "Experimental & Novelty: Design by Contrast",
  "Identify experimental and novelty specimens by their distinctive designs.",
  [
    specimenQuestion({
      id: "experimental-bungee-specimen",
      fontId: "bungee-regular",
      answerFontIds: [
        "bungee-regular",
        "gloria-hallelujah",
        "bodoni-moda-regular",
        "noto-egyptian-hieroglyphs",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Bungee uses conspicuous, signage-inspired forms for display. It is a contemporary design, not a historical lettering artifact.",
    }),
    specimenQuestion({
      id: "experimental-gochi-specimen",
      fontId: "gochi-hand",
      answerFontIds: [
        "gochi-hand",
        "gloria-hallelujah",
        "bungee-regular",
        "crimson-roman",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Gochi Hand evokes casual handwriting, while remaining a reusable digital type design. Its appearance alone does not establish a handwritten source.",
    }),
  ],
);

const symbolsWritingSystemsQuiz = makeQuiz(
  QUIZ_IDS.symbolsWritingSystems,
  "Symbols & Writing Systems: Signs and Meaning",
  "Identify the public specimens in this writing-systems collection from their glyph forms.",
  [
    specimenQuestion({
      id: "symbols-egyptian-specimen",
      fontId: "noto-egyptian-hieroglyphs",
      answerFontIds: [
        "noto-egyptian-hieroglyphs",
        "jost-medium",
        "crimson-roman",
        "gloria-hallelujah",
      ],
      correctAnswerIndex: 0,
      explanation:
        "The catalog identifies this specimen as Noto Sans Egyptian Hieroglyphs. A font can display encoded signs; it does not by itself translate or interpret them.",
    }),
    specimenQuestion({
      id: "symbols-cuneiform-specimen",
      fontId: "noto-cuneiform-regular",
      answerFontIds: [
        "noto-cuneiform-regular",
        "noto-egyptian-hieroglyphs",
        "crimson-roman",
        "jost-medium",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Noto Sans Cuneiform maps encoded Cuneiform characters to glyphs. The typeface does not translate or interpret the signs.",
    }),
  ],
);

const classicTypefacesQuiz = makeQuiz(
  QUIZ_IDS.classicTypefaces,
  "Classic Typefaces: Reading Forms and Traditions",
  "Identify public specimens across serif, Didone, slab-serif, sans-serif, and blackletter traditions.",
  [
    specimenQuestion({
      id: "classic-bodoni-moda-specimen",
      fontId: "bodoni-moda-regular",
      answerFontIds: [
        "bodoni-moda-regular",
        "gfs-didot-regular",
        "playfair-display-regular",
        "eb-garamond-regular",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Bodoni Moda is a modern high-contrast Didone design. The vertical stress and fine serifs distinguish this tradition from the lower-contrast old-style examples.",
    }),
    specimenQuestion({
      id: "classic-eb-garamond-specimen",
      fontId: "eb-garamond-regular",
      answerFontIds: [
        "eb-garamond-regular",
        "cormorant-garamond-regular",
        "libre-baskerville-regular",
        "alegreya-regular",
      ],
      correctAnswerIndex: 0,
      explanation:
        "EB Garamond is a contemporary digital interpretation of historical Garamond models, not an original sixteenth-century font. Its old-style forms differ from the more vertical, high-contrast Didones.",
    }),
    specimenQuestion({
      id: "classic-cormorant-specimen",
      fontId: "cormorant-garamond-regular",
      answerFontIds: [
        "eb-garamond-regular",
        "cormorant-garamond-regular",
        "alegreya-regular",
        "source-serif-4-regular",
      ],
      correctAnswerIndex: 1,
      explanation:
        "Cormorant Garamond is a contemporary interpretation inspired by Garamond models. It is a distinct modern design, not an original historical Garamond.",
    }),
    specimenQuestion({
      id: "classic-libre-baskerville-specimen",
      fontId: "libre-baskerville-regular",
      answerFontIds: [
        "libre-baskerville-regular",
        "source-serif-4-regular",
        "lora-regular",
        "crimson-roman",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Libre Baskerville is a modern text revival named for John Baskerville's eighteenth-century tradition; it is not Baskerville's original type or a period artifact.",
    }),
    specimenQuestion({
      id: "classic-source-serif-specimen",
      fontId: "source-serif-4-regular",
      answerFontIds: [
        "source-serif-4-regular",
        "libre-baskerville-regular",
        "alegreya-regular",
        "eb-garamond-regular",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Source Serif 4 is a contemporary text family by Frank Grießhammer for Adobe Originals. Its inclusion provides a modern text-serif comparison rather than a historical revival.",
    }),
    specimenQuestion({
      id: "classic-alegreya-specimen",
      fontId: "alegreya-regular",
      answerFontIds: [
        "alegreya-regular",
        "lora-regular",
        "cormorant-garamond-regular",
        "source-serif-4-regular",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Alegreya is a contemporary humanist serif by Juan Pablo del Peral and Huerta Tipográfica, designed with literary text in mind.",
    }),
    specimenQuestion({
      id: "classic-lora-specimen",
      fontId: "lora-regular",
      answerFontIds: [
        "lora-regular",
        "alegreya-regular",
        "libre-baskerville-regular",
        "eb-garamond-regular",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Lora is a contemporary text serif with calligraphic influences. It is not a revival of a single historical face.",
    }),
    specimenQuestion({
      id: "classic-gfs-didot-specimen",
      fontId: "gfs-didot-regular",
      answerFontIds: [
        "gfs-didot-regular",
        "bodoni-moda-regular",
        "playfair-display-regular",
        "source-serif-4-regular",
      ],
      correctAnswerIndex: 0,
      explanation:
        "GFS Didot is a modern digital revival associated with the Didone tradition and Greek Font Society's historical type research; it is not Firmin Didot's original font file.",
    }),
    specimenQuestion({
      id: "classic-playfair-specimen",
      fontId: "playfair-display-regular",
      answerFontIds: [
        "playfair-display-regular",
        "bodoni-moda-regular",
        "gfs-didot-regular",
        "libre-baskerville-regular",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Playfair Display is a contemporary display face that evokes late-eighteenth-century European typography. Historical inspiration does not make it an original period design.",
    }),
    specimenQuestion({
      id: "classic-arvo-specimen",
      fontId: "arvo-regular",
      answerFontIds: [
        "arvo-regular",
        "source-serif-4-regular",
        "crimson-roman",
        "libre-baskerville-regular",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Arvo is a contemporary slab serif. Its block-like serifs are heavier and squarer than the bracketed serifs of the text faces shown as distractors.",
    }),
    specimenQuestion({
      id: "classic-crimson-specimen",
      fontId: "crimson-roman",
      answerFontIds: [
        "crimson-roman",
        "libre-baskerville-regular",
        "source-serif-4-regular",
        "lora-regular",
      ],
      correctAnswerIndex: 0,
      explanation:
        "This is the public catalog's Crimson Roman specimen. Its visual appearance can be compared here, but the catalog does not establish a historical designer or source tradition for this file.",
    }),
    specimenQuestion({
      id: "classic-inter-specimen",
      fontId: "inter-regular",
      answerFontIds: [
        "inter-regular",
        "jost-variable-regular",
        "arvo-regular",
        "crimson-roman",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Inter is a contemporary sans serif designed by Rasmus Andersson for screen and interface use. Its lack of serifs provides a clear structural contrast to the serif families.",
    }),
    specimenQuestion({
      id: "classic-jost-variable-specimen",
      fontId: "jost-variable-regular",
      answerFontIds: [
        "jost-variable-regular",
        "jost-variable-italic",
        "jost-medium",
        "inter-regular",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Jost is a contemporary geometric design by Owen Earl, inspired by 1920s German sans-serifs. This regular variable-font specimen is a comparison for that broader tradition, not Futura; its italic is a separate file.",
    }),
    specimenQuestion({
      id: "classic-pirata-specimen",
      fontId: "pirata-one-regular",
      answerFontIds: [
        "pirata-one-regular",
        "fette-classic-unz-fraktur",
        "inter-regular",
        "bodoni-moda-regular",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Pirata One is a contemporary blackletter-inspired display design, not a historical Fraktur printing artifact.",
    }),
    specimenQuestion({
      id: "classic-fette-fraktur-specimen",
      fontId: "fette-classic-unz-fraktur",
      answerFontIds: [
        "fette-classic-unz-fraktur",
        "pirata-one-regular",
        "inter-regular",
        "arvo-regular",
      ],
      correctAnswerIndex: 0,
      explanation:
        "The catalog identifies this specimen as Fette Classic UNZ Fraktur. Fraktur is a particular blackletter tradition; this label alone does not date or authenticate the supplied font file.",
    }),
  ],
  23,
);

const historicalTypographyQuiz = makeQuiz(
  QUIZ_IDS.historicalTypography,
  "Historical Typography: From Manuscript to Print",
  "Identify public type specimens associated with different writing systems and typographic traditions.",
  [
    specimenQuestion({
      id: "historical-eb-garamond-specimen",
      fontId: "eb-garamond-regular",
      answerFontIds: [
        "eb-garamond-regular",
        "bodoni-moda-regular",
        "noto-cuneiform-regular",
        "inter-regular",
      ],
      correctAnswerIndex: 0,
      explanation:
        "EB Garamond is a contemporary digital interpretation of historical Garamond models, not an original sixteenth-century font.",
    }),
    specimenQuestion({
      id: "historical-cuneiform-specimen",
      fontId: "noto-cuneiform-regular",
      answerFontIds: [
        "noto-cuneiform-regular",
        "noto-egyptian-hieroglyphs",
        "eb-garamond-regular",
        "pirata-one-regular",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Noto Sans Cuneiform maps encoded Cuneiform characters to glyphs; it does not translate them or establish a historical artifact.",
    }),
  ],
);

export const collectionQuizDefinitions = [
  {
    id: QUIZ_IDS.historicallyImportant,
    quiz: historicallyImportantQuiz,
    route: `/quizzes/${QUIZ_IDS.historicallyImportant}/`,
    collectionIds: ["historically-important"],
    format: "font-identification",
    difficulty: "beginner",
  },
  {
    id: QUIZ_IDS.blackletterGothic,
    quiz: blackletterGothicQuiz,
    route: `/quizzes/${QUIZ_IDS.blackletterGothic}/`,
    collectionIds: ["blackletter-gothic"],
    format: "font-identification",
    difficulty: "beginner",
  },
  {
    id: QUIZ_IDS.serifBook,
    quiz: serifBookQuiz,
    route: `/quizzes/${QUIZ_IDS.serifBook}/`,
    collectionIds: ["serif-book"],
    format: "font-identification",
    difficulty: "beginner",
  },
  {
    id: QUIZ_IDS.sansGeometric,
    quiz: sansGeometricQuiz,
    route: `/quizzes/${QUIZ_IDS.sansGeometric}/`,
    collectionIds: ["sans-geometric"],
    format: "font-identification",
    difficulty: "beginner",
  },
  {
    id: QUIZ_IDS.displayDecorative,
    quiz: displayDecorativeQuiz,
    route: `/quizzes/${QUIZ_IDS.displayDecorative}/`,
    collectionIds: ["display-decorative"],
    format: "font-identification",
    difficulty: "beginner",
  },
  {
    id: QUIZ_IDS.handwritingScript,
    quiz: handwritingScriptQuiz,
    route: `/quizzes/${QUIZ_IDS.handwritingScript}/`,
    collectionIds: ["handwriting-script"],
    format: "font-identification",
    difficulty: "beginner",
  },
  {
    id: QUIZ_IDS.experimentalNovelty,
    quiz: experimentalNoveltyQuiz,
    route: `/quizzes/${QUIZ_IDS.experimentalNovelty}/`,
    collectionIds: ["experimental-novelty"],
    format: "font-identification",
    difficulty: "beginner",
  },
  {
    id: QUIZ_IDS.symbolsWritingSystems,
    quiz: symbolsWritingSystemsQuiz,
    route: `/quizzes/${QUIZ_IDS.symbolsWritingSystems}/`,
    collectionIds: ["symbols-writing-systems"],
    format: "font-identification",
    difficulty: "beginner",
  },
  {
    id: QUIZ_IDS.classicTypefaces,
    quiz: classicTypefacesQuiz,
    route: `/quizzes/${QUIZ_IDS.classicTypefaces}/`,
    collectionIds: ["classic-typefaces"],
    format: "font-identification",
    difficulty: "beginner",
  },
  {
    id: QUIZ_IDS.historicalTypography,
    quiz: historicalTypographyQuiz,
    route: `/quizzes/${QUIZ_IDS.historicalTypography}/`,
    collectionIds: ["historical-typography"],
    format: "font-identification",
    difficulty: "beginner",
  },
] as const satisfies readonly CollectionQuizDefinition[];
