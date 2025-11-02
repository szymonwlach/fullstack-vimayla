import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

// === USERS ===
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  trial: text("trial").default("free"),
  credits: integer("credits").notNull().default(1),
  hasFreePath: boolean("has_free_path").default(false), // Track if user used free path
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// === LEARNING PATHS (renamed from roads) ===
export const learningPaths = pgTable("learning_paths", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  ai_description: text("ai_description"),
  estimated_time: text("estimated_time"),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  // Store the original form data for reference
  formData: jsonb("form_data"), // Store the original ProfileFormData
  // Path configuration
  startLevel: text("start_level").notNull(),
  achieve: text("achieve").notNull(),
  learningTime: text("learning_time").notNull(),
  preferredStyle: text("preferred_style").notNull(), // quiz, flashcards, writing, mixed
  difficulty: text("difficulty").notNull(), // easy, medium, hard
  // Status
  isActive: boolean("is_active").default(true),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// === TOPICS (weeks/sections in the learning path) ===
export const topics = pgTable("topics", {
  id: serial("id").primaryKey(),
  pathId: integer("path_id")
    .notNull()
    .references(() => learningPaths.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  weekNumber: integer("week_number").notNull(), // Which week this topic belongs to
  order: integer("order").notNull(), // Order within the week
  theory: jsonb("theory").notNull(),
  isUnlocked: boolean("is_unlocked").default(false), // Gamification
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// === TASKS (quizzes, flashcards, etc.) ===
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  topicId: integer("topic_id")
    .notNull()
    .references(() => topics.id, { onDelete: "cascade" }),
  question: text("question").notNull(),
  // Store task data as JSON for flexibility
  taskData: jsonb("task_data").notNull(), // Contains answers, options, etc.
  type: text("type").notNull(), // 'multiple_choice', 'flashcard', 'quiz', 'writing'
  order: integer("order").notNull(),
  points: integer("points").default(10), // Points for completing this task
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// === USER PROGRESS ===
export const progress = pgTable("progress", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  pathId: integer("path_id")
    .notNull()
    .references(() => learningPaths.id, { onDelete: "cascade" }),
  topicId: integer("topic_id")
    .notNull()
    .references(() => topics.id, { onDelete: "cascade" }),
  taskId: integer("task_id")
    .notNull()
    .references(() => tasks.id, { onDelete: "cascade" }),
  completed: boolean("completed").notNull().default(false),
  score: integer("score"), // 0-100
  attempts: integer("attempts").default(1),
  // Store user's answer for review
  userAnswer: jsonb("user_answer"),
  completedAt: timestamp("completed_at").defaultNow(),
});

// === SUPPORT PROMPTS (for dynamic topic generation) ===
export const supportPrompts = pgTable("support_prompts", {
  id: serial("id").primaryKey(),
  pathId: integer("path_id")
    .notNull()
    .references(() => learningPaths.id, { onDelete: "cascade" }),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  order: integer("order").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// === TYPES ===
export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;

export type InsertLearningPath = typeof learningPaths.$inferInsert;
export type SelectLearningPath = typeof learningPaths.$inferSelect;

export type InsertTopic = typeof topics.$inferInsert;
export type SelectTopic = typeof topics.$inferSelect;

export type InsertTask = typeof tasks.$inferInsert;
export type SelectTask = typeof tasks.$inferSelect;

export type InsertProgress = typeof progress.$inferInsert;
export type SelectProgress = typeof progress.$inferSelect;

export type InsertSupportPrompt = typeof supportPrompts.$inferInsert;
export type SelectSupportPrompt = typeof supportPrompts.$inferSelect;

// === ADDITIONAL TYPES FOR YOUR APP ===
export interface ProfileFormData {
  pathName: string;
  startLevel: string;
  achieve: string;
  learningTime: string;
  preferredStyle: "quiz" | "flashcards" | "writing" | "mixed";
  topics?: string;
  difficulty: "easy" | "medium" | "hard";
  supportAnswers?: string[];
  isFollowUp?: boolean;
}

export interface TaskData {
  // For multiple choice
  options?: string[];
  correctAnswer?: string | number;
  explanation?: string;

  // For flashcards
  frontText?: string;
  backText?: string;
  theory: string[];
  // For writing tasks
  expectedAnswer?: string;
  keywords?: string[];

  // For quiz
  choices?: { text: string; isCorrect: boolean }[];
}

export interface LearningPathStructure {
  weeks: {
    weekNumber: number;
    title: string;
    description: string;
    topics: {
      title: string;
      description: string;
      theory: string[];
      tasks: {
        type: string;
        question: string;
        taskData: TaskData;
        points: number;
      }[];
    }[];
  }[];
}
