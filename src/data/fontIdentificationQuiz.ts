import { fontCatalog } from "./fontCatalog";
import { QUIZ_IDS } from "./quizIds";
import type { QuizData, QuizQuestion } from "./quizzes";

function makeFontIdentificationQuiz(): QuizData {
  const eligibleFonts = fontCatalog.filter(
    (font) => font.licensingStatus === "cleared",
  );

  if (eligibleFonts.length < 4) {
    throw new Error(
      "Font Identification requires at least four fonts in the font catalog.",
    );
  }

  const questions = eligibleFonts.map((target) => {
    const distractors = eligibleFonts.filter((font) => font.id !== target.id);
    const selectedDistractors = [0, 1, 2].map(
      (slot) => distractors[Math.floor((slot * distractors.length) / 3)],
    );
    const choices = [target, ...selectedDistractors];
    const choiceNames = choices.map((font) => font.name);

    if (new Set(choiceNames).size !== 4) {
      throw new Error(
        `Font "${target.id}" does not have three distinct distractors.`,
      );
    }

    const correctAnswerIndex = ([0, 1, 2, 3] as const).find(
      (answerIndex) => choices[answerIndex].id === target.id,
    );

    if (correctAnswerIndex === undefined) {
      throw new Error(
        `Unable to determine the correct answer for font "${target.id}".`,
      );
    }

    return {
      id: target.id,
      answers: [
        choices[0].name,
        choices[1].name,
        choices[2].name,
        choices[3].name,
      ] as const,
      correctAnswerIndex,
      content: {
        kind: "font-specimen",
        specimen: {
          fontId: target.id,
          fontFamily: target.family,
          fontWeight: target.weight,
          fontStyle: target.style,
          fontAvailable: target.licensingStatus === "cleared",
        },
      },
    } satisfies QuizQuestion;
  });

  return {
    id: QUIZ_IDS.fontIdentification,
    title: "Font Identification",
    description:
      "Study each type specimen and identify its typeface. Every font in the library appears once.",
    questions,
  };
}

export const fontIdentificationQuiz = makeFontIdentificationQuiz();
