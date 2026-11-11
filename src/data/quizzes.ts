import type { PublicFontId } from "./fontCatalog";
import { QUIZ_IDS } from "./quizIds";

export type AnswerIndex = 0 | 1 | 2 | 3;

export type QuizSpecimen = {
  fontId: PublicFontId;
  fontFamily: string;
  fontWeight: 400 | 500 | 600 | 700;
  fontStyle: "normal" | "italic";
  sampleText: string;
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
      prompt: string;
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

export const artHistoryQuiz = {
  id: QUIZ_IDS.artHistory,
  title: "Art History",
  description: "Five questions about notable works of Western art.",
  questions: [
    {
      id: "mona-lisa",
      answers: [
        "Leonardo da Vinci",
        "Michelangelo",
        "Raphael",
        "Sandro Botticelli",
      ],
      correctAnswerIndex: 0,
      content: {
        kind: "text",
        prompt: "Who painted the Mona Lisa?",
        explanation:
          "Leonardo da Vinci painted the Mona Lisa, generally dated to the early 16th century.",
      },
    },
    {
      id: "sistine-chapel-ceiling",
      content: {
        kind: "text",
        prompt: "Who painted the ceiling of the Sistine Chapel in the Vatican?",
        explanation:
          "Michelangelo painted the Sistine Chapel ceiling for Pope Julius II; the work was completed in 1512.",
      },
      answers: [
        "Raphael",
        "Michelangelo",
        "Donatello",
        "Leonardo da Vinci",
      ],
      correctAnswerIndex: 1,
    },
    {
      id: "guernica",
      content: {
        kind: "text",
        prompt: "Who painted Guernica in 1937?",
        explanation:
          "Pablo Picasso painted Guernica in 1937. The work responds to the bombing of the Basque town of Guernica during the Spanish Civil War.",
      },
      answers: [
        "Salvador Dalí",
        "Joan Miró",
        "Pablo Picasso",
        "Diego Velázquez",
      ],
      correctAnswerIndex: 2,
    },
    {
      id: "impression-sunrise",
      content: {
        kind: "text",
        prompt: "Who painted Impression, soleil levant (Impression, Sunrise)?",
        explanation:
          "Claude Monet painted Impression, soleil levant. The painting's title was later associated with the name of the Impressionist movement.",
      },
      answers: [
        "Édouard Manet",
        "Pierre-Auguste Renoir",
        "Edgar Degas",
        "Claude Monet",
      ],
      correctAnswerIndex: 3,
    },
    {
      id: "david-sculpture",
      content: {
        kind: "text",
        prompt: "Who sculpted the marble statue of David completed in 1504?",
        explanation:
          "Michelangelo carved the marble David between 1501 and 1504. The statue is now displayed at the Galleria dell'Accademia in Florence.",
      },
      answers: [
        "Donatello",
        "Michelangelo",
        "Gian Lorenzo Bernini",
        "Auguste Rodin",
      ],
      correctAnswerIndex: 1,
    },
  ],
} satisfies QuizData;
