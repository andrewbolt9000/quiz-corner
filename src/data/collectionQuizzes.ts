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

type TextQuestionDefinition = {
  id: string;
  prompt: string;
  answers: readonly [string, string, string, string];
  correctAnswerIndex: AnswerIndex;
  explanation: string;
};

type SpecimenQuestionDefinition = {
  id: string;
  prompt: string;
  fontId: PublicFontId;
  answerFontIds: readonly [
    PublicFontId,
    PublicFontId,
    PublicFontId,
    PublicFontId,
  ];
  correctAnswerIndex: AnswerIndex;
  explanation: string;
  sampleText: string;
};

export type CollectionQuizDefinition = {
  id: QuizId;
  quiz: QuizData;
  route: string;
  collectionIds: readonly FontCollectionId[];
  format: QuizFormat;
  difficulty: QuizDifficulty;
};

function textQuestion({
  id,
  prompt,
  answers,
  correctAnswerIndex,
  explanation,
}: TextQuestionDefinition): QuizQuestion {
  if (new Set(answers).size !== 4) {
    throw new Error(`Question "${id}" must have four distinct answers.`);
  }

  return {
    id,
    answers,
    correctAnswerIndex,
    content: {
      kind: "text",
      prompt,
      explanation,
    },
  };
}

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
  prompt,
  fontId,
  answerFontIds,
  correctAnswerIndex,
  explanation,
  sampleText,
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
      prompt,
      explanation,
      specimen: {
        fontId: font.id,
        fontFamily: font.family,
        fontWeight: font.weight,
        fontStyle: font.style,
        sampleText,
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
): QuizData {
  if (questions.length < 5 || questions.length > 8) {
    throw new Error(`Collection quiz "${id}" must contain 5-8 questions.`);
  }

  return { id, title, description, questions };
}

const historicallyImportantQuiz = makeQuiz(
  QUIZ_IDS.historicallyImportant,
  "Historically Important: Reading Type in Context",
  "Learn to separate a type style's historical influence from claims about the age or origin of a particular font file.",
  [
    specimenQuestion({
      id: "history-style-fette-specimen",
      prompt: "Which cleared catalog face is shown?",
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
      sampleText: "Fraktur: forms, strokes, and printed words.",
    }),
    textQuestion({
      id: "history-style-evidence",
      prompt:
        "What is the strongest evidence that a specific font file is a historical artifact?",
      answers: [
        "A documented chain of custody and dated primary evidence",
        "A modern file name containing the word 'classic'",
        "A visual resemblance to an old printed page",
        "A collection label chosen for the file",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Dated primary evidence and documented provenance support claims about a particular artifact. A style resemblance or modern label alone cannot establish when a file was made.",
    }),
    textQuestion({
      id: "history-style-revival",
      prompt:
        "A current type design redraws letterforms from an older model. What is the careful way to describe it?",
      answers: [
        "A modern revival or interpretation of that model",
        "The original historical printing type",
        "A manuscript written in the older period",
        "A verified scan of the original punches",
      ],
      correctAnswerIndex: 0,
      explanation:
        "A revival is a later design based on an earlier model. It can evoke historical forms without being the original type or artifact.",
    }),
    textQuestion({
      id: "history-style-influence",
      prompt:
        "When discussing a type style's influence, which claim is best supported by comparing dated examples?",
      answers: [
        "How visible design features changed or persisted over time",
        "The exact maker of every undated digital font",
        "That all designs in the style came from one workshop",
        "That the style has one fixed meaning in every culture",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Comparing dated examples can show formal continuities and changes. It does not by itself establish the maker or meaning of every later design.",
    }),
    textQuestion({
      id: "history-style-catalog-scope",
      prompt:
        "What does assignment to the Historically Important collection establish?",
      answers: [
        "That the record is grouped under this site's editorial category",
        "That the font file is an original historical artifact",
        "That the file is licensed for every kind of reuse",
        "That its designer and date have been independently verified",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Collection membership is an editorial classification. It does not authenticate a file, verify its designer or date, or determine its license.",
    }),
  ],
);

const blackletterGothicQuiz = makeQuiz(
  QUIZ_IDS.blackletterGothic,
  "Blackletter & Gothic: Forms and Printing",
  "Recognize common blackletter features and learn how manuscript letterforms informed early European printing.",
  [
    specimenQuestion({
      id: "blackletter-fette-unz-specimen",
      prompt: "Which cleared catalog face is shown?",
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
      sampleText: "Blackletter forms meet the printed page.",
    }),
    textQuestion({
      id: "blackletter-angular-strokes",
      prompt:
        "Which visual feature is commonly associated with many blackletter forms?",
      answers: [
        "Angular strokes and compact, textured letter shapes",
        "Only circular outlines with no vertical strokes",
        "Monoline letters built only from geometric circles",
        "Characters composed entirely of detached symbols",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Many blackletter styles use angular forms and dense textures. Blackletter includes several traditions, so no single feature describes every example.",
    }),
    textQuestion({
      id: "blackletter-fraktur-scope",
      prompt: "How should the term Fraktur be used?",
      answers: [
        "As the name of a particular blackletter style or family of forms",
        "As a synonym for every handwritten script in every language",
        "As the name for all sans-serif typefaces",
        "As a generic term for any modern digital font file",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Fraktur refers to a particular blackletter tradition, not to all scripts or all digital fonts.",
    }),
    textQuestion({
      id: "blackletter-gutenberg",
      prompt: "Which statement about Gutenberg's 42-line Bible is accurate?",
      answers: [
        "Its type was based on contemporary blackletter manuscript forms",
        "It was the first use of printing anywhere in the world",
        "It was typeset in a twentieth-century geometric sans serif",
        "It was written by hand after printing was invented",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Gutenberg's Bible used blackletter type modeled on manuscript hands of its time. Printing and movable-type technologies had earlier histories outside Europe.",
    }),
    textQuestion({
      id: "blackletter-readability",
      prompt:
        "Why can two blackletter designs feel different even when both share the category label?",
      answers: [
        "They can differ in stroke contrast, spacing, proportions, and details",
        "The category requires every letter to have identical proportions",
        "The label fixes one universal point size and line length",
        "Blackletter has no variation between styles",
      ],
      correctAnswerIndex: 0,
      explanation:
        "A broad category can contain substantial variation in construction, spacing, contrast, and texture.",
    }),
  ],
);

const serifBookQuiz = makeQuiz(
  QUIZ_IDS.serifBook,
  "Serif & Book Typography: Reading the Page",
  "Practice core terms for describing letterforms and setting comfortable long-form text.",
  [
    textQuestion({
      id: "serif-book-serif",
      prompt: "What is a serif?",
      answers: [
        "A small finishing stroke attached to a letterform",
        "The vertical space between two lines of type",
        "The overall length of a paragraph",
        "The gap between a pair of words",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Serifs are finishing strokes associated with the ends of some letterforms. Serif shapes vary widely across typefaces.",
    }),
    textQuestion({
      id: "serif-book-leading",
      prompt:
        "In typography, what does leading describe in a block of text?",
      answers: [
        "The spacing from one line of type to the next",
        "The thickness of a letter's main stroke",
        "The space between two letters in a pair",
        "The width of the page margin",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Leading is the vertical spacing between lines of type, traditionally measured baseline to baseline.",
    }),
    textQuestion({
      id: "serif-book-measure",
      prompt: "What is the measure of a line of text?",
      answers: [
        "Its length or width, often expressed as characters or picas",
        "The darkness of the ink on the page",
        "The angle of an italic letter",
        "The distance between a word and its footnote",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Measure describes line length. It affects how easily a reader can track from one line to the next.",
    }),
    textQuestion({
      id: "serif-book-kerning",
      prompt: "What does kerning adjust?",
      answers: [
        "The spacing between a specific pair of characters",
        "The spacing between all lines in a paragraph",
        "The width of every margin on a page",
        "The contrast between thick and thin strokes",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Kerning adjusts the spacing of a particular character pair; tracking changes spacing across a range of text.",
    }),
    textQuestion({
      id: "serif-book-typeface-face",
      prompt: "What is the clearest distinction between a typeface and a face?",
      answers: [
        "A typeface is a design family; a face is one style or weight in it",
        "A typeface is a page size; a face is a printing press",
        "A typeface is a paragraph; a face is a line break",
        "They are exact synonyms for point size",
      ],
      correctAnswerIndex: 0,
      explanation:
        "A typeface family groups related designs, while a face commonly refers to a particular style or weight within that family.",
    }),
  ],
);

const sansGeometricQuiz = makeQuiz(
  QUIZ_IDS.sansGeometric,
  "Sans Serif & Geometric: Shape and Spacing",
  "Identify the collection's cleared sans-serif specimen and learn to describe geometry and spacing without overgeneralizing.",
  [
    specimenQuestion({
      id: "sans-jost-specimen",
      prompt: "Which cleared catalog face is shown?",
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
      sampleText: "Clear shapes support a useful reading rhythm.",
    }),
    textQuestion({
      id: "sans-definition",
      prompt: "What generally distinguishes a sans-serif letterform?",
      answers: [
        "It lacks the finishing strokes called serifs",
        "It must be drawn from perfect circles",
        "It always uses a single uniform stroke width",
        "It can only be used for headings",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Sans serif is a broad classification based on the absence of serifs; it does not require geometric construction or a single use.",
    }),
    textQuestion({
      id: "sans-geometric-description",
      prompt:
        "When a typeface is described as geometric, what does that usually refer to?",
      answers: [
        "Letterforms that visibly draw on simple geometric shapes",
        "A guarantee that every glyph is a perfect mathematical circle",
        "A rule that the typeface contains no lowercase letters",
        "A claim that the file was made by a geometry textbook publisher",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Geometric describes a visual tendency toward simple shapes. Real letterforms still make optical adjustments for balance and legibility.",
    }),
    textQuestion({
      id: "sans-tracking",
      prompt: "What does tracking change?",
      answers: [
        "Spacing across a range of letters or a whole word",
        "Spacing between one specific pair only",
        "The vertical distance between baselines",
        "The height of capital letters",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Tracking adjusts letter spacing more broadly across a word or text range; kerning targets a specific pair.",
    }),
    textQuestion({
      id: "sans-category-range",
      prompt:
        "Which statement best describes the relationship between sans serif and geometric?",
      answers: [
        "Sans serif is a broad category; geometric describes one visual tendency",
        "Every sans serif is geometric in exactly the same way",
        "Geometric describes only serif typefaces",
        "The terms identify a font's license rather than its design",
      ],
      correctAnswerIndex: 0,
      explanation:
        "A sans-serif design can be humanist, grotesque, geometric, or otherwise varied. The labels describe different levels of visual classification.",
    }),
  ],
);

const displayDecorativeQuiz = makeQuiz(
  QUIZ_IDS.displayDecorative,
  "Display & Decorative: Type with a Voice",
  "Study how expressive letterforms attract attention and why display typography depends on context and scale.",
  [
    specimenQuestion({
      id: "display-gloria-specimen",
      prompt: "Which cleared catalog face is shown?",
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
      sampleText: "A lively voice can make a short heading stand out.",
    }),
    textQuestion({
      id: "display-purpose",
      prompt: "What is a common purpose of display type?",
      answers: [
        "To attract attention in titles, short text, or signage",
        "To guarantee comfortable reading at every tiny size",
        "To replace all spacing and layout decisions",
        "To encode a document's publication date",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Display designs are often chosen for emphasis in short text or at larger sizes; their suitability depends on context.",
    }),
    textQuestion({
      id: "display-scale",
      prompt:
        "Why should an expressive display face be checked at its intended size?",
      answers: [
        "Small details and spacing can behave differently at different sizes",
        "A typeface's category changes whenever its point size changes",
        "Large text automatically receives a different license",
        "Point size determines the historical age of the design",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Scale changes the visibility of details and the apparent spacing of letterforms, so intended-size proofing matters.",
    }),
    textQuestion({
      id: "display-hierarchy",
      prompt: "What does typographic hierarchy help a reader understand?",
      answers: [
        "The relative importance and order of information",
        "The exact source folder of a font file",
        "The mathematical formula used to draw each glyph",
        "The number of letters in a typeface",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Hierarchy uses differences such as size, weight, placement, and spacing to signal how information is organized.",
    }),
    textQuestion({
      id: "display-decoration",
      prompt:
        "When can decorative letterforms make a message harder to read?",
      answers: [
        "When their detail or density overwhelms the text at the chosen size",
        "Whenever the text contains a capital letter",
        "Only when the typeface has a license",
        "Never; decoration always improves legibility",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Expressive details can compete with the message, especially at unsuitable sizes or in long passages.",
    }),
  ],
);

const handwritingScriptQuiz = makeQuiz(
  QUIZ_IDS.handwritingScript,
  "Handwriting & Script: Strokes and Lettering",
  "Explore lettering that evokes handwriting while distinguishing a designed font from a handwritten original.",
  [
    specimenQuestion({
      id: "handwriting-gochi-specimen",
      prompt: "Which cleared catalog face is shown?",
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
      sampleText: "A note can feel personal through its letterforms.",
    }),
    textQuestion({
      id: "handwriting-script-definition",
      prompt: "What is a useful way to describe a script typeface?",
      answers: [
        "A type design that evokes forms associated with writing or lettering",
        "Any alphabet whose letters are always connected",
        "A scan that must come from an original handwritten page",
        "A typeface that can only contain punctuation",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Script is a broad design classification. Some scripts connect letters, but a font's appearance does not prove that it was written by hand.",
    }),
    textQuestion({
      id: "handwriting-calligraphy",
      prompt:
        "Which statement best distinguishes calligraphy from an ordinary font file?",
      answers: [
        "Calligraphy is skilled lettering or handwriting; a font is a reusable digital design",
        "Calligraphy is always machine printed; a font is always handwritten",
        "Calligraphy describes only lowercase letters",
        "A calligraphic-looking font is automatically a historical manuscript",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Calligraphy is a practice and art of lettering. A font can imitate some calligraphic features without being a handwritten artifact.",
    }),
    textQuestion({
      id: "handwriting-legibility",
      prompt:
        "What should be considered when using a handwriting-inspired face for body text?",
      answers: [
        "Whether its shapes and spacing remain clear across a long passage",
        "Whether every letter is connected to the next",
        "Whether its name identifies a verified historical author",
        "Whether it removes the need for line spacing",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Decorative or handwriting-inspired forms can tire readers in long text; test them in the actual size and context.",
    }),
    textQuestion({
      id: "handwriting-rhythm",
      prompt: "What gives many handwritten letterforms their distinctive rhythm?",
      answers: [
        "Repeated movements, stroke direction, and spacing patterns",
        "A requirement that all strokes have identical widths",
        "The absence of any baseline or alignment",
        "A fixed number of letters in every word",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Stroke movement and spacing contribute to the rhythm of handwriting and lettering. A digital design can imitate these visual cues.",
    }),
  ],
);

const experimentalNoveltyQuiz = makeQuiz(
  QUIZ_IDS.experimentalNovelty,
  "Experimental & Novelty: Design by Contrast",
  "Learn to evaluate unusual letterforms by their intended communication, consistency, and reading context.",
  [
    textQuestion({
      id: "experimental-purpose",
      prompt:
        "What is a sensible first question when evaluating an experimental typeface?",
      answers: [
        "What message and context is this design intended to serve?",
        "Which local font folder did the file come from?",
        "How can the design be used without considering its audience?",
        "Does its unusual appearance prove it is historically old?",
      ],
      correctAnswerIndex: 0,
      explanation:
        "An experimental design should be judged in context: audience, message, scale, and use all affect whether its choices work.",
    }),
    textQuestion({
      id: "experimental-consistency",
      prompt:
        "What does internal consistency mean when reviewing an unusual type design?",
      answers: [
        "Its distinctive choices form a recognizable system across characters",
        "Every character must be identical",
        "The design must copy a historical typeface exactly",
        "All letters must have the same width and shape",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Consistency means the design's choices relate coherently; it does not require every glyph to look alike.",
    }),
    textQuestion({
      id: "experimental-legibility",
      prompt:
        "How can a designer check whether a novelty face works for a short label?",
      answers: [
        "Proof it at the intended size with the actual words and contrast",
        "Judge it only from its family name",
        "Assume it works because it is unusual",
        "Replace all spacing with decorative symbols",
      ],
      correctAnswerIndex: 0,
      explanation:
        "A real-size proof reveals whether the actual wording, scale, and contrast remain understandable.",
    }),
    textQuestion({
      id: "experimental-provenance",
      prompt:
        "A novelty font resembles an older lettering style. What does that resemblance prove?",
      answers: [
        "Only a visual relationship; provenance needs separate evidence",
        "That the font file was made in the older period",
        "That the file came from the original lettering artist",
        "That the font is a scan of a historical artifact",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Visual resemblance can suggest influence, but it does not establish a file's date, maker, or chain of custody.",
    }),
    textQuestion({
      id: "experimental-category",
      prompt:
        "Why might a collection use an Experimental & Novelty category?",
      answers: [
        "To group designs whose unusual features are central to their character",
        "To certify that every included design is a historical original",
        "To state that the fonts share one file format",
        "To guarantee that the designs are suitable for long body text",
      ],
      correctAnswerIndex: 0,
      explanation:
        "The category describes an editorial grouping of expressive or unusual designs, not their provenance, format, or universal suitability.",
    }),
  ],
);

const symbolsWritingSystemsQuiz = makeQuiz(
  QUIZ_IDS.symbolsWritingSystems,
  "Symbols & Writing Systems: Signs and Meaning",
  "Identify the collection's cleared Egyptian hieroglyph specimen and learn how writing systems can encode language.",
  [
    specimenQuestion({
      id: "symbols-egyptian-specimen",
      prompt: "Which cleared catalog face is shown?",
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
      sampleText: "𓀀 𓀁 𓀂 𓀃 𓀄 𓀅",
    }),
    textQuestion({
      id: "symbols-logogram",
      prompt: "What does a logogram represent?",
      answers: [
        "A word or meaningful unit",
        "A line of text spacing",
        "A font's licensing status",
        "Only the shape of a page margin",
      ],
      correctAnswerIndex: 0,
      explanation:
        "A logogram is a sign representing a word or meaningful unit; writing systems may combine different sign functions.",
    }),
    textQuestion({
      id: "symbols-phonogram",
      prompt: "What does a phonogram primarily represent?",
      answers: [
        "A sound or sequence of sounds",
        "A paragraph's visual hierarchy",
        "A typeface's historical date",
        "A printed page's physical size",
      ],
      correctAnswerIndex: 0,
      explanation:
        "A phonogram represents sound. Some writing systems use signs in more than one way depending on context.",
    }),
    textQuestion({
      id: "symbols-determinative",
      prompt:
        "In descriptions of Egyptian hieroglyphic writing, what can a determinative do?",
      answers: [
        "Clarify a word's semantic category without being read as its sound",
        "Set the line spacing of a printed paragraph",
        "Name the person who digitized a font",
        "Turn any sign into a Latin letter",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Determinatives can help indicate a word's meaning category and are not pronounced as ordinary sound signs.",
    }),
    textQuestion({
      id: "symbols-font-translation",
      prompt:
        "What can you safely conclude when a font renders a symbol from a writing system?",
      answers: [
        "The font maps a character to a glyph; interpretation still needs language knowledge",
        "The glyph's meaning and pronunciation are obvious from its shape alone",
        "Every glyph in the writing system is included in the font",
        "The font file proves when and where the writing system began",
      ],
      correctAnswerIndex: 0,
      explanation:
        "A font supplies glyph shapes for encoded characters. It does not guarantee complete coverage or provide a translation.",
    }),
  ],
);

const classicTypefacesQuiz = makeQuiz(
  QUIZ_IDS.classicTypefaces,
  "Classic Typefaces: Forms and Structure",
  "Practice foundational terms for describing letterforms and comparing type designs.",
  [
    textQuestion({
      id: "classic-family",
      prompt: "What is a typeface family?",
      answers: [
        "A group of related designs, often with different weights or styles",
        "A group of unrelated fonts stored in one folder",
        "A collection of words that use the same language",
        "A printing method for reproducing photographs",
      ],
      correctAnswerIndex: 0,
      explanation:
        "A family groups related type designs, often including multiple weights, widths, or styles.",
    }),
    textQuestion({
      id: "classic-x-height",
      prompt: "What does x-height measure?",
      answers: [
        "The height of lowercase letters such as x, excluding ascenders and descenders",
        "The total height of a capital letter above the baseline",
        "The distance between two lines of type",
        "The width of a lowercase letter across its side bearings",
      ],
      correctAnswerIndex: 0,
      explanation:
        "X-height describes the height of the main body of lowercase letters, commonly referenced to the letter x.",
    }),
    textQuestion({
      id: "classic-counter",
      prompt: "What is a counter in a letterform?",
      answers: [
        "The enclosed or partly enclosed space within a letter",
        "The vertical space between lines of text",
        "The finishing stroke at the end of a letter",
        "The amount of space between two words",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Counters are the enclosed or partly enclosed areas inside forms such as o, d, and e.",
    }),
    textQuestion({
      id: "classic-descender",
      prompt: "What is a descender?",
      answers: [
        "A part of a lowercase letter that extends below the baseline",
        "A part of a lowercase letter that rises above the x-height",
        "The space enclosed within a letterform",
        "The space between adjacent lines of text",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Descenders extend below the baseline, as in the lower parts of letters such as p and g.",
    }),
    textQuestion({
      id: "classic-stroke-contrast",
      prompt: "What does stroke contrast describe?",
      answers: [
        "The difference between thick and thin strokes in a letterform",
        "The difference between the ink and the paper color",
        "The distance between words in a paragraph",
        "The alignment of a headline and a caption",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Stroke contrast describes variation in stroke thickness within letterforms; it is one feature used to compare type designs.",
    }),
  ],
);

const historicalTypographyQuiz = makeQuiz(
  QUIZ_IDS.historicalTypography,
  "Historical Typography: From Manuscript to Print",
  "Trace broad changes in writing and printing while avoiding the myth that one invention began all printing everywhere.",
  [
    textQuestion({
      id: "historical-manuscript",
      prompt: "What is a manuscript in the context of book history?",
      answers: [
        "A work written by hand rather than mechanically printed",
        "A sheet made only by a digital printer",
        "A typeface classification based on serifs",
        "A font file that contains no letterforms",
      ],
      correctAnswerIndex: 0,
      explanation:
        "A manuscript is written by hand. Manuscript and print traditions continued to coexist after printing spread.",
    }),
    textQuestion({
      id: "historical-movable-type",
      prompt: "What is movable type?",
      answers: [
        "Reusable individual pieces bearing characters that can be arranged into text",
        "A handwritten page that cannot be copied",
        "A single engraved image of a complete book page",
        "A method for changing a font's screen size",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Movable type uses reusable character-bearing pieces that can be arranged and recombined to print different text.",
    }),
    textQuestion({
      id: "historical-printing-origins",
      prompt:
        "Which statement gives a careful account of printing's history?",
      answers: [
        "Printing traditions existed in East Asia before Gutenberg's European press",
        "Gutenberg invented every form of printing used around the world",
        "Printing began only after digital fonts were created",
        "Manuscripts stopped being made as soon as print appeared",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Printing has histories in multiple regions. Gutenberg is associated with the development of European movable-type printing, not the invention of all printing.",
    }),
    textQuestion({
      id: "historical-gutenberg-bible",
      prompt:
        "What is a useful connection between Gutenberg's Bible and typography?",
      answers: [
        "Its printed letterforms drew on manuscript styles familiar to readers",
        "It was set in a twenty-first-century variable font",
        "It proves that handwritten books disappeared immediately",
        "It used only symbols from the Egyptian hieroglyphic script",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Early European printed books often used letterforms modeled on contemporary manuscript hands, including blackletter forms.",
    }),
    textQuestion({
      id: "historical-printing-impact",
      prompt:
        "What was one important effect of printing with reusable type?",
      answers: [
        "It made it possible to reproduce many copies from arranged type",
        "It made every copy completely identical in every material detail",
        "It removed the need for writers or editors",
        "It made paper unnecessary for all publications",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Reusable type helped produce multiple copies of a text. Copies could still vary in ink, paper, impression, and later corrections.",
    }),
  ],
);

export const collectionQuizDefinitions = [
  {
    id: QUIZ_IDS.historicallyImportant,
    quiz: historicallyImportantQuiz,
    route: `/quizzes/${QUIZ_IDS.historicallyImportant}/`,
    collectionIds: ["historically-important"],
    format: "mixed",
    difficulty: "beginner",
  },
  {
    id: QUIZ_IDS.blackletterGothic,
    quiz: blackletterGothicQuiz,
    route: `/quizzes/${QUIZ_IDS.blackletterGothic}/`,
    collectionIds: ["blackletter-gothic"],
    format: "mixed",
    difficulty: "beginner",
  },
  {
    id: QUIZ_IDS.serifBook,
    quiz: serifBookQuiz,
    route: `/quizzes/${QUIZ_IDS.serifBook}/`,
    collectionIds: ["serif-book"],
    format: "typeface-characteristics",
    difficulty: "beginner",
  },
  {
    id: QUIZ_IDS.sansGeometric,
    quiz: sansGeometricQuiz,
    route: `/quizzes/${QUIZ_IDS.sansGeometric}/`,
    collectionIds: ["sans-geometric"],
    format: "mixed",
    difficulty: "beginner",
  },
  {
    id: QUIZ_IDS.displayDecorative,
    quiz: displayDecorativeQuiz,
    route: `/quizzes/${QUIZ_IDS.displayDecorative}/`,
    collectionIds: ["display-decorative"],
    format: "mixed",
    difficulty: "beginner",
  },
  {
    id: QUIZ_IDS.handwritingScript,
    quiz: handwritingScriptQuiz,
    route: `/quizzes/${QUIZ_IDS.handwritingScript}/`,
    collectionIds: ["handwriting-script"],
    format: "mixed",
    difficulty: "beginner",
  },
  {
    id: QUIZ_IDS.experimentalNovelty,
    quiz: experimentalNoveltyQuiz,
    route: `/quizzes/${QUIZ_IDS.experimentalNovelty}/`,
    collectionIds: ["experimental-novelty"],
    format: "typeface-characteristics",
    difficulty: "beginner",
  },
  {
    id: QUIZ_IDS.symbolsWritingSystems,
    quiz: symbolsWritingSystemsQuiz,
    route: `/quizzes/${QUIZ_IDS.symbolsWritingSystems}/`,
    collectionIds: ["symbols-writing-systems"],
    format: "mixed",
    difficulty: "beginner",
  },
  {
    id: QUIZ_IDS.classicTypefaces,
    quiz: classicTypefacesQuiz,
    route: `/quizzes/${QUIZ_IDS.classicTypefaces}/`,
    collectionIds: ["classic-typefaces"],
    format: "typeface-characteristics",
    difficulty: "beginner",
  },
  {
    id: QUIZ_IDS.historicalTypography,
    quiz: historicalTypographyQuiz,
    route: `/quizzes/${QUIZ_IDS.historicalTypography}/`,
    collectionIds: ["historical-typography"],
    format: "historical-knowledge",
    difficulty: "beginner",
  },
] as const satisfies readonly CollectionQuizDefinition[];
