
import React, { useState, useEffect, useCallback } from 'react';
import { Subject, QuizState, QuizQuestion, Feedback } from './types';
import { generateQuizQuestion, getImprovementTips } from './services/geminiService';
import SubjectSelector from './components/SubjectSelector';
import QuizCard from './components/QuizCard';
import FeedbackCard from './components/FeedbackCard';
import Scoreboard from './components/Scoreboard';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
  const [subject, setSubject] = useState<Subject | null>(null);
  const [quizState, setQuizState] = useState<QuizState>(QuizState.Idle);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [score, setScore] = useState<{ correct: number, incorrect: number }>({ correct: 0, incorrect: 0 });
  const [error, setError] = useState<string | null>(null);

  const fetchNewQuestion = useCallback(async () => {
    if (!subject) return;

    setQuizState(QuizState.LoadingQuestion);
    setSelectedAnswer(null);
    setFeedback(null);
    setError(null);

    try {
      const question = await generateQuizQuestion(subject);
      setCurrentQuestion(question);
      setQuizState(QuizState.Answering);
    } catch (err) {
      setError("Sorry, we couldn't generate a question. Please try again.");
      setQuizState(QuizState.Idle);
      setSubject(null);
    }
  }, [subject]);

  useEffect(() => {
    if (subject && quizState === QuizState.Idle) {
      fetchNewQuestion();
    }
  }, [subject, quizState, fetchNewQuestion]);

  const handleSelectSubject = (selectedSubject: Subject) => {
    setSubject(selectedSubject);
    setScore({ correct: 0, incorrect: 0 });
    setQuizState(QuizState.Idle);
  };

  const handleReset = () => {
    setSubject(null);
    setCurrentQuestion(null);
    setFeedback(null);
    setQuizState(QuizState.Idle);
    setError(null);
  };

  const handleSubmitAnswer = async () => {
    if (!currentQuestion || !selectedAnswer) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setScore(prev => ({ ...prev, correct: prev.correct + 1 }));
      setFeedback({
        isCorrect: true,
        explanation: currentQuestion.explanation,
        improvementTips: "Great job! You've mastered this concept.",
      });
      setQuizState(QuizState.DisplayingFeedback);
    } else {
      setQuizState(QuizState.LoadingFeedback);
      setScore(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
      const tips = await getImprovementTips(subject!, currentQuestion.question, selectedAnswer, currentQuestion.correctAnswer);
      setFeedback({
        isCorrect: false,
        explanation: currentQuestion.explanation,
        improvementTips: tips,
      });
      setQuizState(QuizState.DisplayingFeedback);
    }
  };

  const renderContent = () => {
    if (error) {
      return <div className="text-center p-8 bg-red-100 border border-red-400 text-red-700 rounded-lg">{error}</div>;
    }
    
    if (!subject) {
      return <SubjectSelector onSelect={handleSelectSubject} />;
    }

    if (quizState === QuizState.LoadingQuestion) {
      return <LoadingSpinner message="Generating your next question..." />;
    }
    
    if (currentQuestion) {
        return (
            <div className="w-full flex flex-col lg:flex-row gap-8 items-start">
                <div className="w-full lg:w-1/2">
                    <QuizCard 
                        question={currentQuestion} 
                        selectedAnswer={selectedAnswer}
                        onSelectAnswer={setSelectedAnswer}
                        onSubmit={handleSubmitAnswer}
                        isAnswered={quizState === QuizState.DisplayingFeedback || quizState === QuizState.LoadingFeedback}
                    />
                </div>
                <div className="w-full lg:w-1/2 sticky top-8">
                   {quizState === QuizState.LoadingFeedback && <LoadingSpinner message="Analyzing your answer..." />}
                   {quizState === QuizState.DisplayingFeedback && feedback && (
                       <FeedbackCard feedback={feedback} onNextQuestion={fetchNewQuestion} />
                   )}
                </div>
            </div>
        )
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans p-4 sm:p-6 md:p-8">
      <header className="max-w-7xl mx-auto mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          SAT<span className="text-blue-600"> Genius</span>
        </h1>
      </header>
      <main className="max-w-7xl mx-auto flex flex-col items-center justify-center">
        {subject && <Scoreboard correct={score.correct} incorrect={score.incorrect} subject={subject} onReset={handleReset} />}
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
