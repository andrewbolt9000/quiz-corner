import FontSpecimen from "./FontSpecimen";
import { fontCatalog } from "../data/fontCatalog";
import type { QuizQuestionContent } from "../data/quizzes";

function assertNever(content: never): never {
  throw new Error(`Unsupported question content kind: ${String(content)}`);
}

export default function QuestionContent({
  content,
}: {
  content: QuizQuestionContent;
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
          <FontSpecimen
            fontFamily={font.family}
            fontWeight={font.weight}
            fontStyle={font.style}
            fontAvailable={
              font.licensingStatus === "cleared" &&
              specimen.fontAvailable !== false
            }
            sampleText={specimen.sampleText}
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
