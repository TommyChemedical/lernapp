import { NextResponse } from 'next/server';
import { getSubjects } from '@/lib/questions';

export async function GET() {
  try {
    const subjects = getSubjects();
    return NextResponse.json(subjects);
  } catch (error) {
    console.error('Error loading subjects:', error);
    return NextResponse.json(
      { error: 'Failed to load subjects' },
      { status: 500 }
    );
  }
}
