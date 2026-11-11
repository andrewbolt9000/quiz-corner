import { fontCatalog } from "./fontCatalog";
import type { PublicFontId } from "./fontCatalog";
import { QUIZ_IDS } from "./quizIds";
import type { QuizData, QuizQuestion } from "./quizzes";

type CrimsonQuestionDefinition = {
  id: string;
  fontId: PublicFontId;
  answerFontIds: readonly [
    PublicFontId,
    PublicFontId,
    PublicFontId,
    PublicFontId,
  ];
  correctAnswerIndex: 0 | 1 | 2 | 3;
};

const questionDefinitions = [
  {
    id: "crimson-roman-face",
    fontId: "crimson-roman",
    answerFontIds: [
      "crimson-roman",
      "crimson-semibold",
      "crimson-bold",
      "crimson-italic",
    ],
    correctAnswerIndex: 0,
  },
  {
    id: "crimson-semibold-face",
    fontId: "crimson-semibold",
    answerFontIds: [
      "crimson-roman",
      "crimson-bold",
      "crimson-semibold",
      "crimson-semibold-italic",
    ],
    correctAnswerIndex: 2,
  },
  {
    id: "crimson-bold-face",
    fontId: "crimson-bold",
    answerFontIds: [
      "crimson-bold",
      "crimson-semibold",
      "crimson-italic",
      "crimson-bold-italic",
    ],
    correctAnswerIndex: 0,
  },
  {
    id: "crimson-italic-face",
    fontId: "crimson-italic",
    answerFontIds: [
      "crimson-roman",
      "crimson-semibold",
      "crimson-italic",
      "crimson-semibold-italic",
    ],
    correctAnswerIndex: 2,
  },
  {
    id: "crimson-semibold-italic-face",
    fontId: "crimson-semibold-italic",
    answerFontIds: [
      "crimson-roman",
      "crimson-semibold",
      "crimson-bold-italic",
      "crimson-semibold-italic",
    ],
    correctAnswerIndex: 3,
  },
  {
    id: "crimson-bold-italic-face",
    fontId: "crimson-bold-italic",
    answerFontIds: [
      "crimson-roman",
      "crimson-italic",
      "crimson-bold",
      "crimson-bold-italic",
    ],
    correctAnswerIndex: 3,
  },
] as const satisfies readonly CrimsonQuestionDefinition[];

function getPublicCrimsonFont(fontId: PublicFontId) {
  const font = fontCatalog.find((entry) => entry.id === fontId);

  if (
    !font ||
    font.family !== "Crimson" ||
    font.licensingStatus !== "cleared" ||
    !font.collections.includes("serif-book")
  ) {
    throw new Error(
      `Crimson quiz font "${fontId}" must be a cleared Serif & Book Typography catalog entry.`,
    );
  }

  return font;
}

function makeCrimsonFacesQuiz(): QuizData {
  const usedQuestionIds = new Set<string>();
  const usedCorrectFontIds = new Set<PublicFontId>();

  const questions = questionDefinitions.map((definition) => {
    if (usedQuestionIds.has(definition.id)) {
      throw new Error(`Duplicate Crimson quiz question ID "${definition.id}".`);
    }
    usedQuestionIds.add(definition.id);

    if (usedCorrectFontIds.has(definition.fontId)) {
      throw new Error(
        `Crimson quiz font "${definition.fontId}" is used as the correct answer more than once.`,
      );
    }
    usedCorrectFontIds.add(definition.fontId);

    if (new Set(definition.answerFontIds).size !== 4) {
      throw new Error(
        `Crimson quiz question "${definition.id}" must have four distinct font choices.`,
      );
    }
    if (
      definition.answerFontIds[definition.correctAnswerIndex] !==
      definition.fontId
    ) {
      throw new Error(
        `Crimson quiz question "${definition.id}" has an invalid correct answer index.`,
      );
    }

    const font = getPublicCrimsonFont(definition.fontId);
    const answers = [
      getPublicCrimsonFont(definition.answerFontIds[0]).name,
      getPublicCrimsonFont(definition.answerFontIds[1]).name,
      getPublicCrimsonFont(definition.answerFontIds[2]).name,
      getPublicCrimsonFont(definition.answerFontIds[3]).name,
    ] as const;

    return {
      id: definition.id,
      answers,
      correctAnswerIndex: definition.correctAnswerIndex,
      content: {
        kind: "font-specimen",
        prompt: "Which Crimson face is shown?",
        specimen: {
          fontId: font.id,
          fontFamily: font.family,
          fontWeight: font.weight,
          fontStyle: font.style,
          sampleText: "The quick brown fox jumps over 123 lazy dogs.",
          fontAvailable: true,
        },
      },
    } satisfies QuizQuestion;
  });

  if (usedCorrectFontIds.size !== 6) {
    throw new Error("Crimson Faces requires all six catalog faces exactly once.");
  }

  return {
    id: QUIZ_IDS.crimsonFacesWeightStyle,
    title: "Crimson Faces: Weight and Style",
    description:
      "Compare six Crimson specimens and identify each face by its weight and style.",
    questions,
  };
}

export const crimsonFacesQuiz = makeCrimsonFacesQuiz();
