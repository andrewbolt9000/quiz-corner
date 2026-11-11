import { useRef, type KeyboardEvent } from "react";

import FontSpecimen from "./FontSpecimen";
import { fontCatalog } from "../data/fontCatalog";
import type { QuizQuestionContent } from "../data/quizzes";

export type SpecimenTextMode = "alphabet" | "article" | "pangram";

const specimenTextByMode: Record<SpecimenTextMode, string> = {
  alphabet:
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ\nabcdefghijklmnopqrstuvwxyz",
  article:
    "Water moves continuously between the surface of the Earth and the atmosphere. Heat from the sun causes liquid water to evaporate, and plants release water vapor through their leaves. As the vapor rises, it expands and cools. Tiny droplets form when the air can no longer hold as much moisture, and these droplets gather around small particles in the atmosphere. Billions of them together make a cloud visible from the ground.\n\nAir currents carry clouds over mountains, plains, and open water. When droplets collide and grow heavy, they fall as rain. In colder conditions, water may freeze into ice crystals and reach the ground as snow. Some precipitation lands on plants and returns to the air, while some runs over the surface into small channels. Other water enters the soil, where it may remain for a time or slowly travel toward a spring.\n\nStreams join to form rivers, which carry water across broad landscapes and toward lakes or the sea. Along the way, water can pick up small amounts of minerals and loose soil. Wetlands hold water among grasses and other plants, providing shelter for many kinds of animals. Underground, water moves through spaces between grains of sand and cracks in rock; wells and springs can bring some of it back to the surface.\n\nThe amount of water in a place changes with seasons, temperature, wind, and local landforms. A dry period may lower the level of a pond, while steady rain can refill it. Snow stored at high elevations may melt gradually and feed streams later in the year. From a single drop on a leaf to a wide ocean, water is always moving, changing form, and connecting distant parts of the environment.",
  pangram: "The quick brown fox jumps over the lazy dog.",
};

function assertNever(content: never): never {
  throw new Error(`Unsupported question content kind: ${String(content)}`);
}

export default function QuestionContent({
  content,
  specimenTextMode,
  onSpecimenTextModeChange,
}: {
  content: QuizQuestionContent;
  specimenTextMode?: SpecimenTextMode;
  onSpecimenTextModeChange?: (mode: SpecimenTextMode) => void;
}) {
  const sampleModeNames: readonly SpecimenTextMode[] = [
    "alphabet",
    "article",
    "pangram",
  ];
  const sampleModeIndex = specimenTextMode
    ? sampleModeNames.indexOf(specimenTextMode)
    : 0;
  const sampleModeRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function handleSampleModeKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    let nextIndex = index;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (index + 1) % sampleModeNames.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (index + sampleModeNames.length - 1) % sampleModeNames.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = sampleModeNames.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    const nextMode = sampleModeNames[nextIndex];
    onSpecimenTextModeChange?.(nextMode);
    sampleModeRefs.current[nextIndex]?.focus();
  }

  switch (content.kind) {
    case "text":
      return null;
    case "font-specimen": {
      const { specimen } = content;
      const font = fontCatalog.find(
        (catalogFont) => catalogFont.id === specimen.fontId,
      );

      if (!font) {
        throw new Error(
          `Question references unknown public font "${specimen.fontId}".`,
        );
      }

      return (
        <div className="mb-4">
          <div
            className={`mt-3 h-64 overflow-x-hidden overflow-y-auto rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 dark:border-zinc-700 dark:bg-zinc-950 sm:h-72 sm:px-7 sm:py-5 ${
              specimenTextMode === "article"
                ? "scroll-smooth motion-reduce:scroll-auto"
                : "flex items-center"
            }`}
          >
            <FontSpecimen
              fontFamily={font.family}
              fontWeight={font.weight}
              fontStyle={font.style}
              fontAvailable={
                font.licensingStatus === "cleared" &&
                specimen.fontAvailable !== false
              }
              sampleText={
                specimenTextByMode[specimenTextMode ?? "alphabet"]
              }
              sampleTextLabel={specimen.accessibleDescription}
              fontSize={specimenTextMode === "article" ? "1.25rem" : "2.5rem"}
              className="w-full"
              showCaption={false}
            />
          </div>
          {specimenTextMode && onSpecimenTextModeChange && (
            <div
              className="relative mt-3 grid h-10 grid-cols-3 rounded-full bg-zinc-200 p-1 dark:bg-zinc-800"
              role="radiogroup"
              aria-label="Specimen text"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-1 left-1 w-[calc((100%-0.5rem)/3)] rounded-full bg-white shadow-sm transition-transform duration-200 motion-reduce:transition-none dark:bg-zinc-600"
                style={{ transform: `translateX(${sampleModeIndex * 100}%)` }}
              />
              {sampleModeNames.map((mode, index) => {
                const label =
                  mode === "alphabet"
                    ? "ABC"
                    : mode === "article"
                      ? "Article"
                      : "Pangram";

                return (
                  <button
                    key={mode}
                    ref={(element) => {
                      sampleModeRefs.current[index] = element;
                    }}
                    type="button"
                    role="radio"
                    aria-checked={specimenTextMode === mode}
                    aria-label={
                      mode === "alphabet" ? "Alphabet" : label
                    }
                    tabIndex={specimenTextMode === mode ? 0 : -1}
                    onClick={() => onSpecimenTextModeChange(mode)}
                    onKeyDown={(event) =>
                      handleSampleModeKeyDown(event, index)
                    }
                    className={`relative z-10 rounded-full px-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 motion-reduce:transition-none dark:focus-visible:outline-indigo-300 ${
                      specimenTextMode === mode
                        ? "text-zinc-950 dark:text-white"
                        : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      );
    }
    default:
      return assertNever(content);
  }
}
