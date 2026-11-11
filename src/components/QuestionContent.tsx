import FontSpecimen from "./FontSpecimen";
import { fontCatalog } from "../data/fontCatalog";
import type { QuizQuestionContent } from "../data/quizzes";

export type SpecimenTextMode = "alphabet" | "article" | "pangram";

const specimenTextByMode: Record<SpecimenTextMode, string> = {
  alphabet:
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ\nabcdefghijklmnopqrstuvwxyz",
  article:
    "Typography gives written language a visible form. A page's typeface, spacing, and arrangement influence how readers move through information, distinguish levels of emphasis, and recognize the character of a publication. The same words can feel different when set in a compact sans serif, a sturdy slab serif, or a more calligraphic book face.\n\nType designs also carry histories. Letterforms used for early printing often drew on handwriting familiar to readers, while later designers explored new proportions and methods of construction. Today, digital fonts can include thousands of characters, carefully drawn italics, and variable axes that adjust weight or optical size. Studying a passage in continuous text reveals details that a single letter cannot: rhythm, spacing, word shapes, and the texture that builds across a line.",
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
        <div className="mb-5 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-5 dark:border-zinc-700 dark:bg-zinc-950 sm:px-6">
          {specimenTextMode && onSpecimenTextModeChange && (
            <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2">
              <label
                htmlFor="specimen-text-mode"
                className="text-sm font-semibold text-zinc-700 dark:text-zinc-200"
              >
                Specimen text
              </label>
              <select
                id="specimen-text-mode"
                value={specimenTextMode}
                onChange={(event) => {
                  const mode = event.currentTarget.value;
                  if (
                    mode === "alphabet" ||
                    mode === "article" ||
                    mode === "pangram"
                  ) {
                    onSpecimenTextModeChange(mode);
                  }
                }}
                className="max-w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus-visible:outline-indigo-400"
              >
                <option value="alphabet">Alphabet</option>
                <option value="article">Article</option>
                <option value="pangram">Pangram</option>
              </select>
            </div>
          )}
          <FontSpecimen
            fontFamily={font.family}
            fontWeight={font.weight}
            fontStyle={font.style}
            fontAvailable={
              font.licensingStatus === "cleared" &&
              specimen.fontAvailable !== false
            }
            sampleText={
              specimenTextMode
                ? specimenTextByMode[specimenTextMode]
                : specimen.sampleText
            }
            sampleTextLabel={specimen.accessibleDescription}
            fontSize="1.5rem"
            showCaption={false}
          />
        </div>
      );
    }
    default:
      return assertNever(content);
  }
}
