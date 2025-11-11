
export enum Subject {
  Math = 'Math',
  Reading = 'Reading & Writing'
}

export enum QuizState {
  Idle = 'IDLE',
  LoadingQuestion = 'LOADING_QUESTION',
  Answering = 'ANSWERING',
  LoadingFeedback = 'LOADING_FEEDBACK',
  DisplayingFeedback = 'DISPLAYING_FEEDBACK'
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface Feedback {
  isCorrect: boolean;
  explanation: string;
  improvementTips: string;
}
