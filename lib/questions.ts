import fs from 'fs';
import path from 'path';

export interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string;
  category?: string;
}

export interface Subject {
  name: string;
  displayName: string;
  questionsCount: number;
}

/**
 * Get all available subjects
 */
export function getSubjects(): Subject[] {
  const subjectsPath = path.join(process.cwd(), 'data', 'subjects');
  const subjects: Subject[] = [];

  try {
    const folders = fs.readdirSync(subjectsPath);

    folders.forEach((folder) => {
      const folderPath = path.join(subjectsPath, folder);
      const questionsPath = path.join(folderPath, 'questions.md');

      if (fs.statSync(folderPath).isDirectory() && fs.existsSync(questionsPath)) {
        const questions = loadQuestionsFromFile(questionsPath);
        subjects.push({
          name: folder,
          displayName: folder.charAt(0).toUpperCase() + folder.slice(1),
          questionsCount: questions.length,
        });
      }
    });
  } catch (error) {
    console.error('Error loading subjects:', error);
  }

  return subjects;
}

/**
 * Load questions from a specific subject
 */
export function loadQuestionsBySubject(subjectName: string): Question[] {
  const questionsPath = path.join(
    process.cwd(),
    'data',
    'subjects',
    subjectName,
    'questions.md'
  );

  return loadQuestionsFromFile(questionsPath);
}

/**
 * Parses a questions.md file and returns an array of questions
 */
function loadQuestionsFromFile(filePath: string): Question[] {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const questions: Question[] = [];

  // Split by question blocks (## Frage)
  const questionBlocks = fileContent.split(/##\s+Frage\s+\d+/);

  questionBlocks.forEach((block, index) => {
    if (index === 0) return; // Skip the header

    // Extract question
    const questionMatch = block.match(/\*\*Frage:\*\*\s*(.+)/);
    if (!questionMatch) return;

    // Extract options
    const optionsMatch = block.match(/\*\*Optionen:\*\*\s*([\s\S]*?)\*\*Antwort:/);
    if (!optionsMatch) return;

    const optionsText = optionsMatch[1];
    const options = optionsText
      .split('\n')
      .filter((line) => line.trim().startsWith('-'))
      .map((line) => line.replace(/^-\s*/, '').trim());

    // Extract answer
    const answerMatch = block.match(/\*\*Antwort:\*\*\s*(.+)/);
    if (!answerMatch) return;

    // Extract category (optional)
    const categoryMatch = block.match(/\*\*Kategorie:\*\*\s*(.+)/);

    questions.push({
      id: index,
      question: questionMatch[1].trim(),
      options: options,
      answer: answerMatch[1].trim(),
      category: categoryMatch ? categoryMatch[1].trim() : undefined,
    });
  });

  return questions;
}

/**
 * Shuffles an array
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
