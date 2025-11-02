"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { HelpCircle, CheckCircle, Loader2 } from "lucide-react";

const formSchema = z.object({
  pathName: z
    .string()
    .min(2, { message: "Your message is too short" })
    .max(50, { message: "Your message is too long" }),
  startLevel: z.string().max(20, { message: "Your message is too long" }),
  achieve: z.string().max(50, { message: "Your message is too long" }),
  learningTime: z
    .string()
    .min(1, { message: "Please specify your learning time" }),
  preferredStyle: z.enum(["quiz", "flashcards", "writing", "mixed"], {
    errorMap: () => ({ message: "Please select a learning style" }),
  }),
  topics: z.string().optional(),
  difficulty: z.enum(["easy", "medium", "hard"]),
});

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as any,
    },
  },
};

const buttonVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as any,
      delay: 0.8,
    },
  },
};

interface SupportQuestionResponse {
  needsSupport: boolean;
  questions?: string[];
  learningPath?: any;
  message?: string;
}

export function ProfileForm() {
  const [supportResponse, setSupportResponse] =
    useState<SupportQuestionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [supportAnswers, setSupportAnswers] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pathName: "",
      startLevel: "",
      achieve: "",
      learningTime: "",
      preferredStyle: "mixed",
      topics: "",
      difficulty: "medium",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const response = await fetch("/api/learning-path", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      const result: SupportQuestionResponse = await response.json();
      setSupportResponse(result);

      if (result.needsSupport && result.questions) {
        setSupportAnswers(new Array(result.questions.length).fill(""));
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSupportAnswers() {
    if (!supportResponse?.questions) return;

    setIsLoading(true);
    try {
      const formData = form.getValues();
      const response = await fetch("/api/learning-path", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          supportAnswers: supportAnswers,
          isFollowUp: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit support answers");
      }

      const result: SupportQuestionResponse = await response.json();
      setSupportResponse(result);
    } catch (error) {
      console.error("Error submitting support answers:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSupportAnswerChange = (index: number, value: string) => {
    const newAnswers = [...supportAnswers];
    newAnswers[index] = value;
    setSupportAnswers(newAnswers);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-2xl mx-auto"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Path Name */}
          <motion.div variants={itemVariants}>
            <FormField
              control={form.control}
              name="pathName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    Path name
                  </FormLabel>
                  <FormControl>
                    <motion.div
                      whileFocus={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Input
                        placeholder="e.g. improve my public speaking"
                        {...field}
                        className="transition-all duration-300 focus:ring-2 focus:ring-blue-500/20"
                      />
                    </motion.div>
                  </FormControl>
                  <FormDescription>
                    What do you want to learn? This will be the title of your
                    path.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          {/* Start Level */}
          <motion.div variants={itemVariants}>
            <FormField
              control={form.control}
              name="startLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    Start Level
                  </FormLabel>
                  <FormControl>
                    <motion.div
                      whileFocus={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Input
                        placeholder="e.g. beginner"
                        {...field}
                        className="transition-all duration-300 focus:ring-2 focus:ring-blue-500/20"
                      />
                    </motion.div>
                  </FormControl>
                  <FormDescription>
                    What's your current skill level? For example: beginner,
                    intermediate, or advanced.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          {/* Goal */}
          <motion.div variants={itemVariants}>
            <FormField
              control={form.control}
              name="achieve"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">Goal</FormLabel>
                  <FormControl>
                    <motion.div
                      whileFocus={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Input
                        placeholder="e.g. speak fluently in public"
                        {...field}
                        className="transition-all duration-300 focus:ring-2 focus:ring-blue-500/20"
                      />
                    </motion.div>
                  </FormControl>
                  <FormDescription>
                    What do you want to achieve by completing this path?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          {/* Learning Time */}
          <motion.div variants={itemVariants}>
            <FormField
              control={form.control}
              name="learningTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    Learning time
                  </FormLabel>
                  <FormControl>
                    <motion.div
                      whileFocus={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Input
                        placeholder="e.g. 4 weeks"
                        {...field}
                        className="transition-all duration-300 focus:ring-2 focus:ring-blue-500/20"
                      />
                    </motion.div>
                  </FormControl>
                  <FormDescription>
                    How long do you plan to study this path?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          {/* Preferred Style */}
          <motion.div variants={itemVariants}>
            <FormField
              control={form.control}
              name="preferredStyle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    Preferred learning style
                  </FormLabel>
                  <FormControl>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="transition-all duration-300 focus:ring-2 focus:ring-blue-500/20">
                          <SelectValue placeholder="Select style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="quiz">Quiz</SelectItem>
                          <SelectItem value="flashcards">Flashcards</SelectItem>
                          <SelectItem value="writing">Writing tasks</SelectItem>
                          <SelectItem value="mixed">Mixed</SelectItem>
                        </SelectContent>
                      </Select>
                    </motion.div>
                  </FormControl>
                  <FormDescription>
                    What type of learning do you prefer?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          {/* Topics - Enhanced */}
          <motion.div variants={itemVariants}>
            <FormField
              control={form.control}
              name="topics"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium flex items-center gap-2">
                    Topics
                    <HelpCircle className="w-4 h-4 text-gray-400" />
                  </FormLabel>
                  <FormControl>
                    <motion.div
                      whileFocus={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Input
                        placeholder="Leave blank if unsure - we'll help you identify the right topics"
                        {...field}
                        className="transition-all duration-300 focus:ring-2 focus:ring-blue-500/20"
                      />
                    </motion.div>
                  </FormControl>
                  <FormDescription>
                    Optional: List specific areas you want to focus on. If
                    you're not sure what topics to include, leave this blank and
                    we'll help you identify the best areas to focus on based on
                    your goals.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          {/* Difficulty */}
          <motion.div variants={itemVariants}>
            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    Difficulty level
                  </FormLabel>
                  <FormControl>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="transition-all duration-300 focus:ring-2 focus:ring-blue-500/20">
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </motion.div>
                  </FormControl>
                  <FormDescription>
                    Choose your preferred difficulty level.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div
            variants={buttonVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              type="submit"
              disabled={isLoading}
              className="mb-10 w-full sm:w-auto px-8 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex flex-row">
                  <Loader2 className="animate-spin" />
                  Processing...
                </div>
              ) : (
                "Create Learning Path"
              )}
            </Button>
          </motion.div>
        </form>
      </Form>

      {/* Support Questions Section */}
      {supportResponse &&
        supportResponse.needsSupport &&
        supportResponse.questions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200"
          >
            <div className="flex items-center gap-2 mb-4">
              <HelpCircle className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-900">
                Let's define your learning focus
              </h3>
            </div>
            <p className="text-blue-800 mb-4">
              To create the most effective learning path for you, please answer
              these questions:
            </p>

            <div className="space-y-4">
              {supportResponse.questions.map((question, index) => (
                <div key={index} className="space-y-2">
                  <label className="text-sm font-medium text-blue-900">
                    {index + 1}. {question}
                  </label>
                  <Input
                    value={supportAnswers[index] || ""}
                    onChange={(e) =>
                      handleSupportAnswerChange(index, e.target.value)
                    }
                    className="bg-white text-slate-900"
                    placeholder="Your answer..."
                  />
                </div>
              ))}
            </div>

            <Button
              onClick={handleSupportAnswers}
              disabled={
                isLoading || supportAnswers.some((answer) => !answer.trim())
              }
              className="mt-4 bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <div className="flex flex-row">
                  <Loader2 className="animate-spin" />
                  Creating Path...
                </div>
              ) : (
                " Generate Learning Path"
              )}
            </Button>
          </motion.div>
        )}

      {/* Success Message */}
      {supportResponse && !supportResponse.needsSupport && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-6 bg-green-50 rounded-lg border border-green-200"
        >
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-green-900">
              Learning Path Created!
            </h3>
          </div>
          <p className="text-green-800">
            {supportResponse.message ||
              "Your personalized learning path has been created successfully!"}
          </p>

          {supportResponse.learningPath && (
            <div className="mt-4 p-4 bg-white rounded border">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                {JSON.stringify(supportResponse.learningPath, null, 2)}
              </pre>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
