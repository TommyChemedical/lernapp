import { init } from '@instantdb/react';

// Define the schema
type Schema = {
  users: {
    id: string;
    name: string;
    profilePicture?: string;
    createdAt: number;
  };
  quizResults: {
    id: string;
    userId: string;
    subject: string;
    score: number;
    totalQuestions: number;
    timestamp: number;
  };
};

// Initialize InstantDB
const db = init<Schema>({
  appId: '4eecb660-0c8b-4080-8bde-9b6d42c3096d',
});

export default db;
