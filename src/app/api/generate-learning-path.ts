import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import { z } from "zod";
import type {
  FormData,
  SupportAnswers,
  AnalysisResult,
  LearningPath,
  ApiResponse,
} from "@/types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Validation schema
const requestSchema = z.object({
  formData: z.object({
    pathName: z.string().min(1),
    startLevel: z.string(),
    achieve: z.string(),
    learningTime: z.string(),
    preferredStyle: z.enum(["quiz", "flashcards", "writing", "mixed"]),
    topics: z.string().optional(),
    difficulty: z.enum(["easy", "medium", "hard"]),
  }),
  supportAnswers: z.record(z.string()).optional(),
});

type RequestBody = z.infer<typeof requestSchema>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      needsMoreInfo: false,
      error: "Method not allowed",
    });
  }

  try {
    // Validate request body
    const validatedData: RequestBody = requestSchema.parse(req.body);
    const { formData, supportAnswers } = validatedData;

    // Step 1: Analyze if we need more information
    const analysisResult = await analyzeFormData(formData);

    if (analysisResult.needsMoreInfo) {
      return res.status(200).json({
        needsMoreInfo: true,
        supportQuestions: analysisResult.supportQuestions,
      });
    }

    // Step 2: Generate learning path
    const learningPath = await generateLearningPath(formData, supportAnswers);

    return res.status(200).json({
      needsMoreInfo: false,
      learningPath,
    });
  } catch (error) {
    console.error("Error generating learning path:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        needsMoreInfo: false,
        error: "Invalid request data",
      });
    }

    return res.status(500).json({
      needsMoreInfo: false,
      error: "Internal server error",
    });
  }
}

async function analyzeFormData(formData: FormData): Promise<AnalysisResult> {
  const analysisPrompt = `
    Analyze this learning request and determine if there's enough information to create a comprehensive 10-topic learning path:

    Topic: ${formData.pathName}
    Current Level: ${formData.startLevel}
    Goal: ${formData.achieve}
    Time Frame: ${formData.learningTime}
    Preferred Style: ${formData.preferredStyle}
    Specific Topics: ${formData.topics || "None specified"}
    Difficulty: ${formData.difficulty}

    Rules:
    1. If the topic is too vague, broad, or lacks specific context, return needsMoreInfo: true
    2. If you can create 10 distinct, valuable learning topics, return needsMoreInfo: false
    3. Generate 2-4 specific follow-up questions to gather missing information

    Respond in JSON format:
    {
      "needsMoreInfo": boolean,
      "reasoning": "explanation of why more info is needed",
      "supportQuestions": [
        {
          "id": 1,
          "question": "specific question to ask",
          "placeholder": "example answer"
        }
      ]
    }
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an expert learning path designer. Analyze learning requests and determine if sufficient information exists to create comprehensive educational content.",
        },
        {
          role: "user",
          content: analysisPrompt,
        },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    return JSON.parse(content) as AnalysisResult;
  } catch (error) {
    console.error("Error in analyzeFormData:", error);
    throw error;
  }
}

async function generateLearningPath(
  formData: FormData,
  supportAnswers: SupportAnswers = {}
): Promise<LearningPath> {
  const supportContext = Object.entries(supportAnswers)
    .map(([id, answer]) => `Question ${id}: ${answer}`)
    .join("\n");

  const generationPrompt = `
    Create a comprehensive learning path based on this information:

    MAIN REQUEST:
    - Topic: ${formData.pathName}
    - Current Level: ${formData.startLevel}
    - Goal: ${formData.achieve}
    - Time Frame: ${formData.learningTime}
    - Preferred Style: ${formData.preferredStyle}
    - Specific Topics: ${formData.topics || "None specified"}
    - Difficulty: ${formData.difficulty}

    ADDITIONAL CONTEXT:
    ${supportContext}

    Create a structured learning path with:
    1. 10 progressive learning topics
    2. For each topic: title, description, estimated time, key concepts, and practice activities
    3. 5 quiz questions per topic (multiple choice)
    4. 5 flashcards per topic
    5. 3 practical exercises per topic

    Match the preferred learning style: ${formData.preferredStyle}

    Response format (JSON):
    {
      "pathTitle": "Generated title",
      "pathDescription": "Brief description",
      "estimatedDuration": "Total time needed",
      "topics": [
        {
          "id": 1,
          "title": "Topic title",
          "description": "What this topic covers",
          "estimatedTime": "Time needed",
          "keyConcepts": ["concept1", "concept2", "concept3"],
          "quiz": [
            {
              "question": "Question text",
              "options": ["A", "B", "C", "D"],
              "correct": 0,
              "explanation": "Why this is correct"
            }
          ],
          "flashcards": [
            {
              "front": "Question or term",
              "back": "Answer or definition"
            }
          ],
          "exercises": [
            {
              "title": "Exercise title",
              "description": "What to do",
              "type": "practical"
            }
          ]
        }
      ]
    }
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an expert curriculum designer who creates engaging, progressive learning paths tailored to individual needs and learning styles.",
        },
        {
          role: "user",
          content: generationPrompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    return JSON.parse(content) as LearningPath;
  } catch (error) {
    console.error("Error in generateLearningPath:", error);
    throw error;
  }
}
