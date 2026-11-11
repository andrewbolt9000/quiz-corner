import { notFound } from "next/navigation";

import QuizPlayer from "../../../components/QuizPlayer";
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

  return <QuizPlayer quiz={getQuizById(quizId)} />;
}
