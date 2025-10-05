import { NextRequest, NextResponse } from 'next/server';
import { loadQuestionsBySubject, shuffleArray } from '@/lib/questions';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const subject = searchParams.get('subject');

    if (!subject) {
      return NextResponse.json(
        { error: 'Subject parameter is required' },
        { status: 400 }
      );
    }

    const questions = loadQuestionsBySubject(subject);
    const shuffledQuestions = shuffleArray(questions);

    // Limit to 5 random questions
    const limitedQuestions = shuffledQuestions.slice(0, 5);

    // Shuffle answer options for each question
    const questionsWithShuffledOptions = limitedQuestions.map((q) => ({
      ...q,
      options: shuffleArray(q.options),
    }));

    return NextResponse.json(questionsWithShuffledOptions);
  } catch (error) {
    console.error('Error loading questions:', error);
    return NextResponse.json(
      { error: 'Failed to load questions' },
      { status: 500 }
    );
  }
}
