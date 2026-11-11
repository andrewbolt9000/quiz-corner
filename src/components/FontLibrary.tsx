"use client";

import { useState } from "react";
import Link from "next/link";

import FontSpecimen from "./FontSpecimen";
import { typographyArticle } from "../data/articles/typography";
import { fontCatalog, fontCollections } from "../data/fontCatalog";
import type { FontRecord } from "../data/fontCatalog";
import type { FontCollectionId } from "../data/fontCatalog";
import type {
  TypographyArticleBlock,
  TypographyArticleList,
  TypographyListItem,
} from "../data/articles/typography";

type ViewMode = "comparison" | "continuous";
type SampleMode = "font-name" | "custom" | "wikipedia";

const defaultSample =
  "Sphinx of black quartz, judge my vow. Bright letters carry ideas across time.";

function getSampleText(
  font: FontRecord,
  mode: Exclude<SampleMode, "wikipedia">,
  customText: string,
) {
  if (mode === "font-name") {
    return font.name;
  }

  return customText;
}

function getArticleHeadingTag(
  level: 2 | 3 | 4 | 5 | 6,
): "h3" | "h4" | "h5" | "h6" {
  if (level === 2) {
    return "h3";
  }
  if (level === 3) {
    return "h4";
  }
  if (level === 4) {
    return "h5";
  }
  return "h6";
}

function ArticleFontRow({
  text,
  font,
}: {
  text: string;
  font: FontRecord;
}) {
  if (font.licensingStatus !== "cleared") {
    return (
      <p className="text-sm leading-6 text-amber-900 dark:text-amber-100">
        Specimen unavailable: {font.name} is not cleared for public
        distribution.
      </p>
    );
  }

  return (
    <div className="grid min-w-0 grid-cols-1 gap-1 sm:grid-cols-[minmax(7rem,0.2fr)_minmax(0,1fr)] sm:gap-4">
      <span className="break-words text-xs font-semibold leading-5 text-zinc-600 dark:text-zinc-300 sm:pt-1">
        {font.name}
      </span>
      <p
        className="min-w-0 break-words text-base leading-relaxed text-zinc-800 [overflow-wrap:anywhere] dark:text-zinc-200 sm:text-lg"
        style={{
          fontFamily: `"${font.family}", serif`,
          fontWeight: font.weight,
          fontStyle: font.style,
        }}
      >
        {text}
      </p>
    </div>
  );
}

function countListTexts(list: TypographyArticleList): number {
  return list.items.reduce(
    (count, item) => count + countListItemTexts(item),
    0,
  );
}

function countListItemTexts(item: TypographyListItem): number {
  return (
    Number(Boolean(item.text)) +
    (item.lists?.reduce((count, list) => count + countListTexts(list), 0) ?? 0)
  );
}

function countArticleBlockTexts(block: TypographyArticleBlock): number {
  if (block.type === "heading") {
    return 0;
  }
  if (block.type === "list") {
    return countListTexts(block);
  }
  return 1;
}

function renderArticleList(
  list: TypographyArticleList,
  key: string,
  startIndex: number,
  fonts: FontRecord[],
) {
  const ListTag = list.ordered ? "ol" : "ul";

  return (
    <ListTag
      key={key}
      className={`space-y-3 pl-5 ${
        list.ordered ? "list-decimal" : "list-disc"
      } marker:text-zinc-500 dark:marker:text-zinc-400`}
    >
      {list.items.map((item, index) => {
        const previousTextCount = list.items
          .slice(0, index)
          .reduce((count, previousItem) => count + countListItemTexts(previousItem), 0);
        const itemIndex = startIndex + previousTextCount;
        const font = item.text
          ? fonts[itemIndex % fonts.length]
          : undefined;

        return (
          <li key={`${key}-${index}`} className="min-w-0 pl-1">
            {font && <ArticleFontRow text={item.text} font={font} />}
            {item.lists?.map((nestedList, nestedIndex) => {
              const previousNestedCount = item.lists
                ?.slice(0, nestedIndex)
                .reduce((count, previousList) => count + countListTexts(previousList), 0) ?? 0;

              return renderArticleList(
                nestedList,
                `${key}-${index}-${nestedIndex}`,
                itemIndex + Number(Boolean(item.text)) + previousNestedCount,
                fonts,
              );
            })}
          </li>
        );
      })}
    </ListTag>
  );
}

function TypographyArticleSpecimen({ fonts }: { fonts: FontRecord[] }) {
  if (fonts.length === 0) {
    return (
      <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">
        No cleared fonts are available in this collection.
      </p>
    );
  }

  return (
    <article
      aria-labelledby="typography-article-title"
      className="min-w-0"
    >
      <header className="mb-5 border-b border-zinc-200 pb-5 dark:border-zinc-700">
        <h3
          id="typography-article-title"
          className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white"
        >
          {typographyArticle.title}
        </h3>
        <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
          {typographyArticle.attribution}, revised{" "}
          <a
            href={typographyArticle.revisionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-indigo-700 underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 dark:text-indigo-300 dark:focus-visible:outline-indigo-400"
          >
            {typographyArticle.revisionId}
          </a>{" "}
          on {typographyArticle.retrievalDate}.{" "}
          <a
            href={typographyArticle.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-indigo-700 underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 dark:text-indigo-300 dark:focus-visible:outline-indigo-400"
          >
            Original Wikipedia article
          </a>
          {" · "}
          <a
            href={typographyArticle.historyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-indigo-700 underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 dark:text-indigo-300 dark:focus-visible:outline-indigo-400"
          >
            Article history
          </a>
          {" · "}
          <a
            href={typographyArticle.license.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-indigo-700 underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 dark:text-indigo-300 dark:focus-visible:outline-indigo-400"
          >
            {typographyArticle.license.name}
          </a>
        </p>
        <p className="mt-2 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
          {typographyArticle.notice}
        </p>
      </header>

      <div className="space-y-4">
        {typographyArticle.blocks.map((block, index) => {
          const key = `${block.type}-${index}`;
          const textIndex = typographyArticle.blocks
            .slice(0, index)
            .reduce(
              (count, previousBlock) =>
                count + countArticleBlockTexts(previousBlock),
              0,
            );

          if (block.type === "heading") {
            const HeadingTag = getArticleHeadingTag(block.level);
            return (
              <HeadingTag
                key={key}
                className={`pt-2 font-bold text-zinc-900 dark:text-zinc-100 ${
                  block.level === 2 ? "text-xl" : "text-lg"
                }`}
              >
                {block.text}
              </HeadingTag>
            );
          }

          if (block.type === "list") {
            return renderArticleList(block, key, textIndex, fonts);
          }

          return (
            <ArticleFontRow
              key={key}
              text={block.text}
              font={fonts[textIndex % fonts.length]}
            />
          );
        })}
      </div>
    </article>
  );
}

export default function FontLibrary() {
  const [viewMode, setViewMode] = useState<ViewMode>("comparison");
  const [sampleMode, setSampleMode] = useState<SampleMode>("font-name");
  const [customText, setCustomText] = useState(defaultSample);
  const [selectedCollection, setSelectedCollection] = useState<
    "all" | FontCollectionId
  >("all");
  const [shuffledFontOrder, setShuffledFontOrder] = useState<
    FontRecord[] | null
  >(null);

  const collectionFonts =
    selectedCollection === "all"
      ? [...fontCatalog]
      : fontCatalog.filter((font) =>
          font.collections.includes(selectedCollection),
        );
  const continuousFonts = shuffledFontOrder
    ? shuffledFontOrder.filter((font) =>
        collectionFonts.some((collectionFont) => collectionFont.id === font.id),
      )
    : collectionFonts;

  function shuffleFonts() {
    setShuffledFontOrder(() => {
      const shuffled = [...collectionFonts];

      for (let index = shuffled.length - 1; index > 0; index -= 1) {
        const otherIndex = Math.floor(Math.random() * (index + 1));
        [shuffled[index], shuffled[otherIndex]] = [
          shuffled[otherIndex],
          shuffled[index],
        ];
      }

      return shuffled;
    });
  }

  function selectCollection(collection: "all" | FontCollectionId) {
    setSelectedCollection(collection);
    setShuffledFontOrder(null);
  }

  function renderCollectionButton(
    id: "all" | FontCollectionId,
    name: string,
    description: string,
    count: number,
    prominent = false,
  ) {
    const isSelected = selectedCollection === id;

    return (
      <button
        key={id}
        type="button"
        aria-pressed={isSelected}
        onClick={() => selectCollection(id)}
        className={`min-w-0 rounded-2xl border p-4 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 dark:focus-visible:outline-indigo-400 ${
          isSelected
            ? "border-indigo-700 bg-indigo-50 ring-1 ring-indigo-700 dark:border-indigo-400 dark:bg-indigo-950/60 dark:ring-indigo-400"
            : "border-zinc-200 bg-white hover:border-indigo-400 hover:bg-indigo-50/60 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-indigo-500 dark:hover:bg-zinc-800"
        } ${prominent ? "sm:p-5" : ""}`}
      >
        <span className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-semibold text-zinc-950 dark:text-white">
            {name}
          </span>
          <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-bold tabular-nums text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
            {count} {count === 1 ? "font" : "fonts"}
          </span>
        </span>
        <span className="mt-1 block text-sm leading-5 text-zinc-600 dark:text-zinc-300">
          {description}
        </span>
      </button>
    );
  }

  return (
    <main className="flex-1 bg-gradient-to-br from-indigo-50 via-zinc-50 to-amber-50 px-4 py-8 dark:from-zinc-950 dark:via-zinc-950 dark:to-indigo-950 sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-3xl border border-white/80 bg-white shadow-xl shadow-indigo-950/5 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-black/20">
        <header className="border-b border-zinc-100 px-5 py-6 dark:border-zinc-800 sm:px-9 sm:py-8">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.14em] text-indigo-700 dark:text-indigo-300">
            Quiz Corner · Font Library
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-4xl">
            Explore type
          </h1>
          <p className="mt-2 max-w-prose text-sm leading-6 text-zinc-600 dark:text-zinc-300 sm:text-base">
            Compare the local font collection side by side, or read a continuous
            specimen that changes typeface as you move through it.
          </p>
        </header>

        <div className="space-y-6 px-5 py-6 sm:px-9 sm:py-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="font-library-view"
                className="mb-2 block text-sm font-semibold text-zinc-800 dark:text-zinc-100"
              >
                Viewing mode
              </label>
              <select
                id="font-library-view"
                value={viewMode}
                onChange={(event) =>
                  setViewMode(
                    event.target.value === "continuous"
                      ? "continuous"
                      : "comparison",
                  )
                }
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus-visible:outline-indigo-400"
              >
                <option value="comparison">Font Comparison</option>
                <option value="continuous">Continuous Specimen</option>
              </select>
            </div>

            {viewMode === "comparison" ? (
              <div>
                <label
                  htmlFor="font-sample-mode"
                  className="mb-2 block text-sm font-semibold text-zinc-800 dark:text-zinc-100"
                >
                  Comparison sample
                </label>
                <select
                  id="font-sample-mode"
                  value={sampleMode}
                  onChange={(event) =>
                    setSampleMode(
                      event.target.value === "custom"
                        ? "custom"
                        : event.target.value === "wikipedia"
                          ? "wikipedia"
                          : "font-name",
                    )
                  }
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus-visible:outline-indigo-400"
                >
                  <option value="font-name">Font name</option>
                  <option value="custom">Specified sample text</option>
                  <option value="wikipedia">Wikipedia article text</option>
                </select>
              </div>
            ) : (
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={shuffleFonts}
                  className="w-full rounded-lg border border-indigo-700 px-4 py-2.5 text-sm font-semibold text-indigo-800 transition hover:bg-indigo-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 dark:border-indigo-400 dark:text-indigo-200 dark:hover:bg-zinc-800 dark:focus-visible:outline-indigo-400"
                >
                  Shuffle font order
                </button>
              </div>
            )}
          </div>

          <section aria-labelledby="font-collections-title">
            <div className="mb-3">
              <h2
                id="font-collections-title"
                className="text-lg font-bold text-zinc-950 dark:text-white"
              >
                Browse collections
              </h2>
              <p className="mt-1 text-sm leading-5 text-zinc-600 dark:text-zinc-300">
                Choose a collection to filter the font specimens. Fonts in
                multiple collections are listed once in each view.
              </p>
              <p className="mt-2 text-sm">
                <Link
                  href="/font-collections/"
                  className="font-semibold text-indigo-700 underline underline-offset-2 hover:text-indigo-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 dark:text-indigo-300 dark:hover:text-indigo-200 dark:focus-visible:outline-indigo-400"
                >
                  Browse collection pages
                </Link>
              </p>
            </div>
            <div className="space-y-3">
              {fontCollections
                .filter(
                  (collection) =>
                    collection.id === "historically-important",
                )
                .map((collection) =>
                  renderCollectionButton(
                    collection.id,
                    collection.name,
                    collection.description,
                    fontCatalog.filter((font) =>
                      font.collections.includes(collection.id),
                    ).length,
                    true,
                  ),
                )}
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {renderCollectionButton(
                  "all",
                  "All fonts",
                  "Browse every font in the catalog once.",
                  fontCatalog.length,
                )}
                {fontCollections
                  .filter(
                    (collection) =>
                      collection.id !== "historically-important",
                  )
                  .map((collection) =>
                    renderCollectionButton(
                      collection.id,
                      collection.name,
                      collection.description,
                      fontCatalog.filter((font) =>
                        font.collections.includes(collection.id),
                      ).length,
                    ),
                  )}
              </div>
            </div>
          </section>

          {viewMode === "comparison" && sampleMode === "custom" && (
            <div>
              <label
                htmlFor="custom-font-sample"
                className="mb-2 block text-sm font-semibold text-zinc-800 dark:text-zinc-100"
              >
                Sample passage
              </label>
              <textarea
                id="custom-font-sample"
                value={customText}
                onChange={(event) => setCustomText(event.target.value)}
                rows={3}
                className="w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm leading-6 text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus-visible:outline-indigo-400"
              />
            </div>
          )}

          {viewMode === "comparison" ? (
            <section aria-labelledby="font-comparison-title">
              <h2
                id="font-comparison-title"
                className="sr-only"
              >
                Compare fonts
              </h2>
              {sampleMode === "wikipedia" ? (
                <TypographyArticleSpecimen fonts={collectionFonts} />
              ) : (
                <>
                  <div className="mb-1 hidden grid-cols-[minmax(0,0.8fr)_minmax(0,1.8fr)] gap-4 border-b border-zinc-200 pb-2 text-xs font-bold uppercase tracking-wide text-zinc-500 dark:border-zinc-700 dark:text-zinc-400 sm:grid">
                    <span>Font</span>
                    <span>Sample</span>
                  </div>
                  <dl className="divide-y divide-zinc-200 dark:divide-zinc-700">
                    {collectionFonts.map((font) => (
                      <div
                        key={font.id}
                        className="grid min-w-0 grid-cols-[minmax(0,0.8fr)_minmax(0,1.8fr)] gap-3 py-5 sm:gap-4"
                      >
                        <dt className="min-w-0">
                          <span className="block break-words text-sm font-semibold leading-5 text-zinc-900 dark:text-zinc-100 sm:text-base">
                            {font.name}
                          </span>
                          <span className="mt-1 block break-all text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                            {font.filename}
                          </span>
                          <span className="mt-1 block text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                            {font.designer
                              ? `Designer: ${font.designer}`
                              : "Designer information unavailable"}
                          </span>
                        </dt>
                        <dd className="min-w-0">
                          <FontSpecimen
                            fontFamily={font.family}
                            fontWeight={font.weight}
                            fontStyle={font.style}
                            fontAvailable={
                              font.licensingStatus === "cleared"
                            }
                            sampleText={getSampleText(
                              font,
                              sampleMode,
                              customText,
                            )}
                            fontSize={
                              sampleMode === "font-name"
                                ? "1.5rem"
                                : "1.125rem"
                            }
                            showCaption={false}
                          />
                        </dd>
                      </div>
                    ))}
                  </dl>
                </>
              )}
            </section>
          ) : (
            <section aria-labelledby="continuous-specimen-title">
              <div className="mb-5">
                <h2
                  id="continuous-specimen-title"
                  className="text-xl font-bold text-zinc-950 dark:text-white"
                >
                  A changing type specimen
                </h2>
                <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                  Each passage uses the next font in the collection. Text
                  excerpts are from Wikipedia; each linked source is credited
                  beneath its passage.
                </p>
              </div>
              <article className="min-w-0 space-y-4">
                {continuousFonts.map((font) => (
                  <FontSpecimen
                    key={font.id}
                    fontFamily={font.family}
                    fontWeight={font.weight}
                    fontStyle={font.style}
                    fontAvailable={
                      font.licensingStatus === "cleared"
                    }
                    sampleText={font.continuousSpecimen.text}
                    fontSize="1.125rem"
                    caption={
                      <>
                        Wikipedia:{" "}
                        <a
                          href={font.continuousSpecimen.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-indigo-700 underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 dark:text-indigo-300 dark:focus-visible:outline-indigo-400"
                        >
                          {font.continuousSpecimen.title}
                        </a>
                      </>
                    }
                  />
                ))}
              </article>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
