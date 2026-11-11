import { QUIZ_IDS } from "./quizIds";
import type { AnswerIndex, QuizData, QuizQuestion } from "./quizzes";

type KnowledgeQuestionDefinition = {
  id: string;
  prompt: string;
  answers: readonly [string, string, string, string];
  correctAnswerIndex: AnswerIndex;
  explanation: string;
};

function knowledgeQuestion({
  id,
  prompt,
  answers,
  correctAnswerIndex,
  explanation,
}: KnowledgeQuestionDefinition): QuizQuestion {
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

export const fontKnowledgeQuiz = {
  id: QUIZ_IDS.fontKnowledge,
  title: "Font Knowledge",
  description:
    "Test your knowledge of type anatomy, classifications, designers, printing history, and digital font technology. No specimen identification is required.",
  questions: [
    knowledgeQuestion({
      id: "knowledge-counter",
      prompt: "In type anatomy, what is a counter?",
      answers: [
        "An enclosed or partially enclosed space within a letter",
        "The short finishing stroke at the end of a stem",
        "The vertical portion of a lowercase letter above the x-height",
        "The distance between two lines of type",
      ],
      correctAnswerIndex: 0,
      explanation:
        "A counter is an enclosed or partly enclosed negative space, as in the bowls of “o” and “e.”",
    }),
    knowledgeQuestion({
      id: "knowledge-bowl",
      prompt: "Which term describes a curved stroke enclosing a counter?",
      answers: ["Bowl", "Aperture", "Ascender", "Terminal"],
      correctAnswerIndex: 0,
      explanation:
        "A bowl is the curved, enclosing stroke found in letters such as “b,” “d,” and “o.”",
    }),
    knowledgeQuestion({
      id: "knowledge-x-height",
      prompt: "What does x-height measure?",
      answers: [
        "The height of the main body of lowercase letters, typically excluding ascenders and descenders",
        "The full height from the lowest descender to the tallest capital",
        "The width of the lowercase letter x",
        "The distance between adjacent baselines",
      ],
      correctAnswerIndex: 0,
      explanation:
        "X-height is the height of the lowercase body, commonly measured by the height of “x”; it affects apparent size and texture.",
    }),
    knowledgeQuestion({
      id: "knowledge-ascender-descender",
      prompt: "Which statement correctly distinguishes an ascender from a descender?",
      answers: [
        "An ascender rises above the x-height; a descender extends below the baseline",
        "An ascender is a serif; a descender is a counter",
        "An ascender is always italic; a descender is always roman",
        "An ascender is the space inside a bowl; a descender is the space between letters",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Ascenders, as in “h,” extend above the lowercase body; descenders, as in “p” or “g,” extend below the baseline.",
    }),
    knowledgeQuestion({
      id: "knowledge-aperture",
      prompt: "What is an aperture in a letterform?",
      answers: [
        "An opening between a stroke's terminals, as in the opening of “c”",
        "The enclosed space inside “o”",
        "The vertical stroke of “l”",
        "The small line joining a serif to a stem",
      ],
      correctAnswerIndex: 0,
      explanation:
        "An aperture is the opening into a partially enclosed counter, especially visible in letters such as “c,” “e,” and “s.”",
    }),
    knowledgeQuestion({
      id: "knowledge-oldstyle",
      prompt: "Which group of traits is commonly associated with old-style serif type?",
      answers: [
        "Diagonal stress, moderate contrast, and bracketed serifs",
        "Vertical stress, extreme contrast, and unbracketed hairline serifs",
        "Uniform strokes and no serifs",
        "Heavy rectangular serifs and nearly uniform strokes",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Old-style designs often show diagonal stress, moderate contrast, and bracketed serifs. These are broad tendencies, not rigid rules.",
    }),
    knowledgeQuestion({
      id: "knowledge-didone",
      prompt: "Which features are characteristic of the Didone classification?",
      answers: [
        "High stroke contrast, vertical stress, and fine unbracketed serifs",
        "Low contrast, diagonal stress, and softly bracketed serifs",
        "Monoline strokes with no finishing strokes",
        "Broad slab serifs with minimal stroke contrast",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Didone faces are commonly recognized by strong thick-thin contrast, vertical stress, and fine, sharply finished serifs.",
    }),
    knowledgeQuestion({
      id: "knowledge-slab-serif",
      prompt: "What most clearly distinguishes a slab serif from a typical old-style serif?",
      answers: [
        "Its serifs are generally substantial and block-like",
        "It has no serifs and uniform strokes",
        "It must be set in uppercase only",
        "Its letters are always connected like handwriting",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Slab serifs are typically large, block-like finishing strokes. Slab-serif designs vary in contrast and construction.",
    }),
    knowledgeQuestion({
      id: "knowledge-grotesque",
      prompt: "In type classification, “grotesque” most often refers to which category?",
      answers: [
        "An early or traditional sans-serif category",
        "A kind of calligraphic connected script",
        "A high-contrast Didone serif",
        "A font file containing only pictograms",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Grotesque is a historical classification for sans-serif type, with later categories such as neo-grotesque often used for subsequent developments.",
    }),
    knowledgeQuestion({
      id: "knowledge-humanist-sans",
      prompt: "Which design tendency is commonly associated with humanist sans serifs?",
      answers: [
        "Forms that may reflect calligraphic influence and varied proportions",
        "A requirement for hairline unbracketed serifs",
        "Every character having exactly the same width",
        "Letters constructed only from perfect circles and straight lines",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Humanist sans serifs often show calligraphic influence, open forms, and varied proportions, though individual designs differ.",
    }),
    knowledgeQuestion({
      id: "knowledge-futura-helvetica",
      prompt: "Which description best distinguishes Futura from Helvetica?",
      answers: [
        "Futura is geometric and associated with Paul Renner; Helvetica is a neo-grotesque developed from Neue Haas Grotesk",
        "Futura is a Didone serif; Helvetica is a slab serif",
        "Both are sixteenth-century Garamond revivals",
        "Futura was designed by Max Miedinger; Helvetica was designed by Paul Renner",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Futura, designed by Paul Renner and released in 1927, is known for geometric construction. Neue Haas Grotesk was designed by Max Miedinger with Eduard Hoffmann and introduced in 1957; it was renamed Helvetica in 1960.",
    }),
    knowledgeQuestion({
      id: "knowledge-gutenberg",
      prompt: "Which statement about printing history is accurate?",
      answers: [
        "Printing traditions existed in East Asia before Gutenberg's European press",
        "Gutenberg invented every form of printing used around the world",
        "Printing began only after digital fonts were created",
        "Manuscripts stopped being produced as soon as print appeared",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Printing developed in multiple regions. Gutenberg is associated with European movable-type printing, not the invention of printing everywhere.",
    }),
    knowledgeQuestion({
      id: "knowledge-caslon",
      prompt: "Which type designer is associated with the eighteenth-century English Caslon types?",
      answers: [
        "William Caslon",
        "Paul Renner",
        "Max Miedinger",
        "Firmin Didot",
      ],
      correctAnswerIndex: 0,
      explanation:
        "William Caslon established a typefounding business in eighteenth-century England, and the Caslon types became influential. Modern digital Caslon revivals are later designs.",
    }),
    knowledgeQuestion({
      id: "knowledge-typeface-font",
      prompt: "Which statement best describes the distinction between a typeface and a font file?",
      answers: [
        "A typeface is a design; a font is a particular digital or physical implementation of that design",
        "A font is the visual design, while a typeface is always a file format",
        "Typeface and font mean exactly the same thing in every technical context",
        "A typeface is a printer, while a font is a page layout",
      ],
      correctAnswerIndex: 0,
      explanation:
        "In common technical usage, a typeface is the design family or visual system, while a font is a specific implementation, such as a file with particular glyphs and style data.",
    }),
    knowledgeQuestion({
      id: "knowledge-variable-font",
      prompt: "What does a variable font typically provide?",
      answers: [
        "One font file with one or more continuous design axes, such as weight",
        "A guarantee that every language and character is supported",
        "A separate image for every possible text string",
        "A font that changes its license automatically with the screen size",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Variable fonts encode a design space in a font file. Axes such as weight or optical size let applications interpolate between supported values.",
    }),
    knowledgeQuestion({
      id: "knowledge-weight-style",
      prompt: "Which statement about font weight and style is correct?",
      answers: [
        "Weight describes stroke heaviness; style can distinguish roman from italic",
        "Weight describes line spacing; style describes page width",
        "Weight and style are both names for the font's file extension",
        "Italic is always generated by mechanically slanting a roman face",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Weight generally describes relative stroke thickness, while style distinguishes forms such as roman and italic. Many italics are drawn as distinct designs rather than simple slants.",
    }),
    knowledgeQuestion({
      id: "knowledge-opentype",
      prompt: "What does OpenType primarily describe?",
      answers: [
        "A font format that can support advanced typographic features and large character sets",
        "A classification reserved for open-source fonts",
        "A printing press used in the fifteenth century",
        "A single typeface design with a fixed set of letterforms",
      ],
      correctAnswerIndex: 0,
      explanation:
        "OpenType is a font format developed by Microsoft and Adobe. It can include features such as contextual substitutions, ligatures, and broad character coverage.",
    }),
  ],
} satisfies QuizData;
