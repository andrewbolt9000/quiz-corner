import Link from "next/link";

import { fontCatalog } from "../../data/fontCatalog";
import { fontCollections } from "../../data/fontCollections";
import { getQuizzesForCollection } from "../../data/quizRegistry";

export default function FontCollectionsPage() {
  return (
    <main className="flex-1 bg-black px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-indigo-700 dark:text-indigo-300">
            Explore and learn
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Font Collections
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-300 sm:text-base">
            Collections group related public typefaces so you can compare their
            forms, learn about their design traditions, and try a quiz for each
            topic.
          </p>
        </header>

        <ul className="grid gap-4 sm:grid-cols-2">
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
            const quizCount = getQuizzesForCollection(collection.id).length;

            return (
              <li
                key={collection.id}
                className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-6"
              >
                <Link
                  href={`/font-collections/${collection.id}/`}
                  className="group rounded text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-700 dark:text-white dark:focus-visible:outline-indigo-400"
                >
                  <span className="block text-lg font-bold group-hover:text-indigo-700 dark:group-hover:text-indigo-300 sm:text-xl">
                    {collection.name}
                  </span>
                </Link>
                <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                  {collection.description}
                </p>
                <p className="mt-4 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  {familyCount} {familyCount === 1 ? "family" : "families"} ·{" "}
                  {quizCount}{" "}
                  {quizCount === 1 ? "playable quiz" : "playable quizzes"}
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
