
import React from 'react';

interface ScoreboardProps {
  correct: number;
  incorrect: number;
  subject: string | null;
  onReset: () => void;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ correct, incorrect, subject, onReset }) => {
  return (
    <div className="w-full flex justify-between items-center bg-white p-4 rounded-lg shadow-md mb-6">
      <div>
        <h2 className="text-xl font-bold text-blue-600">{subject} Practice</h2>
        <div className="flex items-center gap-6 mt-2">
            <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{correct}</p>
                <p className="text-sm text-gray-500">Correct</p>
            </div>
            <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{incorrect}</p>
                <p className="text-sm text-gray-500">Incorrect</p>
            </div>
        </div>
      </div>
      <button 
        onClick={onReset}
        className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors duration-200">
        Change Subject
      </button>
    </div>
  );
};

export default Scoreboard;
