
import { GoogleGenAI, Type } from "@google/genai";
import { Subject, QuizQuestion } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const questionSchema = {
  type: Type.OBJECT,
  properties: {
    question: {
      type: Type.STRING,
      description: "The main text of the SAT-style question."
    },
    options: {
      type: Type.ARRAY,
      description: "An array of 4 strings representing the multiple-choice options (A, B, C, D).",
      items: { type: Type.STRING }
    },
    correctAnswer: {
      type: Type.STRING,
      description: "The letter of the correct answer (e.g., 'B')."
    },
    explanation: {
      type: Type.STRING,
      description: "A detailed explanation of why the correct answer is right and the others are wrong."
    }
  },
  required: ["question", "options", "correctAnswer", "explanation"]
};

export const generateQuizQuestion = async (subject: Subject): Promise<QuizQuestion> => {
  const prompt = `Generate one SAT-style multiple-choice question for the ${subject} section. The question should be challenging and representative of the real test. Provide 4 options labeled A, B, C, and D. Also provide the correct answer and a detailed explanation.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: questionSchema,
        temperature: 1,
      },
    });

    const jsonString = response.text.trim();
    const parsed = JSON.parse(jsonString);

    // Basic validation
    if (!parsed.question || !Array.isArray(parsed.options) || parsed.options.length !== 4 || !parsed.correctAnswer || !parsed.explanation) {
        throw new Error("Invalid question format received from API.");
    }
    
    // Ensure options are formatted like "A. ...", "B. ..."
    const formattedOptions = parsed.options.map((opt: string, index: number) => {
        const letter = String.fromCharCode(65 + index); // A, B, C, D
        if (opt.trim().startsWith(`${letter}.`)) {
            return opt.trim();
        }
        return `${letter}. ${opt.trim()}`;
    });
    
    const correctAnswerLetter = parsed.correctAnswer.charAt(0).toUpperCase();

    return {
        ...parsed,
        options: formattedOptions,
        correctAnswer: correctAnswerLetter
    };

  } catch (error) {
    console.error("Error generating quiz question:", error);
    throw new Error("Failed to generate a quiz question. Please try again.");
  }
};

export const getImprovementTips = async (subject: Subject, question: string, userAnswer: string, correctAnswer: string): Promise<string> => {
    const prompt = `
      As an expert SAT tutor, a student is practicing for the ${subject} section and made a mistake.
      
      Question: "${question}"
      Their incorrect answer was: "${userAnswer}"
      The correct answer was: "${correctAnswer}"

      Please provide specific, actionable advice on what concepts the student should review to avoid this type of mistake in the future. Keep the advice concise, encouraging, and focused on 1-2 key concepts. Start with a phrase like "To improve on questions like this...".
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error getting improvement tips:", error);
        return "Could not load improvement tips. Make sure to review the explanation carefully to understand the correct answer.";
    }
};
