import { notFound } from "next/navigation";

import QuizPlayer from "../../../components/QuizPlayer";
import { collectionQuizDefinitions } from "../../../data/collectionQuizzes";
import { getQuizById } from "../../../data/quizRegistry";

export const dynamicParams = false;

export function generateStaticParams() {
  return collectionQuizDefinitions.map(({ id }) => ({
    quizId: id,
  }));
}

export default async function CollectionQuizPage({
  params,
}: {
  params: Promise<{ quizId: string }>;
}) {
  const { quizId } = await params;
  const definition = collectionQuizDefinitions.find(
    (entry) => entry.id === quizId,
  );

  if (!definition) {
    notFound();
  }

  return <QuizPlayer quiz={getQuizById(quizId)} />;
}
