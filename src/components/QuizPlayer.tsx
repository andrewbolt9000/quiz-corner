"use client";

import { useEffect, useRef, useState } from "react";

import QuestionContent, { type SpecimenTextMode } from "./QuestionContent";
import {
  fontCatalog,
  type PublicFontId,
} from "../data/fontCatalog";
import {
  advanceTrainingRun,
  createTrainingRun,
  recordTrainingAnswer,
  TRAINING_STREAK_TARGET,
  type TrainingCompletionReason,
  type TrainingRun,
} from "../data/fontTraining";
import type { AnswerIndex, Quiz } from "../data/quizzes";

const answerIndexes: readonly AnswerIndex[] = [0, 1, 2, 3];
const answerLetters = ["A", "B", "C", "D"] as const;
const ANSWER_FEEDBACK_DURATION_MS = 3000;
type QuizMode = "traditional" | "training";

type AnswerFeedback = {
  isCorrect: boolean;
  correctAnswer: string;
  correctFont: {
    family: string;
    weight: number;
    style: string;
  } | null;
};

type QuizPlayerProps = {
  quiz: Quiz;
  shuffleOnStart?: boolean;
  startButtonLabel?: string;
  specimenTextSelector?: boolean;
  trainingFontIds?: readonly PublicFontId[];
};

function getShuffledQuiz(quiz: Quiz): Quiz {
  const shuffledQuestions = [...quiz.questions];

  for (let index = shuffledQuestions.length - 1; index > 0; index -= 1) {
    const otherIndex = Math.floor(Math.random() * (index + 1));
    [shuffledQuestions[index], shuffledQuestions[otherIndex]] = [
      shuffledQuestions[otherIndex],
      shuffledQuestions[index],
    ];
  }

  return {
    ...quiz,
    questions: shuffledQuestions.map((currentQuestion) => {
      const choices = answerIndexes.map((answerIndex) => ({
        text: currentQuestion.answers[answerIndex],
        isCorrect: answerIndex === currentQuestion.correctAnswerIndex,
      }));

      for (let index = choices.length - 1; index > 0; index -= 1) {
        const otherIndex = Math.floor(Math.random() * (index + 1));
        [choices[index], choices[otherIndex]] = [
          choices[otherIndex],
          choices[index],
        ];
      }

      const correctAnswerIndex = answerIndexes.find(
        (answerIndex) => choices[answerIndex].isCorrect,
      );
      if (correctAnswerIndex === undefined) {
        throw new Error(
          `Question "${currentQuestion.id}" has no correct answer.`,
        );
      }

      return {
        ...currentQuestion,
        answers: [
          choices[0].text,
          choices[1].text,
          choices[2].text,
          choices[3].text,
        ],
        correctAnswerIndex,
      };
    }),
  };
}

export default function QuizPlayer({
  quiz,
  shuffleOnStart = false,
  startButtonLabel = "Start quiz",
  specimenTextSelector = false,
  trainingFontIds,
}: QuizPlayerProps) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<AnswerIndex | null>(
    null,
  );
  const [score, setScore] = useState(0);
  const [mode, setMode] = useState<QuizMode | null>(
    shuffleOnStart && specimenTextSelector ? null : "traditional",
  );
  const [trainingRun, setTrainingRun] = useState<TrainingRun | null>(null);
  const [trainingCompletion, setTrainingCompletion] =
    useState<TrainingCompletionReason | null>(null);
  const [answerFeedback, setAnswerFeedback] =
    useState<AnswerFeedback | null>(null);
  const [specimenTextMode, setSpecimenTextMode] =
    useState<SpecimenTextMode>("alphabet");
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(
    shuffleOnStart ? null : quiz,
  );
  const isFontIdentification = specimenTextSelector;
  const shouldMoveFocus = useRef(false);
  const answeredQuestionRef = useRef<string | null>(null);
  const questionLegendRef = useRef<HTMLLegendElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null);

  const currentQuiz = activeQuiz ?? quiz;
  const totalQuestions = currentQuiz.questions.length;
  const availableTrainingFontIds = trainingFontIds
    ? [...new Set(trainingFontIds)]
    : [
        ...new Set(
          quiz.questions.flatMap((quizQuestion) =>
            quizQuestion.content.kind === "font-specimen"
              ? [quizQuestion.content.specimen.fontId]
              : [],
          ),
        ),
      ];
  const question =
    mode === "training"
      ? trainingRun?.question
      : currentQuiz.questions[questionIndex];
  const isTraditionalComplete =
    mode === "traditional" && questionIndex >= totalQuestions;
  const isTrainingComplete =
    mode === "training" && trainingCompletion !== null;
  const isComplete = isTraditionalComplete || isTrainingComplete;
  const isTrainingMode = mode === "training";
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const feedbackVersionRef = useRef(0);

  useEffect(
    () => () => {
      if (feedbackTimerRef.current !== null) {
        clearTimeout(feedbackTimerRef.current);
      }
      feedbackVersionRef.current += 1;
    },
    [],
  );

  useEffect(() => {
    if (
      !shouldMoveFocus.current ||
      (activeQuiz === null && mode !== "training")
    ) {
      return;
    }

    shouldMoveFocus.current = false;

    if (isComplete) {
      resultsHeadingRef.current?.focus();
    } else if (selectedAnswer !== null) {
      feedbackRef.current?.focus();
    } else {
      questionLegendRef.current?.focus();
    }
  }, [activeQuiz, isComplete, mode, questionIndex, selectedAnswer]);

  function clearAnswerFeedback() {
    if (feedbackTimerRef.current !== null) {
      clearTimeout(feedbackTimerRef.current);
      feedbackTimerRef.current = null;
    }
    feedbackVersionRef.current += 1;
    setAnswerFeedback(null);
  }

  function showAnswerFeedback(
    answeredQuestion: NonNullable<typeof question>,
    answerIndex: AnswerIndex,
  ) {
    if (feedbackTimerRef.current !== null) {
      clearTimeout(feedbackTimerRef.current);
    }

    const correctAnswer =
      answeredQuestion.answers[answeredQuestion.correctAnswerIndex];
    const correctFont = fontCatalog.find(
      (font) => font.name === correctAnswer,
    );
    const version = ++feedbackVersionRef.current;
    setAnswerFeedback({
      isCorrect: answerIndex === answeredQuestion.correctAnswerIndex,
      correctAnswer,
      correctFont: correctFont
        ? {
            family: correctFont.family,
            weight: correctFont.weight,
            style: correctFont.style,
          }
        : null,
    });
    feedbackTimerRef.current = setTimeout(() => {
      if (feedbackVersionRef.current === version) {
        feedbackTimerRef.current = null;
        setAnswerFeedback(null);
      }
    }, ANSWER_FEEDBACK_DURATION_MS);
  }

  function startQuiz() {
    clearAnswerFeedback();
    answeredQuestionRef.current = null;
    shouldMoveFocus.current = true;
    setMode("traditional");
    setActiveQuiz(shuffleOnStart ? getShuffledQuiz(quiz) : quiz);
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setTrainingRun(null);
    setTrainingCompletion(null);
  }

  function startTraining() {
    clearAnswerFeedback();
    answeredQuestionRef.current = null;
    shouldMoveFocus.current = true;
    setMode("training");
    setActiveQuiz(null);
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setTrainingRun(createTrainingRun(availableTrainingFontIds));
    setTrainingCompletion(null);
  }

  function handleAnswer(answerIndex: AnswerIndex) {
    if (
      selectedAnswer !== null ||
      !question ||
      answeredQuestionRef.current === question.id
    ) {
      return;
    }

    answeredQuestionRef.current = question.id;
    shouldMoveFocus.current = true;
    setSelectedAnswer(answerIndex);

    if (isFontIdentification) {
      showAnswerFeedback(question, answerIndex);
    }

    if (mode === "training") {
      if (!trainingRun) {
        throw new Error("Cannot answer a training question without a run.");
      }

      const result = recordTrainingAnswer(
        trainingRun,
        availableTrainingFontIds,
        answerIndex === question.correctAnswerIndex,
      );
      if (result.completionReason) {
        setTrainingRun(result.run);
        setTrainingCompletion(result.completionReason);
      } else {
        setTrainingRun(advanceTrainingRun(result.run));
      }
    } else if (answerIndex === question.correctAnswerIndex) {
      setScore((currentScore) => currentScore + 1);
    }

    if (isFontIdentification) {
      setSelectedAnswer(null);
      if (mode === "traditional") {
        setQuestionIndex((currentIndex) => currentIndex + 1);
      }
    }
  }

  function handleNextQuestion() {
    answeredQuestionRef.current = null;
    shouldMoveFocus.current = true;
    setSelectedAnswer(null);
    setQuestionIndex((currentIndex) => currentIndex + 1);
  }

  function handleRestart() {
    if (mode === "training") {
      startTraining();
    } else {
      startQuiz();
    }
  }

  function renderAnswerFeedbackPanel() {
    if (!isFontIdentification) {
      return null;
    }

    return (
      <div
        ref={feedbackRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={`flex h-[4.25rem] items-center rounded-xl border px-4 text-sm font-semibold transition-colors motion-reduce:transition-none sm:text-base ${
          answerFeedback === null
            ? "border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200"
            : answerFeedback.isCorrect
              ? "border-green-700 bg-green-50 text-green-950 dark:border-green-800 dark:bg-green-950 dark:text-green-50"
              : "border-red-700 bg-red-50 text-red-950 dark:border-red-800 dark:bg-red-950 dark:text-red-50"
        }`}
      >
        {answerFeedback === null ? (
          "Identify the font"
        ) : answerFeedback.isCorrect ? (
          "Correct!"
        ) : (
          <span>
            Incorrect — the answer was{" "}
            <span
              className="text-base font-bold sm:text-lg"
              style={
                answerFeedback.correctFont
                  ? {
                      fontFamily: `"${answerFeedback.correctFont.family}", serif`,
                      fontWeight: answerFeedback.correctFont.weight,
                      fontStyle: answerFeedback.correctFont.style,
                    }
                  : undefined
              }
            >
              {answerFeedback.correctAnswer}
            </span>
          </span>
        )}
      </div>
    );
  }

  function renderAnswerChoices() {
    if (!question) {
      return null;
    }

    const visibleAnswerIndexes = answerIndexes.filter(
      (answerIndex) => answerIndex < question.answers.length,
    );

    return (
      <div className={isFontIdentification ? "space-y-2" : "space-y-3"}>
        {visibleAnswerIndexes.map((answerIndex) => {
          const answer = question.answers[answerIndex];
          const isSelected = selectedAnswer === answerIndex;
          const isCorrect = question.correctAnswerIndex === answerIndex;
          let answerStyle =
            "border-zinc-200 bg-white text-zinc-800 hover:border-indigo-400 hover:bg-indigo-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-indigo-500 dark:hover:bg-zinc-800";
          let answerStatus = "";

          if (selectedAnswer !== null && isCorrect) {
            answerStyle =
              "border-green-700 bg-green-50 text-green-950 ring-1 ring-green-700 dark:border-green-400 dark:bg-green-950 dark:text-green-50 dark:ring-green-400";
            answerStatus =
              selectedAnswer === answerIndex
                ? "Your answer · Correct"
                : "Correct answer";
          } else if (selectedAnswer !== null && isSelected) {
            answerStyle =
              "border-red-700 bg-red-50 text-red-950 ring-1 ring-red-700 dark:border-red-400 dark:bg-red-950 dark:text-red-50 dark:ring-red-400";
            answerStatus = "Your answer · Incorrect";
          } else if (selectedAnswer !== null) {
            answerStyle =
              "border-zinc-200 bg-zinc-50 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400";
          }

          return (
            <label
              key={`${question.id}-${answerIndex}`}
              className={`flex min-w-0 rounded-xl border transition-colors motion-reduce:transition-none ${
                isFontIdentification
                  ? "h-14 items-center gap-3 p-3 sm:gap-4 sm:px-4"
                  : "items-start gap-3 p-4 sm:gap-4"
              } ${selectedAnswer !== null ? "cursor-default" : "cursor-pointer"} ${answerStyle}`}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                value={answerIndex}
                checked={isSelected}
                disabled={selectedAnswer !== null}
                onChange={() => handleAnswer(answerIndex)}
                className={`h-4 w-4 shrink-0 accent-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 dark:accent-indigo-400 dark:focus-visible:outline-indigo-400 ${
                  isFontIdentification ? "" : "mt-1"
                }`}
              />
              {isFontIdentification ? (
                <span className="flex min-w-0 flex-1 items-center gap-2">
                  <span className="w-5 shrink-0 text-sm font-bold text-zinc-500 dark:text-zinc-400">
                    {answerLetters[answerIndex]}.
                  </span>
                  <span className="line-clamp-2 min-w-0 flex-1 break-words text-sm leading-5 sm:text-base">
                    {answer}
                  </span>
                </span>
              ) : (
                <span className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="flex min-w-0 items-start gap-2">
                    <span className="w-5 shrink-0 text-sm font-bold text-zinc-500 dark:text-zinc-400">
                      {answerLetters[answerIndex]}.
                    </span>
                    <span className="min-w-0 flex-1 break-words text-sm leading-6 sm:text-base">
                      {answer}
                    </span>
                  </span>
                  {answerStatus && (
                    <span className="pl-7 text-xs font-bold sm:text-sm">
                      {answerStatus}
                    </span>
                  )}
                </span>
              )}
            </label>
          );
        })}
      </div>
    );
  }

  return (
    <main className="relative flex flex-1 items-center justify-center overflow-x-hidden bg-black px-4 py-8 sm:px-6 sm:py-12">
      <section className="w-full max-w-2xl overflow-hidden rounded-3xl border border-white/80 bg-white shadow-xl shadow-indigo-950/5 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-black/20">
        <header
          className={`border-b border-zinc-100 dark:border-zinc-800 ${
            isFontIdentification
              ? "px-5 py-3 sm:px-7"
              : "px-5 py-6 sm:px-9 sm:py-8"
          }`}
        >
          {isFontIdentification ? (
            <h1 className="text-sm font-semibold tracking-wide text-zinc-600 dark:text-zinc-300">
              {quiz.title}
            </h1>
          ) : (
            <>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                <span
                  aria-hidden="true"
                  className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[calc(10px+2pt)] text-white"
                >
                  Q
                </span>
                Quiz Corner
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-4xl">
                {quiz.title}
              </h1>
              <p className="mt-2 max-w-prose text-sm leading-6 text-zinc-600 dark:text-zinc-300 sm:text-base">
                {quiz.description}
              </p>
            </>
          )}
        </header>

        {activeQuiz === null && mode === null ? (
          <div className="grid gap-3 px-5 py-6 sm:grid-cols-2 sm:px-7 sm:py-7">
            <section className="flex flex-col rounded-2xl border border-zinc-200 p-4 dark:border-zinc-700">
              <h2 className="text-base font-bold text-zinc-950 dark:text-white">
                Traditional Quiz
              </h2>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                One pass through the question set.
              </p>
              <button
                type="button"
                onClick={startQuiz}
                className="mt-4 min-h-12 w-full rounded-xl bg-indigo-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 motion-reduce:transition-none dark:bg-indigo-500 dark:text-zinc-950 dark:hover:bg-indigo-400"
              >
                {startButtonLabel}
              </button>
            </section>
            <section className="flex flex-col rounded-2xl border border-indigo-200 bg-indigo-50/60 p-4 dark:border-indigo-900 dark:bg-indigo-950/30">
              <h2 className="text-base font-bold text-zinc-950 dark:text-white">
                Training
              </h2>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                Grow your font pool with each correct answer.
              </p>
              <button
                type="button"
                onClick={startTraining}
                disabled={availableTrainingFontIds.length === 0}
                className="mt-4 min-h-12 w-full rounded-xl bg-indigo-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-indigo-500 dark:text-zinc-950 dark:hover:bg-indigo-400"
              >
                Start training
              </button>
            </section>
          </div>
        ) : mode === "traditional" && totalQuestions === 0 ? (
          <div className="px-5 py-8 sm:px-9 sm:py-10">
            <p className="text-zinc-700 dark:text-zinc-200">
              This quiz does not have any questions yet.
            </p>
          </div>
        ) : isTrainingComplete && trainingRun && trainingCompletion ? (
          <section
            className="px-5 py-6 sm:px-7 sm:py-7"
            aria-labelledby="quiz-results-title"
          >
            {isFontIdentification && (
              <div className="mb-4">{renderAnswerFeedbackPanel()}</div>
            )}
            <div className="rounded-2xl bg-indigo-50 p-5 dark:bg-indigo-950/60 sm:p-7">
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-indigo-700 dark:text-indigo-300">
                Training complete
              </p>
              <h2
                id="quiz-results-title"
                ref={resultsHeadingRef}
                tabIndex={-1}
                className="mt-2 text-2xl font-bold tracking-tight text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 dark:text-white dark:focus-visible:outline-indigo-400"
              >
                {trainingCompletion === "full-pool-mastery"
                  ? "Full-pool mastery"
                  : "Ten-answer streak"}
              </h2>
              <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:grid-cols-3">
                <div>
                  <dt className="text-zinc-600 dark:text-zinc-300">
                    Questions answered
                  </dt>
                  <dd className="font-bold tabular-nums text-zinc-950 dark:text-white">
                    {trainingRun.totalCorrect + trainingRun.totalIncorrect}
                  </dd>
                </div>
                <div>
                  <dt className="text-zinc-600 dark:text-zinc-300">Correct</dt>
                  <dd className="font-bold tabular-nums text-zinc-950 dark:text-white">
                    {trainingRun.totalCorrect}
                  </dd>
                </div>
                <div>
                  <dt className="text-zinc-600 dark:text-zinc-300">
                    Incorrect
                  </dt>
                  <dd className="font-bold tabular-nums text-zinc-950 dark:text-white">
                    {trainingRun.totalIncorrect}
                  </dd>
                </div>
                <div>
                  <dt className="text-zinc-600 dark:text-zinc-300">Accuracy</dt>
                  <dd className="font-bold tabular-nums text-zinc-950 dark:text-white">
                    {Math.round(
                      (trainingRun.totalCorrect /
                        (trainingRun.totalCorrect +
                          trainingRun.totalIncorrect)) *
                        100,
                    )}
                    %
                  </dd>
                </div>
                <div>
                  <dt className="text-zinc-600 dark:text-zinc-300">
                    Fonts mastered
                  </dt>
                  <dd className="font-bold tabular-nums text-zinc-950 dark:text-white">
                    {trainingRun.masteredFontIds.length} /{" "}
                    {availableTrainingFontIds.length}
                  </dd>
                </div>
                {trainingRun.masteredFontIds.length <
                  availableTrainingFontIds.length && (
                  <div className="col-span-2 sm:col-span-3">
                    <dt className="text-zinc-600 dark:text-zinc-300">
                      Fonts remaining
                    </dt>
                    <dd className="mt-1 leading-5 text-zinc-950 dark:text-white">
                      {availableTrainingFontIds
                        .filter(
                          (fontId) =>
                            !trainingRun.masteredFontIds.includes(fontId),
                        )
                        .map(
                          (fontId) =>
                            fontCatalog.find((font) => font.id === fontId)
                              ?.name ?? fontId,
                        )
                        .join(", ")}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
            <button
              type="button"
              onClick={handleRestart}
              className="mt-5 min-h-12 w-full rounded-xl bg-indigo-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 motion-reduce:transition-none dark:bg-indigo-500 dark:text-zinc-950 dark:hover:bg-indigo-400"
            >
              New training run
            </button>
          </section>
        ) : isTraditionalComplete ? (
          <section
            className="px-5 py-8 sm:px-9 sm:py-10"
            aria-labelledby="quiz-results-title"
          >
            {isFontIdentification && (
              <div className="mb-4">{renderAnswerFeedbackPanel()}</div>
            )}
            <div className="rounded-2xl bg-indigo-50 p-6 text-center dark:bg-indigo-950/60 sm:p-8">
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-indigo-700 dark:text-indigo-300">
                Quiz complete
              </p>
              <h2
                id="quiz-results-title"
                ref={resultsHeadingRef}
                tabIndex={-1}
                aria-describedby="quiz-results-score quiz-results-message"
                className="mt-3 text-3xl font-bold tracking-tight text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 dark:text-white dark:focus-visible:outline-indigo-400 sm:text-4xl"
              >
                Your results
              </h2>
              <p className="mt-4 text-zinc-700 dark:text-zinc-200">
                You answered
              </p>
              <p
                id="quiz-results-score"
                className="mt-1 text-4xl font-extrabold tabular-nums text-indigo-700 dark:text-indigo-300"
              >
                {score}
                <span className="text-2xl font-semibold text-zinc-500 dark:text-zinc-400">
                  {" "}
                  / {totalQuestions}
                </span>
              </p>
              <p
                id="quiz-results-message"
                className="mt-2 text-sm text-zinc-600 dark:text-zinc-300"
              >
                {score === totalQuestions
                  ? "Perfect score. Excellent work!"
                  : "Nice work completing the quiz."}
              </p>
            </div>
            <button
              type="button"
              onClick={handleRestart}
              className="mt-6 w-full rounded-xl bg-indigo-700 px-5 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-indigo-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 dark:bg-indigo-500 dark:text-zinc-950 dark:hover:bg-indigo-400"
            >
              Restart quiz
            </button>
          </section>
        ) : question ? (
          isFontIdentification ? (
            <div className="px-4 py-4 sm:px-7 sm:py-5">
              {renderAnswerFeedbackPanel()}

              <fieldset aria-label="Font specimen answers" className="min-w-0">
                <legend
                  ref={questionLegendRef}
                  tabIndex={-1}
                  className="sr-only focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 dark:focus-visible:outline-indigo-400"
                >
                  Font specimen
                </legend>
                <QuestionContent
                  content={question.content}
                  specimenTextMode={specimenTextMode}
                  onSpecimenTextModeChange={setSpecimenTextMode}
                />
                {renderAnswerChoices()}
              </fieldset>

              {isTrainingMode && trainingRun ? (
                <div
                  className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5"
                  aria-label="Training progress"
                >
                  <div className="rounded-lg bg-zinc-100 px-3 py-2 dark:bg-zinc-800">
                    <p className="text-[calc(11px+2pt)] font-semibold text-zinc-600 dark:text-zinc-300">
                      Fonts introduced
                    </p>
                    <p className="text-sm font-bold tabular-nums text-zinc-950 dark:text-white">
                      {trainingRun.poolFontIds.length} /{" "}
                      {availableTrainingFontIds.length}
                    </p>
                  </div>
                  <div className="rounded-lg bg-zinc-100 px-3 py-2 dark:bg-zinc-800">
                    <p className="text-[calc(11px+2pt)] font-semibold text-zinc-600 dark:text-zinc-300">
                      Fonts mastered
                    </p>
                    <p className="text-sm font-bold tabular-nums text-zinc-950 dark:text-white">
                      {trainingRun.masteredFontIds.length} /{" "}
                      {availableTrainingFontIds.length}
                    </p>
                  </div>
                  <div className="rounded-lg bg-zinc-100 px-3 py-2 dark:bg-zinc-800">
                    <p className="text-[calc(11px+2pt)] font-semibold text-zinc-600 dark:text-zinc-300">
                      Awaiting mastery
                    </p>
                    <p className="text-sm font-bold tabular-nums text-zinc-950 dark:text-white">
                      {trainingRun.awaitingFontIds.length}
                    </p>
                  </div>
                  <div className="rounded-lg bg-zinc-100 px-3 py-2 dark:bg-zinc-800">
                    <p className="text-[calc(11px+2pt)] font-semibold text-zinc-600 dark:text-zinc-300">
                      Correct streak
                    </p>
                    <p className="text-sm font-bold tabular-nums text-zinc-950 dark:text-white">
                      {trainingRun.consecutiveCorrect} /{" "}
                      {TRAINING_STREAK_TARGET}
                    </p>
                  </div>
                  <div className="rounded-lg bg-zinc-100 px-3 py-2 dark:bg-zinc-800">
                    <p className="text-[calc(11px+2pt)] font-semibold text-zinc-600 dark:text-zinc-300">
                      Score
                    </p>
                    <p className="text-sm font-bold tabular-nums text-zinc-950 dark:text-white">
                      {trainingRun.totalCorrect} /{" "}
                      {trainingRun.totalCorrect + trainingRun.totalIncorrect}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-3">
                  <div className="mb-2 flex items-center justify-between gap-3 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                    <span>
                      Question {questionIndex + 1} of {totalQuestions}
                    </span>
                    <span className="tabular-nums">Score: {score}</span>
                  </div>
                  <div
                    className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700"
                    role="progressbar"
                    aria-label="Quiz progress"
                    aria-valuemin={0}
                    aria-valuemax={totalQuestions}
                    aria-valuenow={questionIndex + 1}
                    aria-valuetext={`Question ${questionIndex + 1} of ${totalQuestions}`}
                  >
                    <div
                      className="h-full rounded-full bg-indigo-600 transition-[width] duration-300 motion-reduce:transition-none dark:bg-indigo-400"
                      style={{
                        width: `${((questionIndex + 1) / totalQuestions) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="px-5 py-6 sm:px-9 sm:py-8">
              <div className="mb-7">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
                    Question {questionIndex + 1}{" "}
                    <span className="font-medium text-zinc-500 dark:text-zinc-400">
                      of {totalQuestions}
                    </span>
                  </p>
                  <p className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-semibold tabular-nums text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                    Score: {score}
                  </p>
                </div>
                <div
                  className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700"
                  role="progressbar"
                  aria-label="Quiz progress"
                  aria-valuemin={0}
                  aria-valuemax={totalQuestions}
                  aria-valuenow={questionIndex + 1}
                  aria-valuetext={`Question ${questionIndex + 1} of ${totalQuestions}`}
                >
                  <div
                    className="h-full rounded-full bg-indigo-600 transition-[width] duration-300 dark:bg-indigo-400"
                    style={{
                      width: `${((questionIndex + 1) / totalQuestions) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <fieldset>
                {question.content.kind === "text" ? (
                  <legend
                    ref={questionLegendRef}
                    tabIndex={-1}
                    className="mb-5 text-xl font-bold leading-snug tracking-tight text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 dark:text-white dark:focus-visible:outline-indigo-400 sm:text-2xl"
                  >
                    {question.content.prompt}
                  </legend>
                ) : (
                  <legend
                    ref={questionLegendRef}
                    tabIndex={-1}
                    className="sr-only"
                  >
                    Font specimen
                  </legend>
                )}
                {renderAnswerChoices()}
              </fieldset>

              {selectedAnswer !== null && (
                <div
                  ref={feedbackRef}
                  tabIndex={-1}
                  className={`mt-5 rounded-xl border p-4 ${
                    selectedAnswer === question.correctAnswerIndex
                      ? "border-green-700 bg-green-50 text-green-950 dark:border-green-800 dark:bg-green-950 dark:text-green-50"
                      : "border-red-700 bg-red-50 text-red-950 dark:border-red-800 dark:bg-red-950 dark:text-red-50"
                  }`}
                  role="status"
                  aria-atomic="true"
                >
                  <p className="font-bold">
                    {selectedAnswer === question.correctAnswerIndex
                      ? "Correct!"
                      : `Not quite. The correct answer is ${
                          question.answers[question.correctAnswerIndex]
                        }.`}
                  </p>
                  {question.content.explanation && (
                    <p className="mt-2 text-sm leading-6 sm:text-base">
                      {question.content.explanation}
                    </p>
                  )}
                </div>
              )}

              {selectedAnswer !== null && (
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="mt-6 w-full rounded-xl bg-indigo-700 px-5 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-indigo-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 dark:bg-indigo-500 dark:text-zinc-950 dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-400"
                >
                  {questionIndex + 1 === totalQuestions
                    ? "See your results"
                    : "Next question"}
                </button>
              )}
            </div>
          )
        ) : null}
      </section>
    </main>
  );
}
