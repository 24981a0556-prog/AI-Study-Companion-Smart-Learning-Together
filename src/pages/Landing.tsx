import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { FeatureCard } from "@/components/FeatureCard";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FileText, 
  MessageCircle, 
  ClipboardCheck, 
  Users, 
  Flame, 
  Sparkles,
  ArrowRight,
  GraduationCap,
  Target,
  Zap
} from "lucide-react";
import heroImage from "@/assets/hero-illustration.png";

const Landing = () => {
  const features = [
    {
      title: "AI Notes Generator",
      description: "Generate smart revision notes, exam summaries, or detailed explanations instantly.",
      icon: FileText,
      color: "primary" as const,
      features: [
        "Last-minute revision notes",
        "Exam-focused summaries", 
        "Visual learning aids",
        "Topic-wise organization"
      ]
    },
    {
      title: "AI Doubt Solver",
      description: "Get instant clarification on any concept with step-by-step explanations.",
      icon: MessageCircle,
      color: "accent" as const,
      features: [
        "24/7 AI tutor availability",
        "Simple explanations",
        "Practice examples",
        "Follow-up questions"
      ]
    },
    {
      title: "AI Mock Tests",
      description: "Practice with AI-generated tests tailored to your level and topics.",
      icon: ClipboardCheck,
      color: "success" as const,
      features: [
        "Topic-wise questions",
        "Difficulty selection",
        "Instant evaluation",
        "Detailed explanations"
      ]
    }
  ];

  const stats = [
    { value: "10K+", label: "Active Students" },
    { value: "500+", label: "Study Groups" },
    { value: "1M+", label: "Notes Generated" },
    { value: "98%", label: "Satisfaction" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 lg:pt-32 lg:pb-24 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 mesh-background" />
        <div className="floating-orb w-96 h-96 bg-primary/30 -top-48 -left-48 animate-float" />
        <div className="floating-orb w-72 h-72 bg-accent/30 top-1/3 -right-36 animate-float-delayed" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">AI-Powered Learning Platform</span>
              </div>
              
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Smart Learning,{" "}
                <span className="gradient-text">Together</span>
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
                Prepare smarter and faster with personalized AI notes, instant doubt resolution, 
                mock tests, study streaks, and collaborative classrooms with friends.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button variant="hero" size="xl" asChild>
                  <Link to="/auth?mode=signup">
                    Start Learning Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button variant="heroOutline" size="xl" asChild>
                  <Link to="/features">
                    Explore Features
                  </Link>
                </Button>
              </div>

              {/* Social Proof */}
              <div className="mt-10 flex items-center gap-6 justify-center lg:justify-start">
                <div className="flex -space-x-3">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-background flex items-center justify-center text-sm font-medium"
                      style={{ zIndex: 5 - i }}
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-accent">★</span>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">Loved by 10,000+ students</p>
                </div>
              </div>
            </motion.div>

            {/* Right Content - Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                <img 
                  src={heroImage} 
                  alt="AI Study Companion Illustration" 
                  className="w-full max-w-lg mx-auto rounded-3xl"
                />
                
                {/* Floating Cards */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="absolute -left-4 top-1/4 glass-card rounded-xl p-4 shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-accent to-amber-400 rounded-lg flex items-center justify-center">
                      <Flame className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <div>
                      <p className="font-display font-bold">15 Day Streak!</p>
                      <p className="text-xs text-muted-foreground">Keep it up!</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  className="absolute -right-4 bottom-1/4 glass-card rounded-xl p-4 shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-success to-emerald-400 rounded-lg flex items-center justify-center">
                      <Target className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-display font-bold">92% Score</p>
                      <p className="text-xs text-muted-foreground">Mock Test</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-border bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl md:text-4xl font-display font-bold gradient-text">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-4">
              <Zap className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent">AI-Powered Features</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to <span className="gradient-text">Excel</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our AI tools are designed to help you learn faster, understand deeper, and achieve more.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Classroom CTA Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 mesh-background opacity-50" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="glass-card rounded-3xl p-8 md:p-12 lg:p-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-glow rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-primary/25">
                <Users className="w-10 h-10 text-primary-foreground" />
              </div>
              
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Learn Better, <span className="gradient-text-accent">Together</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Create private classrooms with friends, share notes, compete on leaderboards, 
                and stay motivated with group study goals.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/auth?mode=signup">
                    <GraduationCap className="w-5 h-5 mr-2" />
                    Create Classroom
                  </Link>
                </Button>
                <Button variant="glass" size="lg" asChild>
                  <Link to="/classrooms">
                    Join Existing
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display font-bold">StudyAI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 StudyAI. Built for students, by students.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
