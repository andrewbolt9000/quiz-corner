import Link from "next/link";

import { quizRegistry } from "../data/quizRegistry";

export default function Home() {
  return (
    <main className="flex-1 bg-black px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-indigo-300">
            Quiz Corner
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            All Quizzes
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-300 sm:text-base">
            Choose a quiz to practice font identification or explore
            typography.
          </p>
        </header>

        <ul className="grid gap-4 sm:grid-cols-2">
          {quizRegistry.map((quiz) => (
            <li
              key={quiz.id}
              className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-6"
            >
              <h2 className="text-lg font-bold text-zinc-950 dark:text-white sm:text-xl">
                {quiz.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                {quiz.description}
              </p>
              <p className="mt-3 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                {quiz.questionCount}{" "}
                {quiz.questionCount === 1 ? "question" : "questions"}
              </p>
              <Link
                href={quiz.route}
                className="mt-4 inline-flex min-h-11 items-center rounded-lg bg-indigo-700 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 dark:bg-indigo-500 dark:text-zinc-950 dark:hover:bg-indigo-400"
              >
                Start quiz
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
