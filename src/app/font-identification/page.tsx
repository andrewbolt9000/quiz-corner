import Link from "next/link";

import QuizPlayer from "../../components/QuizPlayer";
import { fontCatalog } from "../../data/fontCatalog";
import { fontCollections } from "../../data/fontCollections";
import {
  getQuizById,
  getQuizzesForCollection,
} from "../../data/quizRegistry";
import { QUIZ_IDS } from "../../data/quizIds";

function getCollectionQuiz(collectionId: string) {
  const quiz = getQuizzesForCollection(collectionId).find((entry) =>
    entry.route.startsWith("/quizzes/"),
  );

  if (!quiz) {
    throw new Error(
      `Collection "${collectionId}" does not have a dedicated quiz route.`,
    );
  }

  return quiz;
}

export default function FontIdentificationPage() {
  return (
    <>
      <QuizPlayer
        quiz={getQuizById(QUIZ_IDS.fontIdentification)}
        shuffleOnStart
        startButtonLabel="Quiz Me on All Fonts"
        specimenTextSelector
      />

      <section className="border-y border-indigo-100 bg-white px-4 py-8 dark:border-zinc-800 dark:bg-zinc-900 sm:px-6 sm:py-10">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-5 rounded-2xl bg-indigo-50 p-5 dark:bg-indigo-950/50 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-indigo-700 dark:text-indigo-300">
              A different kind of quiz
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
              Font Knowledge
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-700 dark:text-zinc-200 sm:text-base">
              Identification asks you to recognize a typeface from its
              specimen. Font Knowledge asks about typography, letter anatomy,
              classifications, history, and digital font technology—without
              specimen-identification questions.
            </p>
          </div>
          <Link
            href="/quizzes/font-knowledge/"
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-indigo-700 px-5 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-indigo-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 dark:bg-indigo-500 dark:text-zinc-950 dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-400"
          >
            Start Font Knowledge
          </Link>
        </div>
      </section>

      <section className="bg-zinc-50 px-4 py-10 dark:bg-zinc-950 sm:px-6 sm:py-14">
        <div className="mx-auto w-full max-w-5xl">
          <header className="mb-6">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-indigo-700 dark:text-indigo-300">
              Explore by topic
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-3xl">
              Choose a Font Collection
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-600 dark:text-zinc-300 sm:text-base">
              Each collection quiz focuses on a group of related typefaces,
              with specimens and questions selected for that topic.
            </p>
          </header>

          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {fontCollections.map((collection) => {
              const familyCount = new Set(
                fontCatalog
                  .filter(
                    (font) =>
                      font.licensingStatus === "cleared" &&
                      font.collections.includes(collection.id),
                  )
                  .map((font) => font.family),
              ).size;
              const collectionQuiz = getCollectionQuiz(collection.id);

              return (
                <li
                  key={collection.id}
                  className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <Link
                    href={collectionQuiz.route}
                    className="group rounded text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-700 dark:text-white dark:focus-visible:outline-indigo-400"
                  >
                    <h3 className="text-lg font-bold group-hover:text-indigo-700 dark:group-hover:text-indigo-300">
                      {collection.name}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                      {collection.description}
                    </p>
                    <p className="mt-4 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      {familyCount}{" "}
                      {familyCount === 1 ? "family" : "families"} ·{" "}
                      {collectionQuiz.questionCount} questions
                    </p>
                    <span className="mt-4 inline-flex rounded-lg bg-indigo-700 px-4 py-2.5 text-sm font-semibold text-white transition group-hover:bg-indigo-800 dark:bg-indigo-500 dark:text-zinc-950 dark:group-hover:bg-indigo-400">
                      Play {collection.name} quiz
                    </span>
                  </Link>
                  <Link
                    href={`/font-collections/${collection.id}/`}
                    className="mt-4 w-fit text-sm font-semibold text-indigo-700 underline underline-offset-2 hover:text-indigo-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 dark:text-indigo-300 dark:hover:text-indigo-200 dark:focus-visible:outline-indigo-400"
                  >
                    Explore collection
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
}
