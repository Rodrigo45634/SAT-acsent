
import React from 'react';
import { Feedback } from '../types';
import { CheckIcon, XMarkIcon, BrainIcon } from './icons';

interface FeedbackCardProps {
  feedback: Feedback;
  onNextQuestion: () => void;
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({ feedback, onNextQuestion }) => {
  const { isCorrect, explanation, improvementTips } = feedback;

  return (
    <div className={`p-6 md:p-8 rounded-xl shadow-lg w-full animate-fade-in ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
      <div className="flex items-center mb-4">
        {isCorrect ? (
          <CheckIcon className="w-10 h-10 text-green-600 mr-4" />
        ) : (
          <XMarkIcon className="w-10 h-10 text-red-600 mr-4" />
        )}
        <h2 className={`text-2xl font-bold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
          {isCorrect ? 'Correct!' : 'Not Quite'}
        </h2>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Explanation</h3>
          <p className="text-gray-700 leading-relaxed">{explanation}</p>
        </div>

        {!isCorrect && (
          <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded-r-lg">
            <div className="flex items-start">
              <BrainIcon className="w-6 h-6 text-yellow-700 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-lg font-semibold text-yellow-800 mb-1">How to Improve</h4>
                <p className="text-yellow-900">{improvementTips}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={onNextQuestion}
        className="mt-8 w-full py-3 px-6 bg-gray-800 text-white font-bold rounded-lg shadow-md hover:bg-black transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-gray-400"
      >
        Next Question
      </button>
    </div>
  );
};

export default FeedbackCard;
