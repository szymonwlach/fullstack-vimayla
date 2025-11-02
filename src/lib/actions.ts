import { db } from "@/db";
import {
  InsertProgress,
  learningPaths,
  LearningPathStructure,
  ProfileFormData,
  progress,
  supportPrompts,
  tasks,
  topics,
  users,
} from "@/db/schema";
import { AI_descriptions, UserData } from "@/types";
import { and, desc, eq } from "drizzle-orm";

export const addUser = async (user_data: UserData) => {
  try {
    await db.insert(users).values({
      id: user_data.id,
      name: user_data.name,
      email: user_data.email,
    });
  } catch (error) {
    console.log("error while adding a user");
  }
};

export const getUserData = async (userId: string) => {
  try {
    const userData = await db.select().from(users).where(eq(users.id, userId));

    return userData.length > 0 ? userData[0] : null;
  } catch (error) {
    console.log("error while getting user's data");
    return null;
  }
};

export const deleteUserClerk = async (userId: string) => {
  await db.delete(users).where(eq(users.id, userId));
};

export const getUserById = async (userId: string) => {
  try {
    const user = await db.select().from(users).where(eq(users.id, userId));
    return user[0];
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
};

export const updateUserCredits = async (userId: string, credits: number) => {
  try {
    await db.update(users).set({ credits }).where(eq(users.id, userId));
  } catch (error) {
    console.error("Error updating user credits:", error);
    throw error;
  }
};

export const markFreePathUsed = async (userId: string) => {
  try {
    await db
      .update(users)
      .set({ hasFreePath: true })
      .where(eq(users.id, userId));
  } catch (error) {
    console.error("Error marking free path used:", error);
    throw error;
  }
};

// === LEARNING PATH ACTIONS ===
export const createLearningPath = async (
  userId: string,
  formData: ProfileFormData,
  aiGeneratedPath: LearningPathStructure,
  ai_descriptions: AI_descriptions
) => {
  try {
    // Create the learning path
    const [newPath] = await db
      .insert(learningPaths)
      .values({
        title: formData.pathName,
        description: formData.achieve,
        userId,
        formData,
        startLevel: formData.startLevel,
        achieve: formData.achieve,
        learningTime: formData.learningTime,
        preferredStyle: formData.preferredStyle,
        difficulty: formData.difficulty,
        estimated_time: ai_descriptions.estimed_time,
        ai_description: ai_descriptions.ai_description,
      })
      .returning();

    // Create topics and tasks based on AI response
    for (const week of aiGeneratedPath.weeks) {
      for (let topicIndex = 0; topicIndex < week.topics.length; topicIndex++) {
        const topicData = week.topics[topicIndex];

        // Create topic
        const [newTopic] = await db
          .insert(topics)
          .values({
            pathId: newPath.id,
            title: topicData.title,
            description: topicData.description,
            weekNumber: week.weekNumber,
            order: topicIndex + 1,
            isUnlocked: week.weekNumber === 1 && topicIndex === 0, // First topic is unlocked
            theory: topicData.theory,
          })
          .returning();

        // Create tasks for this topic
        for (
          let taskIndex = 0;
          taskIndex < topicData.tasks.length;
          taskIndex++
        ) {
          const taskData = topicData.tasks[taskIndex];

          await db.insert(tasks).values({
            topicId: newTopic.id,
            question: taskData.question,
            taskData: taskData.taskData,
            type: taskData.type,
            order: taskIndex + 1,
            points: taskData.points,
          });
        }
      }
    }

    return newPath;
  } catch (error) {
    console.error("Error creating learning path:", error);
    throw error;
  }
};

export const getUserLearningPaths = async (userId: string) => {
  try {
    const paths = await db
      .select()
      .from(learningPaths)
      .where(eq(learningPaths.userId, userId))
      .orderBy(desc(learningPaths.createdAt));
    return paths;
  } catch (error) {
    console.error("Error getting user learning paths:", error);
    throw error;
  }
};

export const getLearningPathWithTopics = async (pathId: number) => {
  try {
    const path = await db
      .select()
      .from(learningPaths)
      .where(eq(learningPaths.id, pathId));
    const pathTopics = await db
      .select()
      .from(topics)
      .where(eq(topics.pathId, pathId));

    return {
      path: path[0],
      topics: pathTopics,
    };
  } catch (error) {
    console.error("Error getting learning path with topics:", error);
    throw error;
  }
};

export const getPathsName = async (userId: string) => {
  try {
    const allPaths = await db
      .select({ learningPathsTitle: learningPaths.title })
      .from(learningPaths)
      .where(eq(learningPaths.userId, userId));

    return allPaths;
  } catch (error) {
    console.error("Error getting all learning path with topics:", error);
    throw error;
  }
};

// === TOPIC ACTIONS ===
export const getTopicWithTasks = async (topicId: number) => {
  try {
    const topic = await db.select().from(topics).where(eq(topics.id, topicId));
    const topicTasks = await db
      .select()
      .from(tasks)
      .where(eq(tasks.topicId, topicId));

    return {
      topic: topic[0],
      tasks: topicTasks,
    };
  } catch (error) {
    console.error("Error getting topic with tasks:", error);
    throw error;
  }
};

export const unlockNextTopic = async (currentTopicId: number) => {
  try {
    const currentTopic = await db
      .select()
      .from(topics)
      .where(eq(topics.id, currentTopicId));
    if (!currentTopic[0]) return;

    // Find next topic to unlock
    const nextTopics = await db
      .select()
      .from(topics)
      .where(
        and(
          eq(topics.pathId, currentTopic[0].pathId),
          eq(topics.isUnlocked, false)
        )
      );

    if (nextTopics.length > 0) {
      // Sort by week and order to find the next logical topic
      const sortedTopics = nextTopics.sort((a, b) => {
        if (a.weekNumber !== b.weekNumber) {
          return a.weekNumber - b.weekNumber;
        }
        return a.order - b.order;
      });

      // Unlock the next topic
      await db
        .update(topics)
        .set({ isUnlocked: true })
        .where(eq(topics.id, sortedTopics[0].id));
    }
  } catch (error) {
    console.error("Error unlocking next topic:", error);
    throw error;
  }
};

// === TASK ACTIONS ===
export const getTaskById = async (taskId: number) => {
  try {
    const task = await db.select().from(tasks).where(eq(tasks.id, taskId));
    return task[0];
  } catch (error) {
    console.error("Error getting task:", error);
    throw error;
  }
};

// === PROGRESS ACTIONS ===
export const recordProgress = async (progressData: InsertProgress) => {
  try {
    await db.insert(progress).values(progressData);

    // Check if all tasks in topic are completed
    const allTasksInTopic = await db
      .select()
      .from(tasks)
      .where(eq(tasks.topicId, progressData.topicId));

    const completedTasks = await db
      .select()
      .from(progress)
      .where(
        and(
          eq(progress.userId, progressData.userId),
          eq(progress.topicId, progressData.topicId),
          eq(progress.completed, true)
        )
      );

    // If all tasks completed, unlock next topic
    if (completedTasks.length === allTasksInTopic.length) {
      await unlockNextTopic(progressData.topicId);
    }
  } catch (error) {
    console.error("Error recording progress:", error);
    throw error;
  }
};

export const getUserProgress = async (userId: string, pathId: number) => {
  try {
    const userProgress = await db
      .select()
      .from(progress)
      .where(and(eq(progress.userId, userId), eq(progress.pathId, pathId)));
    return userProgress;
  } catch (error) {
    console.error("Error getting user progress:", error);
    throw error;
  }
};

export const getTaskProgress = async (userId: string, taskId: number) => {
  try {
    const taskProgress = await db
      .select()
      .from(progress)
      .where(and(eq(progress.userId, userId), eq(progress.taskId, taskId)));
    return taskProgress[0];
  } catch (error) {
    console.error("Error getting task progress:", error);
    throw error;
  }
};

// === SUPPORT PROMPT ACTIONS ===
export const saveSupportPrompts = async (
  pathId: number,
  questions: string[],
  answers: string[]
) => {
  try {
    const promptData = questions.map((question, index) => ({
      pathId,
      question,
      answer: answers[index] || "",
      order: index + 1,
    }));

    await db.insert(supportPrompts).values(promptData);
  } catch (error) {
    console.error("Error saving support prompts:", error);
    throw error;
  }
};

// === UTILITY FUNCTIONS ===
export const calculatePathProgress = (
  totalTasks: number,
  completedTasks: number
): number => {
  if (totalTasks === 0) return 0;
  return Math.round((completedTasks / totalTasks) * 100);
};

export const calculateUserScore = (progressRecords: any[]): number => {
  if (progressRecords.length === 0) return 0;
  const totalScore = progressRecords.reduce(
    (sum, record) => sum + (record.score || 0),
    0
  );
  return Math.round(totalScore / progressRecords.length);
};
