// import React, { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   CheckCircle,
//   Circle,
//   BookOpen,
//   Trophy,
//   Star,
//   ArrowRight,
//   RotateCcw,
//   Zap,
//   Target,
//   Clock,
//   Brain,
//   Award,
//   ChevronRight,
//   ChevronDown,
//   Play,
//   Pause,
// } from "lucide-react";

// // Mock data structure based on your schema
// const mockLearningPath = {
//   id: 1,
//   title: "Master Public Speaking",
//   description: "Build confidence and skills for effective public speaking",
//   startLevel: "Beginner",
//   achieve: "Speak fluently in public",
//   learningTime: "4 weeks",
//   preferredStyle: "mixed",
//   difficulty: "medium",
//   weeks: [
//     {
//       weekNumber: 1,
//       title: "Foundation & Confidence",
//       description: "Build your speaking foundation and overcome initial fears",
//       topics: [
//         {
//           title: "Understanding Your Audience",
//           description: "Learn to analyze and connect with your audience",
//           tasks: [
//             {
//               id: 1,
//               type: "multiple_choice",
//               question:
//                 "What is the most important factor when preparing a speech?",
//               taskData: {
//                 options: [
//                   "Your personal interests",
//                   "Understanding your audience",
//                   "Complex vocabulary",
//                   "Length of speech",
//                 ],
//                 correctAnswer: 1,
//                 explanation:
//                   "Understanding your audience helps you tailor your message effectively and create a meaningful connection.",
//               },
//               points: 10,
//               completed: true,
//             },
//             {
//               id: 2,
//               type: "flashcard",
//               question: "Key Audience Analysis Questions",
//               taskData: {
//                 frontText:
//                   "What are the 5 key questions to ask about your audience?",
//                 backText:
//                   "1. Who are they? 2. What do they know? 3. What do they need? 4. What are their interests? 5. What's their attention span?",
//               },
//               points: 8,
//               completed: true,
//             },
//             {
//               id: 3,
//               type: "quiz",
//               question:
//                 "Which audience engagement technique is most effective for beginners?",
//               taskData: {
//                 choices: [
//                   { text: "Asking rhetorical questions", isCorrect: false },
//                   { text: "Using personal stories", isCorrect: true },
//                   { text: "Complex statistics", isCorrect: false },
//                   { text: "Technical jargon", isCorrect: false },
//                 ],
//                 explanation:
//                   "Personal stories create emotional connection and are easier for beginners to deliver authentically.",
//               },
//               points: 12,
//               completed: false,
//             },
//           ],
//         },
//         {
//           title: "Voice & Body Language",
//           description: "Master non-verbal communication essentials",
//           tasks: [
//             {
//               id: 4,
//               type: "flashcard",
//               question: "Body Language Basics",
//               taskData: {
//                 frontText: "What percentage of communication is non-verbal?",
//                 backText:
//                   "Research suggests 55% body language, 38% tone of voice, and only 7% actual words (Mehrabian's Rule)",
//               },
//               points: 8,
//               completed: false,
//             },
//             {
//               id: 5,
//               type: "multiple_choice",
//               question: "Which posture conveys confidence while speaking?",
//               taskData: {
//                 options: [
//                   "Arms crossed",
//                   "Hands in pockets",
//                   "Shoulders back, feet shoulder-width apart",
//                   "Leaning on podium",
//                 ],
//                 correctAnswer: 2,
//                 explanation:
//                   "An open, balanced stance with shoulders back projects confidence and authority.",
//               },
//               points: 10,
//               completed: false,
//             },
//           ],
//         },
//       ],
//     },
//     {
//       weekNumber: 2,
//       title: "Structure & Content",
//       description: "Learn to organize and craft compelling presentations",
//       topics: [
//         {
//           title: "Speech Structure",
//           description: "Master the art of organizing your ideas",
//           tasks: [
//             {
//               id: 6,
//               type: "quiz",
//               question:
//                 "What is the most effective speech structure for beginners?",
//               taskData: {
//                 choices: [
//                   { text: "Problem-Solution", isCorrect: false },
//                   { text: "Tell-Show-Do", isCorrect: false },
//                   { text: "Introduction-Body-Conclusion", isCorrect: true },
//                   { text: "Chronological", isCorrect: false },
//                 ],
//                 explanation:
//                   "The classic three-part structure is simple, versatile, and easy for beginners to master.",
//               },
//               points: 15,
//               completed: false,
//             },
//           ],
//         },
//       ],
//     },
//   ],
// };

// const LearningPath = () => {
//   const [selectedWeek, setSelectedWeek] = useState(0);
//   const [selectedTopic, setSelectedTopic] = useState(0);
//   const [selectedTask, setSelectedTask] = useState(0);
//   const [isFlipped, setIsFlipped] = useState(false);
//   const [userAnswers, setUserAnswers] = useState({});
//   const [showExplanation, setShowExplanation] = useState({});

//   const currentWeek = mockLearningPath.weeks[selectedWeek];
//   const currentTopic = currentWeek?.topics[selectedTopic];
//   const currentTask = currentTopic?.tasks[selectedTask];

//   const handleAnswerSelect = (taskId, answer) => {
//     setUserAnswers((prev) => ({ ...prev, [taskId]: answer }));
//     setTimeout(() => {
//       setShowExplanation((prev) => ({ ...prev, [taskId]: true }));
//     }, 500);
//   };

//   const getTotalProgress = () => {
//     const totalTasks = mockLearningPath.weeks.reduce(
//       (acc, week) =>
//         acc +
//         week.topics.reduce(
//           (topicAcc, topic) => topicAcc + topic.tasks.length,
//           0
//         ),
//       0
//     );
//     const completedTasks = mockLearningPath.weeks.reduce(
//       (acc, week) =>
//         acc +
//         week.topics.reduce(
//           (topicAcc, topic) =>
//             topicAcc + topic.tasks.filter((task) => task.completed).length,
//           0
//         ),
//       0
//     );
//     return Math.round((completedTasks / totalTasks) * 100);
//   };

//   const getWeekProgress = (week) => {
//     const totalTasks = week.topics.reduce(
//       (acc, topic) => acc + topic.tasks.length,
//       0
//     );
//     const completedTasks = week.topics.reduce(
//       (acc, topic) => acc + topic.tasks.filter((task) => task.completed).length,
//       0
//     );
//     return Math.round((completedTasks / totalTasks) * 100);
//   };

//   const renderTaskCard = (task) => {
//     const isAnswered = userAnswers[task.id] !== undefined;
//     const showExp = showExplanation[task.id];

//     switch (task.type) {
//       case "flashcard":
//         return (
//           <motion.div
//             key={task.id}
//             className="relative w-full h-80 perspective-1000"
//             whileHover={{ scale: 1.02 }}
//             transition={{ duration: 0.3 }}
//           >
//             <motion.div
//               className="relative w-full h-full cursor-pointer preserve-3d"
//               animate={{ rotateY: isFlipped ? 180 : 0 }}
//               transition={{ duration: 0.8, ease: "easeInOut" }}
//               onClick={() => setIsFlipped(!isFlipped)}
//             >
//               {/* Front of card */}
//               <div className="absolute inset-0 w-full h-full backface-hidden bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-8 flex flex-col justify-center items-center text-white shadow-2xl">
//                 <Brain className="w-12 h-12 mb-4 opacity-80" />
//                 <h3 className="text-xl font-bold mb-4 text-center">
//                   {task.question}
//                 </h3>
//                 <p className="text-center text-lg opacity-90 mb-6">
//                   {task.taskData.frontText}
//                 </p>
//                 <div className="flex items-center gap-2 text-sm opacity-75">
//                   <RotateCcw className="w-4 h-4" />
//                   <span>Click to reveal answer</span>
//                 </div>
//               </div>

//               {/* Back of card */}
//               <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-8 flex flex-col justify-center items-center text-white shadow-2xl">
//                 <CheckCircle className="w-12 h-12 mb-4 opacity-80" />
//                 <h3 className="text-xl font-bold mb-4 text-center">Answer</h3>
//                 <p className="text-center text-lg leading-relaxed">
//                   {task.taskData.backText}
//                 </p>
//                 <div className="flex items-center gap-2 text-sm opacity-75 mt-6">
//                   <Star className="w-4 h-4" />
//                   <span>{task.points} points</span>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         );

//       case "multiple_choice":
//         return (
//           <motion.div
//             key={task.id}
//             className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//           >
//             <div className="flex items-center gap-3 mb-6">
//               <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
//                 <Target className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <h3 className="text-xl font-bold text-gray-800">
//                   {task.question}
//                 </h3>
//                 <p className="text-sm text-gray-500 flex items-center gap-1">
//                   <Zap className="w-4 h-4" />
//                   {task.points} points
//                 </p>
//               </div>
//             </div>

//             <div className="space-y-3">
//               {task.taskData.options.map((option, index) => {
//                 const isSelected = userAnswers[task.id] === index;
//                 const isCorrect = index === task.taskData.correctAnswer;
//                 const shouldHighlight = isAnswered && (isSelected || isCorrect);

//                 return (
//                   <motion.button
//                     key={index}
//                     onClick={() =>
//                       !isAnswered && handleAnswerSelect(task.id, index)
//                     }
//                     className={`w-full p-4 rounded-xl text-left transition-all duration-300 border-2 ${
//                       shouldHighlight
//                         ? isCorrect
//                           ? "bg-green-50 border-green-500 text-green-800"
//                           : isSelected
//                           ? "bg-red-50 border-red-500 text-red-800"
//                           : "bg-gray-50 border-gray-200 text-gray-800"
//                         : "bg-gray-50 border-gray-200 text-gray-800 hover:bg-gray-100"
//                     }`}
//                     disabled={isAnswered}
//                     whileHover={{ scale: isAnswered ? 1 : 1.02 }}
//                     whileTap={{ scale: isAnswered ? 1 : 0.98 }}
//                   >
//                     <div className="flex items-center gap-3">
//                       <div
//                         className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
//                           shouldHighlight && isCorrect
//                             ? "bg-green-500 border-green-500"
//                             : shouldHighlight && isSelected
//                             ? "bg-red-500 border-red-500"
//                             : "border-gray-300"
//                         }`}
//                       >
//                         {shouldHighlight && (isCorrect || isSelected) && (
//                           <CheckCircle className="w-4 h-4 text-white" />
//                         )}
//                       </div>
//                       <span className="font-medium">{option}</span>
//                     </div>
//                   </motion.button>
//                 );
//               })}
//             </div>

//             <AnimatePresence>
//               {showExp && (
//                 <motion.div
//                   initial={{ opacity: 0, height: 0 }}
//                   animate={{ opacity: 1, height: "auto" }}
//                   exit={{ opacity: 0, height: 0 }}
//                   className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200"
//                 >
//                   <h4 className="font-semibold text-blue-800 mb-2">
//                     Explanation:
//                   </h4>
//                   <p className="text-blue-700">{task.taskData.explanation}</p>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </motion.div>
//         );

//       case "quiz":
//         return (
//           <motion.div
//             key={task.id}
//             className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//           >
//             <div className="flex items-center gap-3 mb-6">
//               <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
//                 <Trophy className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <h3 className="text-xl font-bold text-gray-800">
//                   {task.question}
//                 </h3>
//                 <p className="text-sm text-gray-500 flex items-center gap-1">
//                   <Award className="w-4 h-4" />
//                   {task.points} points
//                 </p>
//               </div>
//             </div>

//             <div className="space-y-3">
//               {task.taskData.choices.map((choice, index) => {
//                 const isSelected = userAnswers[task.id] === index;
//                 const shouldHighlight =
//                   isAnswered && (isSelected || choice.isCorrect);

//                 return (
//                   <motion.button
//                     key={index}
//                     onClick={() =>
//                       !isAnswered && handleAnswerSelect(task.id, index)
//                     }
//                     className={`w-full p-4 rounded-xl text-left transition-all duration-300 border-2 ${
//                       shouldHighlight
//                         ? choice.isCorrect
//                           ? "bg-green-50 border-green-500 text-green-800"
//                           : isSelected
//                           ? "bg-red-50 border-red-500 text-red-800"
//                           : "bg-gray-50 border-gray-200 text-gray-800"
//                         : "bg-gray-50 border-gray-200 text-gray-800 hover:bg-gray-100"
//                     }`}
//                     disabled={isAnswered}
//                     whileHover={{ scale: isAnswered ? 1 : 1.02 }}
//                     whileTap={{ scale: isAnswered ? 1 : 0.98 }}
//                   >
//                     <div className="flex items-center gap-3">
//                       <div
//                         className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
//                           shouldHighlight && choice.isCorrect
//                             ? "bg-green-500 border-green-500"
//                             : shouldHighlight && isSelected
//                             ? "bg-red-500 border-red-500"
//                             : "border-gray-300"
//                         }`}
//                       >
//                         {shouldHighlight &&
//                           (choice.isCorrect || isSelected) && (
//                             <CheckCircle className="w-4 h-4 text-white" />
//                           )}
//                       </div>
//                       <span className="font-medium">{choice.text}</span>
//                     </div>
//                   </motion.button>
//                 );
//               })}
//             </div>

//             <AnimatePresence>
//               {showExp && (
//                 <motion.div
//                   initial={{ opacity: 0, height: 0 }}
//                   animate={{ opacity: 1, height: "auto" }}
//                   exit={{ opacity: 0, height: 0 }}
//                   className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200"
//                 >
//                   <h4 className="font-semibold text-blue-800 mb-2">
//                     Explanation:
//                   </h4>
//                   <p className="text-blue-700">{task.taskData.explanation}</p>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </motion.div>
//         );

//       default:
//         return null;
//     }
//   };

//   const totalProgress = getTotalProgress();

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <motion.div
//           className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8"
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//         >
//           <div className="flex flex-col lg:flex-row gap-8">
//             <div className="flex-1">
//               <h1 className="text-4xl font-bold text-gray-800 mb-2">
//                 {mockLearningPath.title}
//               </h1>
//               <p className="text-gray-600 text-lg mb-4">
//                 {mockLearningPath.description}
//               </p>

//               <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//                 <div className="bg-blue-50 rounded-lg p-3">
//                   <div className="flex items-center gap-2 text-blue-600">
//                     <Target className="w-5 h-5" />
//                     <span className="font-medium">Level</span>
//                   </div>
//                   <p className="text-blue-800 font-semibold">
//                     {mockLearningPath.startLevel}
//                   </p>
//                 </div>
//                 <div className="bg-green-50 rounded-lg p-3">
//                   <div className="flex items-center gap-2 text-green-600">
//                     <Trophy className="w-5 h-5" />
//                     <span className="font-medium">Goal</span>
//                   </div>
//                   <p className="text-green-800 font-semibold">
//                     {mockLearningPath.achieve}
//                   </p>
//                 </div>
//                 <div className="bg-purple-50 rounded-lg p-3">
//                   <div className="flex items-center gap-2 text-purple-600">
//                     <Clock className="w-5 h-5" />
//                     <span className="font-medium">Duration</span>
//                   </div>
//                   <p className="text-purple-800 font-semibold">
//                     {mockLearningPath.learningTime}
//                   </p>
//                 </div>
//                 <div className="bg-orange-50 rounded-lg p-3">
//                   <div className="flex items-center gap-2 text-orange-600">
//                     <Brain className="w-5 h-5" />
//                     <span className="font-medium">Style</span>
//                   </div>
//                   <p className="text-orange-800 font-semibold capitalize">
//                     {mockLearningPath.preferredStyle}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="lg:w-80">
//               <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
//                 <h3 className="text-lg font-semibold mb-2">Overall Progress</h3>
//                 <div className="flex items-center gap-4">
//                   <div className="flex-1">
//                     <div className="bg-white/20 rounded-full h-3 mb-2">
//                       <motion.div
//                         className="bg-white rounded-full h-3"
//                         initial={{ width: 0 }}
//                         animate={{ width: `${totalProgress}%` }}
//                         transition={{ duration: 1.5, ease: "easeOut" }}
//                       />
//                     </div>
//                     <p className="text-sm opacity-90">
//                       {totalProgress}% Complete
//                     </p>
//                   </div>
//                   <div className="text-right">
//                     <div className="text-2xl font-bold">{totalProgress}%</div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </motion.div>

//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
//           {/* Sidebar Navigation */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 sticky top-4">
//               <h2 className="text-xl font-bold text-gray-800 mb-4">
//                 Learning Path
//               </h2>

//               <div className="space-y-4">
//                 {mockLearningPath.weeks.map((week, weekIndex) => (
//                   <motion.div
//                     key={weekIndex}
//                     className={`rounded-xl p-4 border-2 transition-all duration-300 cursor-pointer ${
//                       selectedWeek === weekIndex
//                         ? "bg-blue-50 border-blue-500"
//                         : "bg-gray-50 border-gray-200 hover:border-gray-300"
//                     }`}
//                     onClick={() => {
//                       setSelectedWeek(weekIndex);
//                       setSelectedTopic(0);
//                       setSelectedTask(0);
//                     }}
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                   >
//                     <div className="flex items-center justify-between mb-2">
//                       <h3 className="font-semibold text-gray-800">
//                         Week {week.weekNumber}
//                       </h3>
//                       <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
//                         <motion.div
//                           className="h-full bg-blue-500"
//                           initial={{ width: 0 }}
//                           animate={{ width: `${getWeekProgress(week)}%` }}
//                           transition={{ duration: 1 }}
//                         />
//                       </div>
//                     </div>
//                     <p className="text-sm text-gray-600 mb-2">{week.title}</p>
//                     <p className="text-xs text-gray-500">
//                       {week.topics.length} topics
//                     </p>
//                   </motion.div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Main Content */}
//           <div className="lg:col-span-3">
//             <motion.div
//               className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
//               key={`${selectedWeek}-${selectedTopic}-${selectedTask}`}
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.5 }}
//             >
//               {/* Week Header */}
//               <div className="mb-8">
//                 <div className="flex items-center gap-4 mb-4">
//                   <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
//                     {currentWeek.weekNumber}
//                   </div>
//                   <div>
//                     <h2 className="text-2xl font-bold text-gray-800">
//                       {currentWeek.title}
//                     </h2>
//                     <p className="text-gray-600">{currentWeek.description}</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Topic Navigation */}
//               <div className="mb-8">
//                 <div className="flex flex-wrap gap-2 mb-4">
//                   {currentWeek.topics.map((topic, index) => (
//                     <button
//                       key={index}
//                       onClick={() => {
//                         setSelectedTopic(index);
//                         setSelectedTask(0);
//                       }}
//                       className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
//                         selectedTopic === index
//                           ? "bg-blue-500 text-white"
//                           : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                       }`}
//                     >
//                       {topic.title}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Task Navigation */}
//               {currentTopic && (
//                 <div className="mb-8">
//                   <h3 className="text-xl font-bold text-gray-800 mb-2">
//                     {currentTopic.title}
//                   </h3>
//                   <p className="text-gray-600 mb-4">
//                     {currentTopic.description}
//                   </p>

//                   <div className="flex flex-wrap gap-2">
//                     {currentTopic.tasks.map((task, index) => (
//                       <button
//                         key={index}
//                         onClick={() => {
//                           setSelectedTask(index);
//                           setIsFlipped(false);
//                         }}
//                         className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
//                           selectedTask === index
//                             ? "bg-green-500 text-white"
//                             : task.completed
//                             ? "bg-green-100 text-green-700"
//                             : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                         }`}
//                       >
//                         {task.completed ? (
//                           <CheckCircle className="w-4 h-4" />
//                         ) : (
//                           <Circle className="w-4 h-4" />
//                         )}
//                         Task {index + 1}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Task Content */}
//               {currentTask && (
//                 <div className="mb-8">{renderTaskCard(currentTask)}</div>
//               )}

//               {/* Navigation Buttons */}
//               <div className="flex justify-between items-center">
//                 <button
//                   onClick={() => {
//                     if (selectedTask > 0) {
//                       setSelectedTask(selectedTask - 1);
//                     } else if (selectedTopic > 0) {
//                       setSelectedTopic(selectedTopic - 1);
//                       setSelectedTask(
//                         currentWeek.topics[selectedTopic - 1].tasks.length - 1
//                       );
//                     }
//                     setIsFlipped(false);
//                   }}
//                   className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-300"
//                   disabled={
//                     selectedWeek === 0 &&
//                     selectedTopic === 0 &&
//                     selectedTask === 0
//                   }
//                 >
//                   Previous
//                 </button>

//                 <button
//                   onClick={() => {
//                     if (selectedTask < currentTopic.tasks.length - 1) {
//                       setSelectedTask(selectedTask + 1);
//                     } else if (selectedTopic < currentWeek.topics.length - 1) {
//                       setSelectedTopic(selectedTopic + 1);
//                       setSelectedTask(0);
//                     }
//                     setIsFlipped(false);
//                   }}
//                   className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors duration-300 flex items-center gap-2"
//                   disabled={
//                     selectedWeek === mockLearningPath.weeks.length - 1 &&
//                     selectedTopic === currentWeek.topics.length - 1 &&
//                     selectedTask === currentTopic.tasks.length - 1
//                   }
//                 >
//                   Next
//                   <ArrowRight className="w-4 h-4" />
//                 </button>
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LearningPath;
