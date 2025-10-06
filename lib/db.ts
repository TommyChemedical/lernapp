import { init, tx, id } from '@instantdb/react';

// Define the schema
interface User {
  id: string;
  name: string;
  profilePicture?: string;
  createdAt: number;
}

interface QuizResult {
  id: string;
  userId: string;
  subject: string;
  score: number;
  totalQuestions: number;
  timestamp: number;
}

type Schema = {
  users: User;
  quizResults: QuizResult;
};

// Initialize InstantDB
const db = init<Schema>({
  appId: '4eecb660-0c8b-4080-8bde-9b6d42c3096d',
});

export { tx, id };
export default db;
