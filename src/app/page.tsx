import QuizPlayer from "../components/QuizPlayer";
import { getQuizById } from "../data/quizRegistry";
import { QUIZ_IDS } from "../data/quizIds";

export default function Home() {
  return <QuizPlayer quiz={getQuizById(QUIZ_IDS.artHistory)} />;
}
