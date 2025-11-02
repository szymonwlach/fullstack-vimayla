export interface UserData {
  id: string;
  name: string;
  email: string;
}
export interface WholeUserData {
  id: string;
  name: string;
  email: string;
  trial: string;
  created_at: string;
  credits: number;
}
export interface FormData {
  pathName: string;
  startLevel: string;
  achieve: string;
  learningTime: string;
  preferredStyle: "quiz" | "flashcards" | "writing" | "mixed";
  topics?: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface SupportQuestion {
  id: number;
  question: string;
  placeholder: string;
}

export interface SupportAnswers {
  [key: number]: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface Exercise {
  title: string;
  description: string;
  type: "practical" | "writing" | "research";
}

export interface LearningTopic {
  id: number;
  title: string;
  description: string;
  estimatedTime: string;
  keyConcepts: string[];
  quiz: QuizQuestion[];
  flashcards: Flashcard[];
  exercises: Exercise[];
}

export interface LearningPath {
  pathTitle: string;
  pathDescription: string;
  estimatedDuration: string;
  topics: LearningTopic[];
}

export interface AnalysisResult {
  needsMoreInfo: boolean;
  reasoning?: string;
  supportQuestions?: SupportQuestion[];
}

export interface ApiResponse {
  needsMoreInfo: boolean;
  supportQuestions?: SupportQuestion[];
  learningPath?: LearningPath;
  error?: string;
}
export type LearningPathName = {
  learningPathsTitle: string;
  ai_description: string;
  estimed_time: string;
  startLevel: string;
};

export interface AI_descriptions {
  ai_description: string;
  estimed_time: string;
}
