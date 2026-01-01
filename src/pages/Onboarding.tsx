import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  GraduationCap, 
  Target, 
  Users, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  Sparkles
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

type Step = "course" | "exam" | "preference" | "classroom";

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>("course");
  const [selections, setSelections] = useState({
    course: "",
    exam: "",
    preference: "",
    classroomAction: "",
    classroomCode: "",
  });

  const steps: Step[] = ["course", "exam", "preference", "classroom"];
  const currentIndex = steps.indexOf(currentStep);

  const courses = [
    { id: "engineering", label: "Engineering", icon: "⚙️" },
    { id: "medical", label: "Medical", icon: "🩺" },
    { id: "science", label: "Science", icon: "🔬" },
    { id: "commerce", label: "Commerce", icon: "📊" },
    { id: "arts", label: "Arts", icon: "🎨" },
    { id: "law", label: "Law", icon: "⚖️" },
  ];

  const exams = [
    { id: "jee", label: "JEE Main/Advanced", icon: "🎯" },
    { id: "neet", label: "NEET", icon: "💉" },
    { id: "gate", label: "GATE", icon: "🚪" },
    { id: "cat", label: "CAT/MBA", icon: "📈" },
    { id: "upsc", label: "UPSC", icon: "🏛️" },
    { id: "other", label: "Other Exams", icon: "📝" },
  ];

  const preferences = [
    { id: "revision", label: "Quick Revision", description: "Short, focused notes for quick review", icon: "⚡" },
    { id: "detailed", label: "Detailed Study", description: "Comprehensive notes with examples", icon: "📚" },
    { id: "visual", label: "Visual Learning", description: "Diagrams, charts, and infographics", icon: "🎨" },
  ];

  const handleNext = () => {
    const stepIndex = steps.indexOf(currentStep);
    if (stepIndex < steps.length - 1) {
      setCurrentStep(steps[stepIndex + 1]);
    } else {
      // Complete onboarding
      toast({
        title: "Welcome aboard! 🎉",
        description: "Your personalized learning journey begins now.",
      });
      navigate("/dashboard");
    }
  };

  const handleBack = () => {
    const stepIndex = steps.indexOf(currentStep);
    if (stepIndex > 0) {
      setCurrentStep(steps[stepIndex - 1]);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case "course":
        return selections.course !== "";
      case "exam":
        return selections.exam !== "";
      case "preference":
        return selections.preference !== "";
      case "classroom":
        if (selections.classroomAction === "") return false;
        if (selections.classroomAction === "join") return selections.classroomCode.length >= 6;
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 mesh-background" />
      <div className="floating-orb w-96 h-96 bg-primary/30 -top-48 -right-48 animate-float" />
      <div className="floating-orb w-72 h-72 bg-accent/30 bottom-0 -left-36 animate-float-delayed" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-2xl relative z-10"
      >
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                    index <= currentIndex
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {index < currentIndex ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 h-1 mx-1 rounded-full transition-colors ${
                      index < currentIndex ? "bg-primary" : "bg-secondary"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Step {currentIndex + 1} of {steps.length}
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card variant="glass" className="backdrop-blur-2xl">
              <CardHeader className="text-center">
                {currentStep === "course" && (
                  <>
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/25">
                      <BookOpen className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <CardTitle className="font-display text-2xl">What are you studying?</CardTitle>
                    <CardDescription>Select your primary field of study</CardDescription>
                  </>
                )}
                {currentStep === "exam" && (
                  <>
                    <div className="w-16 h-16 bg-gradient-to-br from-accent to-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-accent/25">
                      <GraduationCap className="w-8 h-8 text-accent-foreground" />
                    </div>
                    <CardTitle className="font-display text-2xl">Preparing for an exam?</CardTitle>
                    <CardDescription>We'll tailor content to your target exam</CardDescription>
                  </>
                )}
                {currentStep === "preference" && (
                  <>
                    <div className="w-16 h-16 bg-gradient-to-br from-success to-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-success/25">
                      <Target className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <CardTitle className="font-display text-2xl">How do you learn best?</CardTitle>
                    <CardDescription>Choose your preferred study style</CardDescription>
                  </>
                )}
                {currentStep === "classroom" && (
                  <>
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/25">
                      <Users className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <CardTitle className="font-display text-2xl">Study with friends?</CardTitle>
                    <CardDescription>Join or create a study classroom</CardDescription>
                  </>
                )}
              </CardHeader>

              <CardContent>
                {currentStep === "course" && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {courses.map((course) => (
                      <button
                        key={course.id}
                        onClick={() => setSelections({ ...selections, course: course.id })}
                        className={`p-4 rounded-xl border-2 text-center transition-all hover:shadow-lg ${
                          selections.course === course.id
                            ? "border-primary bg-primary/10 shadow-md"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <span className="text-2xl block mb-2">{course.icon}</span>
                        <span className="font-medium text-sm">{course.label}</span>
                      </button>
                    ))}
                  </div>
                )}

                {currentStep === "exam" && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {exams.map((exam) => (
                      <button
                        key={exam.id}
                        onClick={() => setSelections({ ...selections, exam: exam.id })}
                        className={`p-4 rounded-xl border-2 text-center transition-all hover:shadow-lg ${
                          selections.exam === exam.id
                            ? "border-primary bg-primary/10 shadow-md"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <span className="text-2xl block mb-2">{exam.icon}</span>
                        <span className="font-medium text-sm">{exam.label}</span>
                      </button>
                    ))}
                  </div>
                )}

                {currentStep === "preference" && (
                  <div className="space-y-3">
                    {preferences.map((pref) => (
                      <button
                        key={pref.id}
                        onClick={() => setSelections({ ...selections, preference: pref.id })}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all hover:shadow-lg flex items-center gap-4 ${
                          selections.preference === pref.id
                            ? "border-primary bg-primary/10 shadow-md"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <span className="text-3xl">{pref.icon}</span>
                        <div>
                          <span className="font-medium block">{pref.label}</span>
                          <span className="text-sm text-muted-foreground">{pref.description}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {currentStep === "classroom" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setSelections({ ...selections, classroomAction: "create" })}
                        className={`p-6 rounded-xl border-2 text-center transition-all hover:shadow-lg ${
                          selections.classroomAction === "create"
                            ? "border-primary bg-primary/10 shadow-md"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <Sparkles className="w-8 h-8 mx-auto mb-2 text-primary" />
                        <span className="font-medium block">Create New</span>
                        <span className="text-xs text-muted-foreground">Start a study group</span>
                      </button>
                      <button
                        onClick={() => setSelections({ ...selections, classroomAction: "join" })}
                        className={`p-6 rounded-xl border-2 text-center transition-all hover:shadow-lg ${
                          selections.classroomAction === "join"
                            ? "border-primary bg-primary/10 shadow-md"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <Users className="w-8 h-8 mx-auto mb-2 text-accent" />
                        <span className="font-medium block">Join Existing</span>
                        <span className="text-xs text-muted-foreground">Enter classroom code</span>
                      </button>
                    </div>

                    {selections.classroomAction === "join" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="space-y-2"
                      >
                        <label className="text-sm font-medium">Classroom Code</label>
                        <Input
                          placeholder="Enter 6-digit code"
                          value={selections.classroomCode}
                          onChange={(e) => setSelections({ ...selections, classroomCode: e.target.value })}
                          className="text-center text-lg tracking-widest"
                          maxLength={6}
                        />
                      </motion.div>
                    )}

                    <button
                      onClick={() => setSelections({ ...selections, classroomAction: "skip" })}
                      className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Skip for now, I'll study solo
                    </button>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex gap-3 mt-8">
                  {currentIndex > 0 && (
                    <Button variant="outline" onClick={handleBack} className="flex-1">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                  )}
                  <Button
                    variant="hero"
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="flex-1"
                  >
                    {currentIndex === steps.length - 1 ? "Get Started" : "Continue"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Onboarding;
