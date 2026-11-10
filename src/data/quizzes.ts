export type AnswerIndex = 0 | 1 | 2 | 3;

export type QuizQuestion = {
  id: string;
  prompt: string;
  answers: readonly [string, string, string, string];
  correctAnswerIndex: AnswerIndex;
  explanation?: string;
};

export type Quiz = {
  id: string;
  title: string;
  description: string;
  questions: readonly QuizQuestion[];
};

export const artHistoryQuiz = {
  id: "art-history",
  title: "Art History",
  description: "Five questions about notable works of Western art.",
  questions: [
    {
      id: "mona-lisa",
      prompt: "Who painted the Mona Lisa?",
      answers: [
        "Leonardo da Vinci",
        "Michelangelo",
        "Raphael",
        "Sandro Botticelli",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Leonardo da Vinci painted the Mona Lisa, generally dated to the early 16th century.",
    },
    {
      id: "sistine-chapel-ceiling",
      prompt: "Who painted the ceiling of the Sistine Chapel in the Vatican?",
      answers: [
        "Raphael",
        "Michelangelo",
        "Donatello",
        "Leonardo da Vinci",
      ],
      correctAnswerIndex: 1,
      explanation:
        "Michelangelo painted the Sistine Chapel ceiling for Pope Julius II; the work was completed in 1512.",
    },
    {
      id: "guernica",
      prompt: "Who painted Guernica in 1937?",
      answers: [
        "Salvador Dalí",
        "Joan Miró",
        "Pablo Picasso",
        "Diego Velázquez",
      ],
      correctAnswerIndex: 2,
      explanation:
        "Pablo Picasso painted Guernica in 1937. The work responds to the bombing of the Basque town of Guernica during the Spanish Civil War.",
    },
    {
      id: "impression-sunrise",
      prompt: "Who painted Impression, soleil levant (Impression, Sunrise)?",
      answers: [
        "Édouard Manet",
        "Pierre-Auguste Renoir",
        "Edgar Degas",
        "Claude Monet",
      ],
      correctAnswerIndex: 3,
      explanation:
        "Claude Monet painted Impression, soleil levant. The painting's title was later associated with the name of the Impressionist movement.",
    },
    {
      id: "david-sculpture",
      prompt: "Who sculpted the marble statue of David completed in 1504?",
      answers: [
        "Donatello",
        "Michelangelo",
        "Gian Lorenzo Bernini",
        "Auguste Rodin",
      ],
      correctAnswerIndex: 1,
      explanation:
        "Michelangelo carved the marble David between 1501 and 1504. The statue is now displayed at the Galleria dell'Accademia in Florence.",
    },
  ],
} satisfies Quiz;
