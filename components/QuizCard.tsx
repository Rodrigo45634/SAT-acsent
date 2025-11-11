
import React from 'react';
import { QuizQuestion } from '../types';

interface QuizCardProps {
  question: QuizQuestion;
  selectedAnswer: string | null;
  onSelectAnswer: (answer: string) => void;
  onSubmit: () => void;
  isAnswered: boolean;
}

const QuizCard: React.FC<QuizCardProps> = ({ question, selectedAnswer, onSelectAnswer, onSubmit, isAnswered }) => {

  const getOptionClass = (option: string) => {
    const letter = option.substring(0, 1);
    let baseClass = "w-full text-left p-4 my-2 rounded-lg border-2 transition-all duration-200 cursor-pointer text-gray-700";
    if (isAnswered) {
      baseClass += " cursor-not-allowed";
      if (letter === question.correctAnswer) {
        return `${baseClass} bg-green-100 border-green-500 font-bold`;
      }
      if (letter === selectedAnswer && letter !== question.correctAnswer) {
        return `${baseClass} bg-red-100 border-red-500`;
      }
      return `${baseClass} bg-gray-100 border-gray-300`;
    }
    
    if (letter === selectedAnswer) {
      return `${baseClass} bg-blue-100 border-blue-500 ring-2 ring-blue-300`;
    }
    return `${baseClass} bg-white border-gray-300 hover:bg-blue-50 hover:border-blue-400`;
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg w-full">
      <p className="text-lg md:text-xl font-medium text-gray-800 leading-relaxed mb-6">{question.question}</p>
      <div>
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onSelectAnswer(option.substring(0, 1))}
            className={getOptionClass(option)}
            disabled={isAnswered}
          >
            {option}
          </button>
        ))}
      </div>
      <button
        onClick={onSubmit}
        disabled={!selectedAnswer || isAnswered}
        className="mt-6 w-full py-3 px-6 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
      >
        Submit Answer
      </button>
    </div>
  );
};

export default QuizCard;
