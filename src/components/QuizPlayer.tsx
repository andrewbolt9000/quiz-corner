"use client";

import { useState } from "react";

import type { AnswerIndex, Quiz } from "../data/quizzes";

const answerIndexes: readonly AnswerIndex[] = [0, 1, 2, 3];

type QuizPlayerProps = {
  quiz: Quiz;
};

export default function QuizPlayer({ quiz }: QuizPlayerProps) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<AnswerIndex | null>(
    null,
  );
  const [score, setScore] = useState(0);

  const totalQuestions = quiz.questions.length;
  const isComplete = questionIndex >= totalQuestions;
  const question = quiz.questions[questionIndex];

  function handleAnswer(answerIndex: AnswerIndex) {
    if (selectedAnswer !== null) {
      return;
    }

    setSelectedAnswer(answerIndex);

    if (answerIndex === question.correctAnswerIndex) {
      setScore((currentScore) => currentScore + 1);
    }
  }

  function handleNextQuestion() {
    setSelectedAnswer(null);
    setQuestionIndex((currentIndex) => currentIndex + 1);
  }

  function handleRestart() {
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
  }

  return (
    <main className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-10 dark:bg-zinc-950 sm:px-6">
      <section className="w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-10">
        <header className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
            Quiz Corner
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
            {quiz.title}
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-300">
            {quiz.description}
          </p>
        </header>

        {totalQuestions === 0 ? (
          <p className="text-zinc-700 dark:text-zinc-200">
            This quiz does not have any questions yet.
          </p>
        ) : isComplete ? (
          <div className="space-y-6" aria-labelledby="quiz-results-title">
            <div>
              <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                Quiz complete
              </p>
              <h2
                id="quiz-results-title"
                className="mt-2 text-2xl font-bold text-zinc-950 dark:text-white"
              >
                Your results
              </h2>
              <p className="mt-3 text-lg text-zinc-700 dark:text-zinc-200">
                You scored{" "}
                <span className="font-bold">
                  {score} out of {totalQuestions}
                </span>
                .
              </p>
            </div>
            <button
              type="button"
              onClick={handleRestart}
              className="w-full rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Restart quiz
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <div className="mb-2 flex items-center justify-between text-sm font-medium text-zinc-600 dark:text-zinc-300">
                <span>
                  Question {questionIndex + 1} of {totalQuestions}
                </span>
                <span>Score: {score}</span>
              </div>
              <progress
                aria-label="Quiz progress"
                className="h-2 w-full accent-indigo-600"
                value={questionIndex + 1}
                max={totalQuestions}
              />
            </div>

            <fieldset>
              <legend className="mb-5 text-xl font-semibold text-zinc-950 dark:text-white">
                {question.prompt}
              </legend>
              <div className="space-y-3">
                {answerIndexes.map((answerIndex) => {
                  const answer = question.answers[answerIndex];
                  const isSelected = selectedAnswer === answerIndex;
                  const isCorrect =
                    question.correctAnswerIndex === answerIndex;
                  let answerStyle =
                    "border-zinc-300 bg-white text-zinc-800 hover:border-indigo-500 hover:bg-indigo-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800";
                  let answerStatus = "";

                  if (selectedAnswer !== null && isCorrect) {
                    answerStyle =
                      "border-green-600 bg-green-50 text-green-900 dark:border-green-500 dark:bg-green-950 dark:text-green-100";
                    answerStatus =
                      selectedAnswer === answerIndex
                        ? "Your answer — correct"
                        : "Correct answer";
                  } else if (selectedAnswer !== null && isSelected) {
                    answerStyle =
                      "border-red-600 bg-red-50 text-red-900 dark:border-red-500 dark:bg-red-950 dark:text-red-100";
                    answerStatus = "Your answer — incorrect";
                  } else if (selectedAnswer !== null) {
                    answerStyle =
                      "border-zinc-200 bg-zinc-50 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400";
                  }

                  return (
                    <label
                      key={`${question.id}-${answerIndex}`}
                      className={`flex w-full items-center justify-between gap-4 rounded-lg border px-4 py-3 text-left transition-colors ${selectedAnswer !== null ? "cursor-default" : "cursor-pointer"} ${answerStyle}`}
                    >
                      <span className="flex items-start gap-3">
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={answerIndex}
                          checked={isSelected}
                          disabled={selectedAnswer !== null}
                          onChange={() => handleAnswer(answerIndex)}
                          className="mt-1 h-4 w-4 shrink-0 accent-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        />
                        <span>{answer}</span>
                      </span>
                      {answerStatus && (
                        <span className="shrink-0 text-sm font-semibold">
                          {answerStatus}
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            </fieldset>

            {selectedAnswer !== null && (
              <div
                className="mt-5 space-y-2 rounded-lg bg-zinc-100 p-4 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
                role="status"
                aria-live="polite"
              >
                <p className="font-semibold">
                  {selectedAnswer === question.correctAnswerIndex
                    ? "Correct!"
                    : `Not quite. The correct answer is ${
                        question.answers[question.correctAnswerIndex]
                      }.`}
                </p>
                {question.explanation && <p>{question.explanation}</p>}
              </div>
            )}

            {selectedAnswer !== null && (
              <button
                type="button"
                onClick={handleNextQuestion}
                className="mt-6 w-full rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {questionIndex + 1 === totalQuestions
                  ? "See results"
                  : "Next question"}
              </button>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
