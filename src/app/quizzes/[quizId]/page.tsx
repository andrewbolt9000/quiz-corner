import { notFound } from "next/navigation";

import QuizPlayer from "../../../components/QuizPlayer";
import { fontCatalog } from "../../../data/fontCatalog";
import { getQuizById, quizRegistry } from "../../../data/quizRegistry";

export const dynamicParams = false;

export function generateStaticParams() {
  return quizRegistry
    .filter((quiz) => quiz.route.startsWith("/quizzes/"))
    .map(({ id }) => ({ quizId: id }));
}

export default async function CollectionQuizPage({
  params,
}: {
  params: Promise<{ quizId: string }>;
}) {
  const { quizId } = await params;
  const definition = quizRegistry.find(
    (entry) =>
      entry.id === quizId && entry.route === `/quizzes/${quizId}/`,
  );

  if (!definition) {
    notFound();
  }

  const quiz = getQuizById(quizId);
  const hasFontSpecimens = quiz.questions.some(
    (question) => question.content.kind === "font-specimen",
  );
  const trainingFontIds = fontCatalog
    .filter(
      (font) =>
        font.licensingStatus === "cleared" &&
        definition.collectionIds.some((collectionId) =>
          font.collections.includes(collectionId),
        ),
    )
    .map((font) => font.id);

  return (
    <QuizPlayer
      quiz={quiz}
      shuffleOnStart={hasFontSpecimens}
      specimenTextSelector={hasFontSpecimens}
      trainingFontIds={hasFontSpecimens ? trainingFontIds : undefined}
    />
  );
}
