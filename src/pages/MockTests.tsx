import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ClipboardCheck,
  Play,
  Clock,
  Target,
  CheckCircle,
  XCircle,
  Trophy,
  RefreshCw,
  ChevronRight,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

type TestState = "setup" | "test" | "results";

const MockTests = () => {
  const [state, setState] = useState<TestState>("setup");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

  const sampleQuestions: Question[] = [
    {
      id: 1,
      question: "What is the SI unit of force?",
      options: ["Joule", "Newton", "Watt", "Pascal"],
      correct: 1,
      explanation: "Newton (N) is the SI unit of force. It is defined as the force required to accelerate a 1 kg mass by 1 m/s².",
    },
    {
      id: 2,
      question: "Which law states that F = ma?",
      options: ["Newton's First Law", "Newton's Second Law", "Newton's Third Law", "Law of Gravitation"],
      correct: 1,
      explanation: "Newton's Second Law of Motion states that Force equals mass times acceleration (F = ma).",
    },
    {
      id: 3,
      question: "What is the acceleration due to gravity on Earth?",
      options: ["9.8 m/s²", "10.2 m/s²", "8.5 m/s²", "11.0 m/s²"],
      correct: 0,
      explanation: "The standard acceleration due to gravity on Earth's surface is approximately 9.8 m/s² (or 9.81 m/s² to be more precise).",
    },
    {
      id: 4,
      question: "What type of motion is uniform circular motion?",
      options: ["Uniformly accelerated", "Non-accelerated", "Accelerated", "Decelerated"],
      correct: 2,
      explanation: "Uniform circular motion is accelerated motion because the direction of velocity continuously changes, even though speed remains constant.",
    },
    {
      id: 5,
      question: "Which quantity is a scalar?",
      options: ["Velocity", "Force", "Speed", "Acceleration"],
      correct: 2,
      explanation: "Speed is a scalar quantity as it only has magnitude. Velocity, force, and acceleration are vectors with both magnitude and direction.",
    },
  ];

  const handleStartTest = () => {
    if (!topic.trim()) {
      toast({
        title: "Please enter a topic",
        variant: "destructive",
      });
      return;
    }
    setState("test");
    toast({
      title: "Test started! 🚀",
      description: "Good luck! You have 10 minutes.",
    });
  };

  const handleAnswer = (questionId: number, optionIndex: number) => {
    setAnswers({ ...answers, [questionId]: optionIndex });
  };

  const handleNext = () => {
    if (currentQuestion < sampleQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
    } else {
      setState("results");
    }
  };

  const calculateScore = () => {
    let correct = 0;
    sampleQuestions.forEach((q) => {
      if (answers[q.id] === q.correct) correct++;
    });
    return correct;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/dashboard">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-success to-emerald-400 rounded-xl flex items-center justify-center shadow-lg shadow-success/25">
                  <ClipboardCheck className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="font-display font-bold text-lg">AI Mock Tests</h1>
                  <p className="text-xs text-muted-foreground">Practice with AI-generated questions</p>
                </div>
              </div>
            </div>
            {state === "test" && (
              <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-xl">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="font-mono font-medium">{formatTime(timeLeft)}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <AnimatePresence mode="wait">
          {/* Setup State */}
          {state === "setup" && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <Card variant="glass" className="p-8">
                <h2 className="font-display text-xl font-semibold mb-2">Create Your Test</h2>
                <p className="text-muted-foreground mb-6">Enter a topic and we'll generate practice questions for you.</p>

                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Topic</label>
                    <Input
                      placeholder="e.g., Physics - Laws of Motion"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="h-12"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-3 block">Difficulty</label>
                    <div className="grid grid-cols-3 gap-3">
                      {(["easy", "medium", "hard"] as const).map((d) => (
                        <button
                          key={d}
                          onClick={() => setDifficulty(d)}
                          className={`p-4 rounded-xl border-2 text-center capitalize transition-all ${
                            difficulty === d
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <span className="text-2xl block mb-1">
                            {d === "easy" ? "🟢" : d === "medium" ? "🟡" : "🔴"}
                          </span>
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button variant="hero" size="lg" className="w-full" onClick={handleStartTest}>
                    <Play className="w-5 h-5 mr-2" />
                    Start Test
                  </Button>
                </div>
              </Card>

              <div>
                <h3 className="font-medium mb-4">Popular Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {["Physics - Mechanics", "Chemistry - Organic", "Math - Calculus", "Biology - Cell Structure"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTopic(t)}
                      className="px-4 py-2 rounded-full bg-secondary hover:bg-secondary/80 text-sm transition-colors"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Test State */}
          {state === "test" && (
            <motion.div
              key="test"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Progress */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>Question {currentQuestion + 1} of {sampleQuestions.length}</span>
                  <span className="text-muted-foreground">{Math.round(((currentQuestion + 1) / sampleQuestions.length) * 100)}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-success to-emerald-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestion + 1) / sampleQuestions.length) * 100}%` }}
                  />
                </div>
              </div>

              <Card variant="glass" className="p-8">
                <h2 className="font-display text-xl font-semibold mb-6">
                  {sampleQuestions[currentQuestion].question}
                </h2>

                <div className="space-y-3 mb-6">
                  {sampleQuestions[currentQuestion].options.map((option, index) => {
                    const isSelected = answers[sampleQuestions[currentQuestion].id] === index;
                    const isCorrect = index === sampleQuestions[currentQuestion].correct;
                    const showResult = showExplanation;

                    return (
                      <button
                        key={index}
                        onClick={() => !showExplanation && handleAnswer(sampleQuestions[currentQuestion].id, index)}
                        disabled={showExplanation}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4 ${
                          showResult
                            ? isCorrect
                              ? "border-success bg-success/10"
                              : isSelected
                              ? "border-destructive bg-destructive/10"
                              : "border-border"
                            : isSelected
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          showResult
                            ? isCorrect
                              ? "bg-success text-success-foreground"
                              : isSelected
                              ? "bg-destructive text-destructive-foreground"
                              : "bg-secondary"
                            : isSelected
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary"
                        }`}>
                          {showResult ? (
                            isCorrect ? <CheckCircle className="w-4 h-4" /> : isSelected ? <XCircle className="w-4 h-4" /> : String.fromCharCode(65 + index)
                          ) : (
                            String.fromCharCode(65 + index)
                          )}
                        </span>
                        {option}
                      </button>
                    );
                  })}
                </div>

                {showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-4 bg-secondary/50 rounded-xl mb-6"
                  >
                    <p className="text-sm font-medium mb-1">Explanation:</p>
                    <p className="text-sm text-muted-foreground">
                      {sampleQuestions[currentQuestion].explanation}
                    </p>
                  </motion.div>
                )}

                <div className="flex gap-3">
                  {!showExplanation ? (
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowExplanation(true)}
                      disabled={answers[sampleQuestions[currentQuestion].id] === undefined}
                    >
                      Check Answer
                    </Button>
                  ) : (
                    <Button variant="hero" className="flex-1" onClick={handleNext}>
                      {currentQuestion < sampleQuestions.length - 1 ? "Next Question" : "View Results"}
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Results State */}
          {state === "results" && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <Card variant="glass" className="p-8">
                <div className="w-20 h-20 bg-gradient-to-br from-success to-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-success/25">
                  <Trophy className="w-10 h-10 text-primary-foreground" />
                </div>

                <h2 className="font-display text-2xl font-bold mb-2">Test Complete!</h2>
                <p className="text-muted-foreground mb-8">Great job on completing the mock test</p>

                <div className="flex justify-center gap-8 mb-8">
                  <div className="text-center">
                    <p className="text-4xl font-display font-bold text-success">{calculateScore()}/{sampleQuestions.length}</p>
                    <p className="text-sm text-muted-foreground">Correct Answers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-display font-bold">{Math.round((calculateScore() / sampleQuestions.length) * 100)}%</p>
                    <p className="text-sm text-muted-foreground">Score</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setState("setup");
                      setCurrentQuestion(0);
                      setAnswers({});
                      setShowExplanation(false);
                    }}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    New Test
                  </Button>
                  <Button variant="hero" className="flex-1" asChild>
                    <Link to="/dashboard">Back to Dashboard</Link>
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default MockTests;
