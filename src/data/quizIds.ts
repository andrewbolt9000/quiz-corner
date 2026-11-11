export const QUIZ_IDS = {
  artHistory: "art-history",
  fontIdentification: "font-identification",
  crimsonFacesWeightStyle: "crimson-faces-weight-style",
} as const;

export type QuizId = (typeof QUIZ_IDS)[keyof typeof QUIZ_IDS];
