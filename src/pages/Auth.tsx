import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Mail, Lock, User, Sparkles, ArrowRight, Chrome } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(searchParams.get("mode") === "signup");
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate auth - in production this would connect to Supabase
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: isSignUp ? "Account created!" : "Welcome back!",
        description: isSignUp ? "Let's set up your profile." : "Redirecting to dashboard...",
      });
      navigate(isSignUp ? "/onboarding" : "/dashboard");
    }, 1500);
  };

  const handleGoogleAuth = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Google Sign In",
        description: "Connecting with Google...",
      });
      navigate(isSignUp ? "/onboarding" : "/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 mesh-background" />
      <div className="floating-orb w-96 h-96 bg-primary/30 -top-48 -left-48 animate-float" />
      <div className="floating-orb w-72 h-72 bg-accent/30 bottom-0 -right-36 animate-float-delayed" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8 group">
          <div className="relative">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/25 group-hover:shadow-xl group-hover:shadow-primary/30 transition-all duration-300">
              <BookOpen className="w-6 h-6 text-primary-foreground" />
            </div>
            <Sparkles className="w-4 h-4 text-accent absolute -top-1 -right-1 animate-pulse" />
          </div>
          <span className="font-display font-bold text-2xl">StudyAI</span>
        </Link>

        <Card variant="glass" className="backdrop-blur-2xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="font-display text-2xl">
              {isSignUp ? "Create Your Account" : "Welcome Back"}
            </CardTitle>
            <CardDescription>
              {isSignUp 
                ? "Join thousands of students learning smarter" 
                : "Continue your learning journey"
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {/* Google Auth */}
            <Button 
              variant="outline" 
              className="w-full mb-6 h-12"
              onClick={handleGoogleAuth}
              disabled={isLoading}
            >
              <Chrome className="w-5 h-5 mr-2" />
              Continue with Google
            </Button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Enter your name"
                      className="pl-10"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    minLength={8}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                variant="hero" 
                className="w-full h-12"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <>
                    {isSignUp ? "Create Account" : "Sign In"}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                type="button"
                className="text-primary font-medium hover:underline"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp ? "Sign in" : "Sign up"}
              </button>
            </p>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
