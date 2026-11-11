import { existsSync } from "node:fs";
import { resolve, sep } from "node:path";

import {
  fontCatalog,
  fontCollections,
  type FontCollectionId,
  type FontRecord,
} from "./fontCatalog";
import { crimsonFacesQuiz } from "./crimsonFacesQuiz";
import { fontIdentificationQuiz } from "./fontIdentificationQuiz";
import { artHistoryQuiz, type QuizData } from "./quizzes";
import { QUIZ_IDS, type QuizId } from "./quizIds";

export type QuizFormat =
  | "font-specimen"
  | "font-identification"
  | "typeface-characteristics"
  | "historical-knowledge"
  | "typeface-comparison"
  | "mixed";

export type QuizDifficulty = "beginner" | "intermediate" | "advanced";

export type QuizMetadata = {
  id: QuizId;
  title: string;
  route: string;
  collectionIds: readonly FontCollectionId[];
  format: QuizFormat;
  difficulty: QuizDifficulty;
  questionCount: number;
};

type QuizDefinition = {
  id: QuizId;
  quiz: QuizData;
  route: string;
  format: QuizFormat;
  difficulty: QuizDifficulty;
};

const quizDefinitions = [
  {
    id: QUIZ_IDS.artHistory,
    quiz: artHistoryQuiz,
    route: "/",
    format: "historical-knowledge",
    difficulty: "beginner",
  },
  {
    id: QUIZ_IDS.fontIdentification,
    quiz: fontIdentificationQuiz,
    route: "/font-identification/",
    format: "font-identification",
    difficulty: "beginner",
  },
  {
    id: QUIZ_IDS.crimsonFacesWeightStyle,
    quiz: crimsonFacesQuiz,
    route: "/crimson-faces/",
    format: "font-specimen",
    difficulty: "beginner",
  },
] as const satisfies readonly QuizDefinition[];

const validFormats = new Set<QuizFormat>([
  "font-specimen",
  "font-identification",
  "typeface-characteristics",
  "historical-knowledge",
  "typeface-comparison",
  "mixed",
]);
const validDifficulties = new Set<QuizDifficulty>([
  "beginner",
  "intermediate",
  "advanced",
]);
const publicFontsById = new Map<string, FontRecord>(
  fontCatalog.map((font) => [font.id, font]),
);
const knownCollectionIds = new Set<string>(
  fontCollections.map((collection) => collection.id),
);

function assertPublicFont(fontId: string): FontRecord {
  const font = publicFontsById.get(fontId);

  if (!font) {
    throw new Error(
      `Quiz font reference "${fontId}" is not in the public font catalog; local archive records are not allowed.`,
    );
  }

  const clearedFontDirectory = resolve(process.cwd(), "public/fonts/cleared");
  const resolvedFontPath = resolve(process.cwd(), font.fileLocation);

  if (
    font.licensingStatus !== "cleared" ||
    !resolvedFontPath.startsWith(`${clearedFontDirectory}${sep}`) ||
    !existsSync(resolvedFontPath)
  ) {
    throw new Error(
      `Quiz font reference "${fontId}" is not an available, cleared public font asset.`,
    );
  }

  return font;
}

function getCollectionIdsForQuiz(quiz: QuizData): FontCollectionId[] {
  const collectionIds = new Set<FontCollectionId>();

  for (const question of quiz.questions) {
    if (question.content.kind !== "font-specimen") {
      continue;
    }

    const font = assertPublicFont(question.content.specimen.fontId);

    if (
      question.answers[question.correctAnswerIndex] !== font.name
    ) {
      throw new Error(
        `Quiz font reference "${question.content.specimen.fontId}" does not match its correct answer.`,
      );
    }

    for (const collectionId of font.collections) {
      collectionIds.add(collectionId);
    }
  }

  return [...collectionIds];
}

export const quizRegistry: readonly QuizMetadata[] = quizDefinitions.map(
  ({ id, quiz, route, format, difficulty }) => ({
    id,
    title: quiz.title,
    route,
    collectionIds: getCollectionIdsForQuiz(quiz),
    format,
    difficulty,
    questionCount: quiz.questions.length,
  }),
);

export function validateQuizRegistries(): void {
  const collectionIds = fontCollections.map((collection) => collection.id);
  const quizIds = quizRegistry.map((quiz) => quiz.id);

  if (new Set(collectionIds).size !== collectionIds.length) {
    throw new Error("Font collection IDs must be unique.");
  }
  if (new Set(quizIds).size !== quizIds.length) {
    throw new Error("Quiz IDs must be unique.");
  }

  for (const font of fontCatalog) {
    for (const collectionId of font.collections) {
      if (!knownCollectionIds.has(collectionId)) {
        throw new Error(
          `Font "${font.id}" references unknown collection "${collectionId}".`,
        );
      }
    }
  }

  for (const [index, definition] of quizDefinitions.entries()) {
    const metadata = quizRegistry[index];

    if (definition.id !== definition.quiz.id) {
      throw new Error(
        `Quiz registry ID "${definition.id}" does not match its quiz data ID "${definition.quiz.id}".`,
      );
    }
    if (!metadata || !validFormats.has(metadata.format)) {
      throw new Error(`Quiz "${definition.id}" has an invalid format.`);
    }
    if (!validDifficulties.has(metadata.difficulty)) {
      throw new Error(`Quiz "${definition.id}" has an invalid difficulty.`);
    }
    for (const collectionId of metadata.collectionIds) {
      if (!knownCollectionIds.has(collectionId)) {
        throw new Error(
          `Quiz "${definition.id}" references unknown collection "${collectionId}".`,
        );
      }
    }
  }
}

validateQuizRegistries();

export function getQuizMetadata(quizId: string): QuizMetadata {
  const metadata = quizRegistry.find((quiz) => quiz.id === quizId);

  if (!metadata) {
    throw new Error(`Unknown quiz ID "${quizId}".`);
  }

  return metadata;
}

export function getQuizById(quizId: string): QuizData {
  const definition = quizDefinitions.find((entry) => entry.id === quizId);

  if (!definition) {
    throw new Error(`Unknown quiz ID "${quizId}".`);
  }

  return definition.quiz;
}

export function getQuizzesForCollection(
  collectionId: string,
): readonly QuizMetadata[] {
  if (!knownCollectionIds.has(collectionId)) {
    throw new Error(`Unknown collection ID "${collectionId}".`);
  }

  return quizRegistry.filter((quiz) =>
    quiz.collectionIds.some((registeredId) => registeredId === collectionId),
  );
}
