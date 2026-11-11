import { fontCatalog, type PublicFontId } from "./fontCatalog";
import type { QuizQuestion } from "./quizzes";

export const TRAINING_POOL_SIZE = 4;
export const TRAINING_STREAK_TARGET = 10;

const initialFontWeight = 1;
const incorrectWeightIncrease = 2;

export type TrainingCompletionReason =
  | "full-pool-mastery"
  | "ten-answer-streak";

export type TrainingQuestion = Omit<
  QuizQuestion,
  "answers" | "correctAnswerIndex"
> & {
  answers: readonly string[];
  correctAnswerIndex: number;
};

export type TrainingRun = {
  poolFontIds: readonly PublicFontId[];
  masteredFontIds: readonly PublicFontId[];
  awaitingFontIds: readonly PublicFontId[];
  weights: Readonly<Partial<Record<PublicFontId, number>>>;
  lastFontId: PublicFontId | null;
  currentFontId: PublicFontId;
  question: TrainingQuestion;
  totalCorrect: number;
  totalIncorrect: number;
  consecutiveCorrect: number;
};

export type TrainingAnswerResult = {
  run: TrainingRun;
  completionReason: TrainingCompletionReason | null;
};

function randomIndex(length: number, random: () => number): number {
  return Math.min(Math.floor(random() * length), length - 1);
}

function shuffled<T>(values: readonly T[], random: () => number): T[] {
  const result = [...values];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const otherIndex = randomIndex(index + 1, random);
    [result[index], result[otherIndex]] = [result[otherIndex], result[index]];
  }

  return result;
}

function chooseWeightedFont(
  poolFontIds: readonly PublicFontId[],
  weights: Readonly<Partial<Record<PublicFontId, number>>>,
  lastFontId: PublicFontId | null,
  random: () => number,
): PublicFontId {
  const candidates =
    poolFontIds.length > 1 && lastFontId
      ? poolFontIds.filter((fontId) => fontId !== lastFontId)
      : [...poolFontIds];
  const totalWeight = candidates.reduce(
    (total, fontId) => total + (weights[fontId] ?? initialFontWeight),
    0,
  );
  let choice = random() * totalWeight;

  for (const fontId of candidates) {
    choice -= weights[fontId] ?? initialFontWeight;
    if (choice < 0) {
      return fontId;
    }
  }

  return candidates[candidates.length - 1];
}

function makeTrainingQuestion(
  fontId: PublicFontId,
  poolFontIds: readonly PublicFontId[],
  random: () => number,
): TrainingQuestion {
  if (!poolFontIds.includes(fontId)) {
    throw new Error(
      `Training question font "${fontId}" is not in the active pool.`,
    );
  }

  const font = fontCatalog.find(
    (entry) => entry.id === fontId && entry.licensingStatus === "cleared",
  );
  if (!font) {
    throw new Error(`Training font "${fontId}" is not a cleared catalog font.`);
  }

  const answerFonts = shuffled(
    [
      font,
      ...shuffled(
        poolFontIds
          .filter((poolFontId) => poolFontId !== fontId)
          .map((poolFontId) => {
            const answerFont = fontCatalog.find(
              (entry) =>
                entry.id === poolFontId && entry.licensingStatus === "cleared",
            );
            if (!answerFont) {
              throw new Error(
                `Training pool font "${poolFontId}" is not a cleared catalog font.`,
              );
            }
            return answerFont;
          }),
        random,
      ).slice(0, 3),
    ],
    random,
  );
  const answers = answerFonts.map((answerFont) => answerFont.name);

  if (new Set(answers).size !== answers.length) {
    throw new Error(
      `Training pool for font "${fontId}" contains duplicate answer names.`,
    );
  }

  const correctAnswerIndex = answers.findIndex(
    (answer) => answer === font.name,
  );
  if (correctAnswerIndex < 0) {
    throw new Error(
      `Training question for font "${fontId}" has no correct answer.`,
    );
  }

  return {
    id: fontId,
    answers,
    correctAnswerIndex,
    content: {
      kind: "font-specimen",
      specimen: {
        fontId: font.id,
        fontFamily: font.family,
        fontWeight: font.weight,
        fontStyle: font.style,
        fontAvailable: true,
        accessibleDescription: "Font specimen",
      },
    },
  };
}

export function createTrainingRun(
  availableFontIds: readonly PublicFontId[],
  random: () => number = Math.random,
): TrainingRun {
  if (availableFontIds.length === 0) {
    throw new Error("Training requires at least one available font.");
  }
  if (new Set(availableFontIds).size !== availableFontIds.length) {
    throw new Error("Training font IDs must be unique.");
  }

  const poolFontIds = shuffled(availableFontIds, random).slice(
    0,
    TRAINING_POOL_SIZE,
  );
  const weights: Partial<Record<PublicFontId, number>> = {};
  for (const fontId of availableFontIds) {
    weights[fontId] = initialFontWeight;
  }
  const currentFontId = chooseWeightedFont(poolFontIds, weights, null, random);

  return {
    poolFontIds,
    masteredFontIds: [],
    awaitingFontIds: poolFontIds,
    weights,
    lastFontId: null,
    currentFontId,
    question: makeTrainingQuestion(currentFontId, poolFontIds, random),
    totalCorrect: 0,
    totalIncorrect: 0,
    consecutiveCorrect: 0,
  };
}

export function recordTrainingAnswer(
  run: TrainingRun,
  availableFontIds: readonly PublicFontId[],
  isCorrect: boolean,
  random: () => number = Math.random,
): TrainingAnswerResult {
  const weights = { ...run.weights };
  let poolFontIds = [...run.poolFontIds];
  let masteredFontIds = [...run.masteredFontIds];
  let awaitingFontIds = [...run.awaitingFontIds];
  let totalCorrect = run.totalCorrect;
  let totalIncorrect = run.totalIncorrect;
  let consecutiveCorrect = run.consecutiveCorrect;

  if (isCorrect) {
    totalCorrect += 1;
    consecutiveCorrect += 1;
    weights[run.currentFontId] = Math.max(
      initialFontWeight,
      (weights[run.currentFontId] ?? initialFontWeight) - 1,
    );
    if (!masteredFontIds.includes(run.currentFontId)) {
      masteredFontIds = [...masteredFontIds, run.currentFontId];
    }
    awaitingFontIds = awaitingFontIds.filter(
      (fontId) => fontId !== run.currentFontId,
    );

    const unusedFontIds = availableFontIds.filter(
      (fontId) => !poolFontIds.includes(fontId),
    );
    if (unusedFontIds.length > 0) {
      poolFontIds = [
        ...poolFontIds,
        unusedFontIds[randomIndex(unusedFontIds.length, random)],
      ];
      awaitingFontIds = [
        ...awaitingFontIds,
        poolFontIds[poolFontIds.length - 1],
      ];
    }
  } else {
    totalIncorrect += 1;
    consecutiveCorrect = 0;
    weights[run.currentFontId] =
      (weights[run.currentFontId] ?? initialFontWeight) +
      incorrectWeightIncrease;
  }

  const updatedRun: TrainingRun = {
    ...run,
    poolFontIds,
    masteredFontIds,
    awaitingFontIds,
    weights,
    lastFontId: run.currentFontId,
    totalCorrect,
    totalIncorrect,
    consecutiveCorrect,
  };
  const fullPoolMastery =
    poolFontIds.length === availableFontIds.length &&
    masteredFontIds.length === availableFontIds.length;

  return {
    run: updatedRun,
    completionReason: fullPoolMastery
      ? "full-pool-mastery"
      : consecutiveCorrect >= TRAINING_STREAK_TARGET
        ? "ten-answer-streak"
        : null,
  };
}

export function advanceTrainingRun(
  run: TrainingRun,
  random: () => number = Math.random,
): TrainingRun {
  const currentFontId = chooseWeightedFont(
    run.poolFontIds,
    run.weights,
    run.lastFontId,
    random,
  );

  return {
    ...run,
    currentFontId,
    question: makeTrainingQuestion(currentFontId, run.poolFontIds, random),
  };
}
