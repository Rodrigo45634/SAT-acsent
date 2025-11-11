
import React from 'react';
import { Subject } from '../types';
import { CalculatorIcon, BookOpenIcon } from './icons';

interface SubjectSelectorProps {
  onSelect: (subject: Subject) => void;
}

const SubjectCard: React.FC<{ subject: Subject, icon: React.ReactNode, onClick: () => void }> = ({ subject, icon, onClick }) => (
    <button
      onClick={onClick}
      className="group w-full md:w-64 p-8 flex flex-col items-center justify-center bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 ease-in-out border-2 border-transparent hover:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-300"
    >
      <div className="w-16 h-16 mb-4 text-blue-500 transition-colors duration-300">{icon}</div>
      <h3 className="text-2xl font-bold text-gray-800">{subject}</h3>
      <p className="mt-2 text-gray-500">Start Quiz</p>
    </button>
);


const SubjectSelector: React.FC<SubjectSelectorProps> = ({ onSelect }) => {
  return (
    <div className="text-center">
      <h2 className="text-4xl font-extrabold text-gray-800 mb-4">Welcome to SAT Genius!</h2>
      <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">Choose a subject to start your personalized AI-powered practice session.</p>
      <div className="flex flex-col md:flex-row gap-8 justify-center">
        <SubjectCard 
            subject={Subject.Math} 
            icon={<CalculatorIcon />} 
            onClick={() => onSelect(Subject.Math)} 
        />
        <SubjectCard 
            subject={Subject.Reading} 
            icon={<BookOpenIcon />} 
            onClick={() => onSelect(Subject.Reading)} 
        />
      </div>
    </div>
  );
};

export default SubjectSelector;
