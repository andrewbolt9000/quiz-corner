import Link from "next/link";
import { notFound } from "next/navigation";

import FontSpecimen from "../../../components/FontSpecimen";
import {
  fontCatalog,
  type FontRecord,
} from "../../../data/fontCatalog";
import {
  fontCollections,
} from "../../../data/fontCollections";
import {
  getQuizzesForCollection,
  type QuizFormat,
} from "../../../data/quizRegistry";

export const dynamicParams = false;

export function generateStaticParams() {
  return fontCollections.map((collection) => ({
    collectionId: collection.id,
  }));
}

function getFaceDescription(font: FontRecord): string {
  const weightNames: Record<FontRecord["weight"], string> = {
    400: "Regular",
    500: "Medium",
    600: "Semibold",
    700: "Bold",
  };
  const weightName = weightNames[font.weight];

  return font.style === "italic" ? `${weightName} Italic` : weightName;
}

function getFormatDescription(format: QuizFormat): string {
  switch (format) {
    case "font-specimen":
      return "Font specimen identification";
    case "font-identification":
      return "Font identification";
    case "typeface-characteristics":
      return "Typeface characteristics";
    case "historical-knowledge":
      return "Historical knowledge";
    case "typeface-comparison":
      return "Typeface comparison";
    case "mixed":
      return "Mixed question formats";
    default: {
      const exhaustiveFormat: never = format;
      throw new Error(`Unsupported quiz format: ${exhaustiveFormat}`);
    }
  }
}

export default async function FontCollectionPage({
  params,
}: {
  params: Promise<{ collectionId: string }>;
}) {
  const { collectionId } = await params;
  const collection = fontCollections.find(
    (entry) => entry.id === collectionId,
  );

  if (!collection) {
    notFound();
  }

  const fonts = fontCatalog.filter(
    (font) =>
      font.licensingStatus === "cleared" &&
      font.collections.includes(collection.id),
  );
  const quizzes = getQuizzesForCollection(collectionId);

  return (
    <main className="flex-1 bg-gradient-to-br from-indigo-50 via-zinc-50 to-amber-50 px-4 py-8 dark:from-zinc-950 dark:via-zinc-950 dark:to-indigo-950 sm:px-6 sm:py-12">
        <article className="mx-auto w-full max-w-5xl">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-indigo-700 dark:text-indigo-300">
            Typeface Collection
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-4xl">
            {collection.name}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-600 dark:text-zinc-300 sm:text-base">
            {collection.description}
          </p>
          <p className="mt-4 text-sm">
            <Link
              href="/font-collections/"
              className="font-semibold text-indigo-700 underline underline-offset-2 hover:text-indigo-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 dark:text-indigo-300 dark:hover:text-indigo-200 dark:focus-visible:outline-indigo-400"
            >
              All typeface collections
            </Link>
          </p>

          <section
            aria-labelledby="collection-typefaces-title"
            className="mt-9"
          >
            <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h2
                id="collection-typefaces-title"
                className="text-xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-2xl"
              >
                Public typefaces
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {fonts.length} {fonts.length === 1 ? "record" : "records"}
              </p>
            </div>

            {fonts.length > 0 ? (
              <ul className="divide-y divide-zinc-200 rounded-2xl border border-zinc-200 bg-white px-5 dark:divide-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 sm:px-8">
                {fonts.map((font) => (
                  <li
                    key={font.id}
                    className="grid min-w-0 gap-4 py-6 sm:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] sm:items-center sm:gap-8"
                  >
                    <div className="min-w-0">
                      <p className="break-words text-base font-bold text-zinc-950 dark:text-white">
                        {font.name}
                      </p>
                      <dl className="mt-2 grid grid-cols-[max-content_minmax(0,1fr)] gap-x-3 gap-y-1 text-xs leading-5 text-zinc-600 dark:text-zinc-300 sm:text-sm">
                        <dt className="font-semibold">Family</dt>
                        <dd className="break-words">{font.family}</dd>
                        <dt className="font-semibold">Face</dt>
                        <dd>{getFaceDescription(font)}</dd>
                        <dt className="font-semibold">Weight</dt>
                        <dd>{font.weight}</dd>
                        <dt className="font-semibold">Style</dt>
                        <dd>{font.style}</dd>
                      </dl>
                    </div>
                    <div className="min-w-0 rounded-xl bg-zinc-50 px-4 py-5 dark:bg-zinc-950 sm:px-5">
                      <FontSpecimen
                        fontFamily={font.family}
                        fontWeight={font.weight}
                        fontStyle={font.style}
                        fontAvailable={font.licensingStatus === "cleared"}
                        sampleText="The quick brown fox jumps over 123 lazy dogs."
                        fontSize="1.75rem"
                        showCaption={false}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded-2xl border border-dashed border-zinc-300 bg-white/70 px-5 py-6 text-sm leading-6 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-300 sm:px-8">
                No publicly available typeface specimens are currently assigned
                to this collection. The collection definition is ready for
                future catalog additions.
              </p>
            )}
          </section>

          <section aria-labelledby="collection-quizzes-title" className="mt-10">
            <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h2
                id="collection-quizzes-title"
                className="text-xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-2xl"
              >
                Collection quizzes
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {quizzes.length} {quizzes.length === 1 ? "quiz" : "quizzes"}
              </p>
            </div>

            {quizzes.length > 0 ? (
              <ul className="divide-y divide-zinc-200 rounded-2xl border border-zinc-200 bg-white px-5 dark:divide-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 sm:px-8">
                {quizzes.map((quiz) => (
                  <li
                    key={quiz.id}
                    className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3 py-5"
                  >
                    <div className="min-w-0">
                      <h3 className="text-base font-bold text-zinc-950 dark:text-white">
                        {quiz.title}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                        {quiz.description}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                        {getFormatDescription(quiz.format)} ·{" "}
                        {quiz.difficulty} · {quiz.questionCount}{" "}
                        {quiz.questionCount === 1 ? "question" : "questions"}
                      </p>
                    </div>
                    <Link
                      href={quiz.route}
                      className="shrink-0 rounded-lg bg-indigo-700 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 dark:bg-indigo-500 dark:text-zinc-950 dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-400"
                    >
                      Start quiz
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded-2xl border border-dashed border-zinc-300 bg-white/70 px-5 py-6 text-sm leading-6 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-300 sm:px-8">
                There are no quizzes assigned to this collection yet.
              </p>
            )}
          </section>
        </article>
    </main>
  );
}
