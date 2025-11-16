import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Trophy } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const Game = () => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showLevelSummary, setShowLevelSummary] = useState(false);

  // 🧠 Multi-level questions
  const levels = [
    {
      level: 1,
      name: "Beginner Groove",
      questions: [
        {
          question: "Which dance style originated in the Bronx, New York?",
          options: ["Ballet", "Hip-Hop", "Salsa", "Tango"],
          correct: 1,
        },
        {
          question: "What is the typical time signature for a waltz?",
          options: ["4/4", "3/4", "6/8", "2/4"],
          correct: 1,
        },
        {
          question: "Which instrument is known as the 'King of Instruments'?",
          options: ["Piano", "Violin", "Pipe Organ", "Guitar"],
          correct: 2,
        },
        {
          question: "Which dance is known for its sharp, angular movements?",
          options: ["Contemporary", "Krumping", "Ballet", "Jazz"],
          correct: 1,
        },
        {
          question: "What is the national dance of Argentina?",
          options: ["Tango", "Flamenco", "Samba", "Bachata"],
          correct: 0,
        },
      ],
    },
    {
      level: 2,
      name: "Intermediate Rhythm",
      questions: [
        {
          question: "Which Indian dance form originates from Tamil Nadu?",
          options: ["Kathak", "Odissi", "Bharatanatyam", "Kuchipudi"],
          correct: 2,
        },
        {
          question: "What dance move is Michael Jackson famous for?",
          options: ["Moonwalk", "Spin Kick", "Robot", "Shuffle"],
          correct: 0,
        },
        {
          question: "The Samba dance is most associated with which country?",
          options: ["Cuba", "Brazil", "Mexico", "Portugal"],
          correct: 1,
        },
        {
          question: "Which of these is a ballroom dance?",
          options: ["Tap", "Cha-Cha", "Hip-Hop", "Breaking"],
          correct: 1,
        },
        {
          question: "Which Indian classical dance uses storytelling gestures?",
          options: ["Bharatanatyam", "Kathak", "Odissi", "All of the above"],
          correct: 3,
        },
      ],
    },
    {
      level: 3,
      name: "Pro Stage Performer",
      questions: [
        {
          question: "Which dance style uses tutting and popping?",
          options: ["Hip-Hop", "Salsa", "Contemporary", "Tap Dance"],
          correct: 0,
        },
        {
          question: "Who composed 'The Nutcracker Ballet'?",
          options: ["Mozart", "Beethoven", "Tchaikovsky", "Chopin"],
          correct: 2,
        },
        {
          question: "What is the dance term for 'spinning on one foot'?",
          options: ["Pirouette", "Sauté", "Plié", "Tendu"],
          correct: 0,
        },
        {
          question: "Which African-American dance inspired Lindy Hop?",
          options: ["Charleston", "Foxtrot", "Swing", "Samba"],
          correct: 0,
        },
        {
          question: "Which dance is performed with clogs or tap shoes?",
          options: ["Tap Dance", "Jazz", "Swing", "Quickstep"],
          correct: 0,
        },
      ],
    },
  ];

  const currentLevelData = levels[currentLevel - 1];
  const currentQuestion = currentLevelData.questions[questionIndex];

  // 🧩 Handle Answer Logic
  const handleAnswer = (index) => {
    setSelectedAnswer(index);

    if (index === currentQuestion.correct) {
      setScore((prev) => prev + 10);
      toast.success("Correct! +10 points 💃");
      setTimeout(() => {
        moveToNext();
      }, 1200);
    } else {
      toast.error(`Wrong! Correct answer: ${currentQuestion.options[currentQuestion.correct]}`);
      setTimeout(() => {
        moveToNext();
      }, 1500);
    }
  };

  // ➡️ Move to next question or level
  const moveToNext = () => {
    setSelectedAnswer(null);
    if (questionIndex < currentLevelData.questions.length - 1) {
      setQuestionIndex((prev) => prev + 1);
    } else {
      setShowLevelSummary(true);
    }
  };

  // 🏁 Handle Next Level
  const handleNextLevel = () => {
    if (currentLevel < levels.length) {
      setCurrentLevel((prev) => prev + 1);
      setQuestionIndex(0);
      setShowLevelSummary(false);
    } else {
      toast.success(`🎉 Game Complete! Final Score: ${score}`);
    }
  };

  // 🪩 Feedback message after each level
  const getLevelFeedback = () => {
    if (score < 30) return "Keep practicing — you’re warming up! 🔥";
    if (score < 60) return "Nice rhythm! You’re finding your groove 🎶";
    if (score < 90) return "You’re dancing through these levels! 💫";
    return "Unstoppable! You’re a true Dance Master 👑";
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-white
      bg-gradient-to-br from-blue-700 via-purple-700 to-pink-600 relative overflow-hidden"
    >
      {/* Floating background animation */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute w-72 h-72 bg-pink-500/40 rounded-full blur-3xl animate-pulse top-10 left-20"></div>
        <div className="absolute w-96 h-96 bg-blue-500/40 rounded-full blur-3xl animate-ping bottom-20 right-20"></div>
      </div>

      <div className="container relative z-10 px-4 py-8 max-w-3xl text-center">
        <Link to="/" className="inline-block mb-6">
          <Button variant="ghost" size="sm" className="gap-2 text-white">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </Link>

        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-300 via-pink-300 to-purple-200 bg-clip-text text-transparent">
          DanceBeats Quiz
        </h1>
        <p className="text-sm text-white/70 mb-6">
          Test your dance & music knowledge across levels 🎵
        </p>

        <div className="flex justify-between mb-4 text-sm">
          <span>Level: {currentLevelData.name}</span>
          <span className="flex items-center gap-1">
            <Trophy size={16} className="text-yellow-400" /> Score: {score}
          </span>
        </div>

        {/* 🧠 Level Summary Screen */}
        <AnimatePresence>
          {showLevelSummary ? (
            <motion.div
              key="summary"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white/10 p-8 rounded-2xl backdrop-blur-lg shadow-2xl"
            >
              <h2 className="text-2xl font-semibold mb-4">
                Level {currentLevel} Complete 🎉
              </h2>
              <p className="text-lg mb-4">Your Score: {score}</p>
              <p className="text-sm text-white/80 mb-6">{getLevelFeedback()}</p>

              {currentLevel < levels.length ? (
                <Button onClick={handleNextLevel} className="px-6 py-2">
                  Next Level →
                </Button>
              ) : (
                <p className="text-md font-semibold text-green-300">
                  You’ve completed all levels! 🏆
                </p>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="question"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-white/10 border-white/20 shadow-xl text-left">
                <CardHeader>
                  <CardTitle>{currentQuestion.question}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <Button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      variant={
                        selectedAnswer === index
                          ? index === currentQuestion.correct
                            ? "default"
                            : "destructive"
                          : "outline"
                      }
                      className={`w-full justify-start h-auto py-4 px-6 rounded-xl text-left transition-all ${
                        selectedAnswer === index
                          ? index === currentQuestion.correct
                            ? "bg-green-600 text-white"
                            : "bg-red-600 text-white"
                          : "bg-white/10 hover:bg-white/20 text-white"
                      }`}
                      disabled={selectedAnswer !== null}
                    >
                      {option}
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Game;
