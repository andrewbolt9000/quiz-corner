import QuizPlayer from "../components/QuizPlayer";
import { artHistoryQuiz } from "../data/quizzes";

export default function Home() {
  return <QuizPlayer quiz={artHistoryQuiz} />;
}
