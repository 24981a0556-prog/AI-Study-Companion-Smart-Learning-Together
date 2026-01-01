import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Send,
  MessageCircle,
  Bot,
  User,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  Copy,
  RefreshCw,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const Doubts = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi! I'm your AI study companion. Ask me anything about your studies - I'll explain concepts, solve problems, and help you understand difficult topics. What would you like to learn today?",
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, string> = {
        default: `Great question! Let me break this down for you.

**Understanding "${input}"**

This is an important concept that forms the foundation of many advanced topics. Here's a step-by-step explanation:

1. **Core Principle**: At its heart, this concept deals with fundamental relationships between key variables.

2. **How it works**: When you apply this concept, you're essentially connecting theory to practice through systematic analysis.

3. **Example**: 
   - Consider a real-world scenario where this applies
   - Apply the basic formula or principle
   - Observe the outcome and verify your understanding

4. **Key Takeaway**: The most important thing to remember is that practice and application are essential for mastery.

Would you like me to:
- Explain any part in more detail?
- Give you a practice problem?
- Connect this to related topics?`,
      };

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responses.default,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const quickQuestions = [
    "Explain photosynthesis",
    "What is Newton's second law?",
    "How to solve quadratic equations?",
    "Difference between mitosis and meiosis",
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
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
                <div className="w-10 h-10 bg-gradient-to-br from-accent to-amber-400 rounded-xl flex items-center justify-center shadow-lg shadow-accent/25">
                  <MessageCircle className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <h1 className="font-display font-bold text-lg">AI Doubt Solver</h1>
                  <p className="text-xs text-muted-foreground">Get instant explanations</p>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setMessages([messages[0]])}>
              <RefreshCw className="w-4 h-4 mr-2" />
              New Chat
            </Button>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6 max-w-3xl">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 mb-6 ${message.role === "user" ? "justify-end" : ""}`}
              >
                {message.role === "assistant" && (
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-amber-400 flex items-center justify-center flex-shrink-0 shadow-lg shadow-accent/25">
                    <Bot className="w-5 h-5 text-accent-foreground" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl p-4 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border"
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </div>
                  {message.role === "assistant" && (
                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border/50">
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <ThumbsUp className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <ThumbsDown className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 px-2"
                        onClick={() => {
                          navigator.clipboard.writeText(message.content);
                          toast({ title: "Copied!" });
                        }}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
                {message.role === "user" && (
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4 mb-6"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-amber-400 flex items-center justify-center flex-shrink-0 shadow-lg shadow-accent/25">
                <Bot className="w-5 h-5 text-accent-foreground" />
              </div>
              <div className="bg-card border border-border rounded-2xl p-4">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </motion.div>
          )}

          {messages.length === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              <p className="text-sm text-muted-foreground mb-4">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => setInput(q)}
                    className="px-4 py-2 rounded-full bg-secondary hover:bg-secondary/80 text-sm transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="sticky bottom-0 bg-background/80 backdrop-blur-xl border-t border-border">
        <div className="container mx-auto px-4 py-4 max-w-3xl">
          <div className="relative flex items-center gap-2">
            <div className="flex-1 relative">
              <Input
                placeholder="Ask your doubt..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                className="pr-12 h-12"
              />
              <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            </div>
            <Button
              variant="hero"
              size="icon"
              className="h-12 w-12"
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Doubts;
