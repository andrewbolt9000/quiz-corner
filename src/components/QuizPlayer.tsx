"use client";

import { useEffect, useRef, useState } from "react";

import QuestionContent, { type SpecimenTextMode } from "./QuestionContent";
import type { AnswerIndex, Quiz } from "../data/quizzes";

const answerIndexes: readonly AnswerIndex[] = [0, 1, 2, 3];
const answerLetters = ["A", "B", "C", "D"] as const;

type QuizPlayerProps = {
  quiz: Quiz;
  shuffleOnStart?: boolean;
  startButtonLabel?: string;
  specimenTextSelector?: boolean;
};

export default function QuizPlayer({
  quiz,
  shuffleOnStart = false,
  startButtonLabel = "Start quiz",
  specimenTextSelector = false,
}: QuizPlayerProps) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<AnswerIndex | null>(
    null,
  );
  const [score, setScore] = useState(0);
  const [specimenTextMode, setSpecimenTextMode] =
    useState<SpecimenTextMode>("alphabet");
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(
    shuffleOnStart ? null : quiz,
  );
  const shouldMoveFocus = useRef(false);
  const questionLegendRef = useRef<HTMLLegendElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null);

  const currentQuiz = activeQuiz ?? quiz;
  const totalQuestions = currentQuiz.questions.length;
  const isComplete = questionIndex >= totalQuestions;
  const question = currentQuiz.questions[questionIndex];

  useEffect(() => {
    if (!shouldMoveFocus.current || activeQuiz === null) {
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
  }, [activeQuiz, isComplete, questionIndex, selectedAnswer]);

  function getShuffledQuiz(): Quiz {
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

  function startQuiz() {
    shouldMoveFocus.current = true;
    setActiveQuiz(shuffleOnStart ? getShuffledQuiz() : quiz);
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
  }

  function handleAnswer(answerIndex: AnswerIndex) {
    if (selectedAnswer !== null || !question) {
      return;
    }

    shouldMoveFocus.current = true;
    setSelectedAnswer(answerIndex);

    if (answerIndex === question.correctAnswerIndex) {
      setScore((currentScore) => currentScore + 1);
    }
  }

  function handleNextQuestion() {
    shouldMoveFocus.current = true;
    setSelectedAnswer(null);
    setQuestionIndex((currentIndex) => currentIndex + 1);
  }

  function handleRestart() {
    startQuiz();
  }

  return (
    <main className="relative flex flex-1 items-center justify-center overflow-x-hidden bg-gradient-to-br from-indigo-50 via-zinc-50 to-amber-50 px-4 py-8 dark:from-zinc-950 dark:via-zinc-950 dark:to-indigo-950 sm:px-6 sm:py-12">
      <section className="w-full max-w-2xl overflow-hidden rounded-3xl border border-white/80 bg-white shadow-xl shadow-indigo-950/5 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-black/20">
        <header className="border-b border-zinc-100 px-5 py-6 dark:border-zinc-800 sm:px-9 sm:py-8">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
            <span
              aria-hidden="true"
              className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] text-white"
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
        </header>

        {activeQuiz === null ? (
          <div className="px-5 py-8 sm:px-9 sm:py-10">
            <p className="text-sm leading-6 text-zinc-700 dark:text-zinc-200">
              Ready to identify the fonts in the library?
            </p>
            <button
              type="button"
              onClick={startQuiz}
              className="mt-5 w-full rounded-xl bg-indigo-700 px-5 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-indigo-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 dark:bg-indigo-500 dark:text-zinc-950 dark:hover:bg-indigo-400"
            >
              {startButtonLabel}
            </button>
          </div>
        ) : totalQuestions === 0 ? (
          <div className="px-5 py-8 sm:px-9 sm:py-10">
            <p className="text-zinc-700 dark:text-zinc-200">
              This quiz does not have any questions yet.
            </p>
          </div>
        ) : isComplete ? (
          <section
            className="px-5 py-8 sm:px-9 sm:py-10"
            aria-labelledby="quiz-results-title"
          >
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

            <fieldset aria-describedby="question-progress">
              <legend
                ref={questionLegendRef}
                tabIndex={-1}
                className="mb-5 text-xl font-bold leading-snug tracking-tight text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 dark:text-white dark:focus-visible:outline-indigo-400 sm:text-2xl"
              >
                {question.content.prompt}
              </legend>
              <QuestionContent
                content={question.content}
                specimenTextMode={
                  specimenTextSelector ? specimenTextMode : undefined
                }
                onSpecimenTextModeChange={
                  specimenTextSelector ? setSpecimenTextMode : undefined
                }
              />
              <div className="space-y-3">
                {answerIndexes.map((answerIndex) => {
                  const answer = question.answers[answerIndex];
                  const isSelected = selectedAnswer === answerIndex;
                  const isCorrect =
                    question.correctAnswerIndex === answerIndex;
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
                      className={`flex min-w-0 items-start gap-3 rounded-xl border p-4 transition-colors sm:gap-4 sm:p-4 ${selectedAnswer !== null ? "cursor-default" : "cursor-pointer"} ${answerStyle}`}
                    >
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={answerIndex}
                        checked={isSelected}
                        disabled={selectedAnswer !== null}
                        onChange={() => handleAnswer(answerIndex)}
                        className="mt-1 h-4 w-4 shrink-0 accent-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 dark:accent-indigo-400 dark:focus-visible:outline-indigo-400"
                      />
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
                    </label>
                  );
                })}
              </div>
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
        )}
      </section>
    </main>
  );
}
