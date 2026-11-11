import type { PublicFontId } from "./fontCatalog";

export type AnswerIndex = 0 | 1 | 2 | 3;

export type QuizSpecimen = {
  fontId: PublicFontId;
  fontFamily: string;
  fontWeight: 400 | 500 | 600 | 700;
  fontStyle: "normal" | "italic";
  fontAvailable?: boolean;
  accessibleDescription?: string;
};

export type QuizQuestionContent =
  | {
      kind: "text";
      prompt: string;
      explanation?: string;
    }
  | {
      kind: "font-specimen";
      explanation?: string;
      specimen: QuizSpecimen;
    };

export type QuizQuestion = {
  id: string;
  answers: readonly [string, string, string, string];
  correctAnswerIndex: AnswerIndex;
  content: QuizQuestionContent;
};

type QuizDetails = {
  id: string;
  title: string;
  description: string;
};

export type QuizData = QuizDetails & {
  questions: readonly QuizQuestion[];
};

export type Quiz = QuizData;
