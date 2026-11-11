import { fontCatalog } from "./fontCatalog";
import type { FontRecord } from "./fontCatalog";
import { QUIZ_IDS } from "./quizIds";
import type { QuizData, QuizQuestion } from "./quizzes";

const samplePassages = [
  "Across the quiet valley, lanterns marked a path home at dusk. (2026)",
  "THE QUICK BROWN FOX jumps over 13 lazy dogs; then rests.",
  "At 7:45 p.m., Mina wrote: “Meet near the old stone bridge!”",
  "Blueprints changed overnight—Unit 4B was ready by 10:30.",
] as const;

const hieroglyphSample =
  "𓀀 𓀁 𓀂 𓀃 𓀄 𓀅 — 2026! A quiet sample, set on 12/10.";

function getSample(font: FontRecord, index: number): string {
  return font.id === "noto-egyptian-hieroglyphs"
    ? hieroglyphSample
    : samplePassages[index % samplePassages.length];
}

function makeFontIdentificationQuiz(): QuizData {
  const eligibleFonts = fontCatalog.filter(
    (font) => font.licensingStatus === "cleared",
  );

  if (eligibleFonts.length < 4) {
    throw new Error(
      "Font Identification requires at least four fonts in the font catalog.",
    );
  }

  const questions = eligibleFonts.map((target, index) => {
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
        prompt: "Which typeface is this?",
        specimen: {
          fontId: target.id,
          fontFamily: target.family,
          fontWeight: target.weight,
          fontStyle: target.style,
          sampleText: getSample(target, index),
          fontAvailable: target.licensingStatus === "cleared",
          accessibleDescription:
            target.id === "noto-egyptian-hieroglyphs"
              ? "Six Egyptian hieroglyph characters, followed by punctuation, numerals, and a short Latin passage."
              : undefined,
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
