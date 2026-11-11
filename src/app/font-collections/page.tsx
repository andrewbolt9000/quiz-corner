import Link from "next/link";

import { fontCatalog } from "../../data/fontCatalog";
import { fontCollections } from "../../data/fontCollections";
import { getQuizzesForCollection } from "../../data/quizRegistry";

export default function FontCollectionsPage() {
  return (
    <main className="flex-1 bg-gradient-to-br from-indigo-50 via-zinc-50 to-amber-50 px-4 py-8 dark:from-zinc-950 dark:via-zinc-950 dark:to-indigo-950 sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-indigo-700 dark:text-indigo-300">
            Font Library
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-4xl">
            Typeface Collections
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-300 sm:text-base">
            Browse the public typeface records by collection, then explore any
            quizzes connected to that collection.
          </p>
        </header>

        <ul className="divide-y divide-zinc-200 rounded-2xl border border-zinc-200 bg-white px-5 dark:divide-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 sm:px-8">
          {fontCollections.map((collection) => {
            const fontCount = fontCatalog.filter(
              (font) =>
                font.licensingStatus === "cleared" &&
                font.collections.includes(collection.id),
            ).length;
            const quizCount = getQuizzesForCollection(collection.id).length;

            return (
              <li key={collection.id} className="py-5 sm:py-6">
                <Link
                  href={`/font-collections/${collection.id}/`}
                  className="group rounded text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-700 dark:text-white dark:focus-visible:outline-indigo-400"
                >
                  <span className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <span className="text-lg font-bold group-hover:text-indigo-700 dark:group-hover:text-indigo-300 sm:text-xl">
                      {collection.name}
                    </span>
                    <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      {fontCount} {fontCount === 1 ? "typeface" : "typefaces"}{" "}
                      · {quizCount} {quizCount === 1 ? "quiz" : "quizzes"}
                    </span>
                  </span>
                </Link>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                  {collection.description}
                </p>
              </li>
            );
          })}
        </ul>

        <p className="mt-6 text-sm">
          <Link
            href="/font-library/"
            className="font-semibold text-indigo-700 underline underline-offset-2 hover:text-indigo-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 dark:text-indigo-300 dark:hover:text-indigo-200 dark:focus-visible:outline-indigo-400"
          >
            Return to the Font Library
          </Link>
        </p>
      </div>
    </main>
  );
}
