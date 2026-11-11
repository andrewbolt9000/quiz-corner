export const QUIZ_IDS = {
  fontIdentification: "font-identification",
  fontKnowledge: "font-knowledge",
  historicallyImportant: "historically-important-quiz",
  blackletterGothic: "blackletter-gothic-quiz",
  serifBook: "serif-book-typography-quiz",
  sansGeometric: "sans-geometric-quiz",
  displayDecorative: "display-decorative-quiz",
  handwritingScript: "handwriting-script-quiz",
  experimentalNovelty: "experimental-novelty-quiz",
  symbolsWritingSystems: "symbols-writing-systems-quiz",
  classicTypefaces: "classic-typefaces-quiz",
  historicalTypography: "historical-typography-quiz",
} as const;

export type QuizId = (typeof QUIZ_IDS)[keyof typeof QUIZ_IDS];
