'use client';

import { useState, useEffect } from 'react';

interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string;
  category?: string;
}

interface Subject {
  name: string;
  displayName: string;
  questionsCount: number;
}

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [displayedSubjects, setDisplayedSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  // Load subjects on mount
  useEffect(() => {
    fetch('/api/subjects')
      .then((res) => res.json())
      .then((data) => {
        setSubjects(data);
      })
      .catch((err) => console.error('Error loading subjects:', err));
  }, []);

  // Timer
  useEffect(() => {
    if (!gameStarted || isAnswered || gameOver) return;

    if (timeLeft === 0) {
      handleTimeout();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, gameStarted, isAnswered, gameOver]);

  const handleTimeout = () => {
    setIsAnswered(true);
    setTimeout(() => {
      nextQuestion();
    }, 2000);
  };

  const handleAnswerClick = (answer: string) => {
    if (isAnswered) return;

    setSelectedAnswer(answer);
    setIsAnswered(true);

    if (answer === questions[currentQuestionIndex].answer) {
      setScore(score + 1);
    }

    setTimeout(() => {
      nextQuestion();
    }, 2000);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setTimeLeft(20);
    } else {
      setGameOver(true);
    }
  };

  const handleSubjectSelect = (subjectName: string) => {
    setSelectedSubject(subjectName);
    // Load questions for selected subject
    fetch(`/api/questions?subject=${subjectName}`)
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data);
        setGameStarted(true);
        setCurrentQuestionIndex(0);
        setScore(0);
        setSelectedAnswer(null);
        setIsAnswered(false);
        setTimeLeft(20);
        setGameOver(false);
      })
      .catch((err) => console.error('Error loading questions:', err));
  };

  const startCardSelection = () => {
    setShowWelcome(false);
    const shuffled = [...subjects].sort(() => 0.5 - Math.random());
    setDisplayedSubjects(shuffled.slice(0, 3));
  };

  const handleCardClick = (index: number) => {
    if (flippedCards.includes(index)) return;

    setSelectedCard(index);
    setFlippedCards([...flippedCards, index]);

    // Start game after card flip animation
    setTimeout(() => {
      handleSubjectSelect(displayedSubjects[index].name);
    }, 600);
  };

  const restartGame = () => {
    setSelectedSubject(null);
    setGameStarted(false);
    setGameOver(false);
    setShowWelcome(false);
    setFlippedCards([]);
    setSelectedCard(null);
    startCardSelection();
  };

  // Welcome screen
  if (showWelcome) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: '#FAF9F6' }}>
        <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-8">🎮</h1>
          <button
            onClick={startCardSelection}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-6 rounded-xl text-2xl font-bold hover:scale-105 transition-transform shadow-lg"
          >
            Spiel starten
          </button>
        </div>
      </div>
    );
  }

  // Card selection screen
  if (!selectedSubject && !gameStarted) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4" style={{ backgroundColor: '#FAF9F6' }}>
        <div className="max-w-4xl w-full text-center">
          {displayedSubjects.length === 0 ? (
            <div className="text-gray-500">Lade Themen...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {displayedSubjects.map((subject, index) => (
                <div
                  key={subject.name}
                  className="card-flip-container perspective-1000 cursor-pointer"
                  onClick={() => handleCardClick(index)}
                >
                  <div
                    className={`card-flip-inner ${flippedCards.includes(index) ? 'flipped' : ''}`}
                    style={{
                      width: '100%',
                      height: '250px',
                      position: 'relative',
                      transformStyle: 'preserve-3d',
                      transition: 'transform 0.6s',
                    }}
                  >
                    {/* Card Back (initial state) */}
                    <div
                      className="card-face card-back"
                      style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '16px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                      }}
                    >
                      <div className="text-6xl">?</div>
                    </div>

                    {/* Card Front (revealed) */}
                    <div
                      className="card-face card-front"
                      style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'white',
                        borderRadius: '16px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                        padding: '20px',
                      }}
                    >
                      <div className="text-2xl font-bold text-gray-800 break-words">
                        {subject.displayName}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: '#FAF9F6' }}>
        <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Quiz beendet!</h1>
          <div className="text-6xl font-bold text-purple-600 mb-6">
            {score}/{questions.length}
          </div>
          <p className="text-gray-600 mb-8">
            Du hast {score} von {questions.length} Fragen richtig beantwortet!
          </p>
          <button
            onClick={restartGame}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl text-xl font-semibold hover:scale-105 transition-transform shadow-lg"
          >
            Nochmal spielen
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  // Safety check
  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-pink-500">
        <div className="text-white text-2xl">Lade...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4" style={{ backgroundColor: '#FAF9F6' }}>
      <div className="max-w-4xl mx-auto pt-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 text-gray-800">
          <div className="text-xl font-semibold">
            Frage {currentQuestionIndex + 1}/{questions.length}
          </div>
          <div className="text-xl font-semibold">Score: {score}</div>
        </div>

        {/* Timer */}
        <div className="mb-8">
          <div className="bg-gray-300 rounded-full h-4 overflow-hidden">
            <div
              className={`h-full ${
                timeLeft > 10 ? 'bg-green-500' : timeLeft > 5 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{
                width: `${(timeLeft / 20) * 100}%`,
                transition: 'width 1s linear'
              }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          {currentQuestion.category && (
            <div className="inline-block bg-purple-100 text-purple-700 px-4 py-1 rounded-full text-sm font-semibold mb-4">
              {currentQuestion.category}
            </div>
          )}
          <h2 className="text-2xl font-bold text-gray-800 mb-8">{currentQuestion.question}</h2>

          {/* Answer Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion.options.map((option, index) => {
              let bgColor = 'bg-gray-100 hover:bg-gray-200 text-gray-800';

              if (isAnswered) {
                if (option === currentQuestion.answer) {
                  bgColor = 'bg-green-500 text-white';
                } else if (option === selectedAnswer && option !== currentQuestion.answer) {
                  bgColor = 'bg-red-500 text-white';
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerClick(option)}
                  disabled={isAnswered}
                  className={`${bgColor} p-6 rounded-xl text-center font-semibold text-lg transition-all transform hover:scale-105 disabled:hover:scale-100 shadow-md`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
