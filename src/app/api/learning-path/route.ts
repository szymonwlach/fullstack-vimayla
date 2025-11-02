import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { auth } from "@clerk/nextjs/server";
import {
  createLearningPath,
  getUserById,
  markFreePathUsed,
  saveSupportPrompts,
} from "@/lib/actions";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ProfileFormData {
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

interface SupportQuestionResponse {
  needsSupport: boolean;
  questions?: string[];
  learningPath?: any;
  message?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data: ProfileFormData = await req.json();

    // Check if user has already used their free path
    const user = await getUserById(userId);
    if (user?.hasFreePath && user.credits <= 0) {
      return NextResponse.json(
        {
          error:
            "You have already used your free learning path. Please upgrade to create more paths.",
        },
        { status: 403 }
      );
    }
    const aiDescriptions = await generateAdditionalData(
      data.pathName,
      data.learningTime,
      data.achieve
    );
    // If this is a follow-up request with support answers, generate the learning path
    if (data.isFollowUp && data.supportAnswers) {
      const learningPath = await generateLearningPathWithSupport(data);

      // Save to database
      const createdPath = await createLearningPath(
        userId,
        data,
        learningPath,
        aiDescriptions
      );

      // Save support prompts for future reference
      if (data.supportAnswers) {
        // We need to get the questions from the previous request
        // For simplicity, we'll generate them again or store them in the session
        const supportQuestions = await generateSupportQuestions(data);
        if (supportQuestions.questions) {
          await saveSupportPrompts(
            createdPath.id,
            supportQuestions.questions,
            data.supportAnswers
          );
        }
      }

      // Mark free path as used if it's their first one
      if (!user?.hasFreePath) {
        await markFreePathUsed(userId);
      }

      return NextResponse.json({
        needsSupport: false,
        learningPath: createdPath,
        message:
          "Your personalized learning path has been created successfully!",
      });
    }

    // Initial request - check if user needs support for topics
    const supportResponse = await checkIfSupportNeeded(data);

    if (supportResponse.needsSupport) {
      return NextResponse.json(supportResponse);
    } else {
      // User provided enough information, generate learning path directly
      const learningPath = await generateLearningPath(data);

      // Save to database
      const createdPath = await createLearningPath(
        userId,
        data,
        learningPath,
        aiDescriptions
      );

      // Mark free path as used if it's their first one
      if (!user?.hasFreePath) {
        await markFreePathUsed(userId);
      }

      return NextResponse.json({
        needsSupport: false,
        learningPath: createdPath,
        message: "Perfect! Your learning path has been created successfully!",
      });
    }
  } catch (error) {
    console.error("Error in API learning-path:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

async function checkIfSupportNeeded(
  data: ProfileFormData
): Promise<SupportQuestionResponse> {
  const supportQuestions = await generateSupportQuestions(data);
  return supportQuestions;
}

async function generateSupportQuestions(
  data: ProfileFormData
): Promise<SupportQuestionResponse> {
  const prompt = `
Analyze this learning request to determine if the user needs help defining specific topics to focus on:

Path: ${data.pathName}
Current Level: ${data.startLevel}
Goal: ${data.achieve}
Learning Time: ${data.learningTime}
Preferred Style: ${data.preferredStyle}
Topics: ${data.topics || "Not specified"}
Difficulty: ${data.difficulty}

Rules for analysis:
1. If topics are clearly specified and relevant to the learning path, return needsSupport: false
2. If topics are empty, vague, or don't match the learning goal, return needsSupport: true
3. If the learning path is very broad or general, return needsSupport: true
4. If the user provided specific, relevant topics, return needsSupport: false

If support is needed, generate 2-3 specific questions to help identify the right topics for their learning path.
The questions should be:
- Specific to their learning goal
- Help narrow down the most important areas to focus on
- Consider their current level and time constraints

Respond ONLY with valid JSON in this format:
{
  "needsSupport": boolean,
  "questions": ["question1", "question2", "question3"] // only if needsSupport is true
}
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a learning path analyzer. Respond only with valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result;
  } catch (error) {
    console.error("Error checking support needed:", error);
    return { needsSupport: false };
  }
}

async function generateAdditionalData(
  pathName: string,
  time: string,
  achieve: string
) {
  const prompt = `
Generate additional data for a learning path:

Path: ${pathName}
User's Time Input: ${time}
Goal: ${achieve}

Tasks:
1. Create a simple, engaging description (1 sentence) about this learning path
2. Estimate a realistic completion time if the user's input is vague

For time estimation:
- If user wrote specific time (like "4 weeks", "2 months"), use that
- If vague (like "quickly", "soon", "not much time"), estimate based on typical learning paths
- Consider the complexity of the subject and the goal

  
  Respond ONLY with valid JSON in this format:
{
  "ai_description": "One engaging sentence about the learning path",
  "estimated_time": "X weeks" or "X months"
}

Example:
{
  "ai_description": "Master JavaScript fundamentals and build dynamic web applications with confidence.",
  "estimated_time": "6 weeks"
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant who generates metadata for personalized learning paths. Respond ONLY with valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.4,
    });

    const content = response.choices[0].message.content || "{}";
    const result = JSON.parse(content);
    return result;
  } catch (error) {
    console.error("Error generating additional data:", error);
    return {
      ai_description: "Learn and grow with a personalized learning journey.",
      estimated_time: "4 weeks",
    };
  }
}

async function generateLearningPath(data: ProfileFormData) {
  const prompt = `
Create a comprehensive learning path for a Duolingo-style app based on this information:

Path: ${data.pathName}
Current Level: ${data.startLevel}
Goal: ${data.achieve} 
Learning Time: ${data.learningTime}
Preferred Style: ${data.preferredStyle}
Topics: ${data.topics || "General topics appropriate for this learning path"}
Difficulty: ${data.difficulty}

Create a structured learning path with:
- 2-4 weeks of content (based on learningTime)
- Each week should have 2-3 topics
- Each topic should have 3-5 tasks
- Mix of task types: multiple_choice, flashcard, quiz based on preferredStyle
- Progressive difficulty
- Clear learning objectives

For each task, provide:
- question: The main question or prompt
- type: "multiple_choice", "flashcard", or "quiz"
- taskData: Contains the specific data for the task type
- points: Points awarded (5-15 based on difficulty)

TaskData structure:
- For multiple_choice: { options: string[], correctAnswer: number, explanation: string }
- For flashcard: { frontText: string, backText: string }
- For quiz: { choices: [{ text: string, isCorrect: boolean }], explanation: string }

Respond ONLY with valid JSON in this exact format:
{
  "weeks": [
    {
      "weekNumber": 1,
      "title": "Week 1 Title",
      "description": "Week description",
      "topics": [
        {
          "title": "Topic Title",
          "description": "Topic description",
          "tasks": [
            {
              "type": "multiple_choice",
              "question": "Question text",
              "taskData": {
                "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
                "correctAnswer": 0,
                "explanation": "Why this is correct"
              },
              "points": 10
            }
          ]
        }
      ]
    }
  ]
}
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a learning path generator for an educational app. Create engaging, structured learning paths with interactive tasks.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error) {
    console.error("Error generating learning path:", error);
    return { error: "Failed to generate learning path" };
  }
}

async function generateLearningPathWithSupport(data: ProfileFormData) {
  const supportAnswersText = data.supportAnswers?.join("\n") || "";

  const prompt = `Create a comprehensive, detailed, and realistic multi-month learning path for a Duolingo-style app tailored to the following user profile:

User Profile:
- Path Name: ${data.pathName}
- Starting Level: ${data.startLevel}
- Goal: ${data.achieve}
- Total Learning Time (in weeks or months): ${
    data.learningTime
  } — if the user did not write the exact date, estimate
- Preferred Learning Style: ${data.preferredStyle}
- Original Topics (if specified): ${data.topics || "None specified"}
- Difficulty Level: ${data.difficulty}

Additional Focus Areas (extracted from support questions):
${supportAnswersText}

Your task is to produce a well-structured learning path with these precise requirements:

1. Duration and Structure:
- Divide the learning time into an appropriate number of weeks to reflect consistent, steady progress (minimum 12 weeks for longer plans)
- Each week must contain 2 to 3 distinct topics
- The entire learning path must include **at least 10 topics**
- Each topic must have **at least 10 unique tasks** — strive to have exactly 10 or more tasks per topic whenever possible; if absolutely necessary, slightly fewer tasks are allowed, but try to meet the 10-task minimum

2. Topics and Tasks:
- Tasks per topic must include a varied mix of types: multiple_choice, flashcard, and quiz
- The style and difficulty of tasks should progressively increase throughout the weeks, reflecting growing mastery
- Tasks must align with the user’s preferred style for optimal engagement and retention

3. Learning Objectives and Theory:
- Each topic should start with clear learning objectives and a brief theory section (3-5 explanatory points)
- Theory should explain why this topic is important and how it fits into the overall learning journey

4. Task Details:
- For each task, include:
  - question: The main prompt or question
  - type: One of "multiple_choice", "flashcard", or "quiz"
  - taskData: 
    * For multiple_choice: { options: string[], correctAnswer: number, explanation: string }
    * For flashcard: { frontText: string, backText: string }
    * For quiz: { choices: [{ text: string, isCorrect: boolean }], explanation: string }
  - points: Number of points awarded, ranging between 5 and 15 based on task difficulty

5. Incorporation of Support Answers:
- Explicitly incorporate any additional focus areas or requirements mentioned in the support answers, adapting topics or task emphasis accordingly

6. Output Format:
Return only valid JSON in the exact format below, suitable for direct use in the app:

{
  "weeks": [
    {
      "weekNumber": 1,
      "title": "Week 1: [Descriptive Title]",
      "description": "Overview of this week's focus and learning outcomes.",
      "topics": [
        {
          "title": "Topic Title",
          "description": "Brief description of what this topic covers and why it matters.",
          "theory": [
            "Theory point 1 — foundational or conceptual explanation.",
            "Theory point 2 — contextualizes the topic’s importance.",
            "Theory point 3 — how mastering this aids future progress."
          ],
          "tasks": [
            {
              "type": "multiple_choice",
              "question": "Example question text?",
              "taskData": {
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correctAnswer": 2,
                "explanation": "Explanation why this answer is correct and why others are not."
              },
              "points": 10
            },
            {
              "type": "flashcard",
              "question": "Term or concept front text",
              "taskData": {
                "frontText": "Front text",
                "backText": "Detailed explanation or translation"
              },
              "points": 7
            },
            {
              "type": "quiz",
              "question": "Quiz prompt or scenario",
              "taskData": {
                "choices": [
                  { "text": "Choice 1", "isCorrect": false },
                  { "text": "Choice 2", "isCorrect": true },
                  { "text": "Choice 3", "isCorrect": false }
                ],
                "explanation": "Why the correct choices are right and the others are not."
              },
              "points": 12
            }
          ]
        }
      ]
    }
  ]
}

Design the path so that the user, upon completion, will have a deep, practical, and satisfying mastery of the subject. Ensure the learning experience feels achievable yet challenging and rewarding. Avoid superficial or overly brief content.

Strictly enforce:
- Minimum 10 topics in total
- Each topic has at least 10 tasks (try to have 10 or more; only slightly fewer if unavoidable)
- Mix of task types per topic
- Progressive difficulty across the entire learning path

Do NOT include any explanations or text outside the required JSON structure. Only respond with the JSON result.

`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a learning path generator for an educational app. Create engaging, structured learning paths that incorporate user's specific focus areas.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.5,
      max_tokens: 4000,
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error) {
    console.error("Error generating learning path with support:", error);
    return { error: "Failed to generate learning path" };
  }
}
