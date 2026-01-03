import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  FileText,
  ArrowLeft,
  Sparkles,
  Copy,
  Download,
  RefreshCw,
  Zap,
  Loader2,
  Clock,
  Trash2,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Notes = () => {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [noteType, setNoteType] = useState<"revision" | "detailed" | "visual">("revision");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedNotes, setGeneratedNotes] = useState<string | null>(null);
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);
  const [recentNotes, setRecentNotes] = useState<Array<{ id: string; topic: string; style: string; created_at: string }>>([]);
  const [userId, setUserId] = useState<string | null>(null);

  const noteTypes = [
    { id: "revision", label: "Quick Revision", icon: Zap, description: "Concise bullet points" },
    { id: "detailed", label: "Detailed Notes", icon: FileText, description: "Comprehensive content" },
    { id: "visual", label: "Visual Summary", icon: Sparkles, description: "With diagrams & charts" },
  ];

  useEffect(() => {
    checkAuth();
    fetchRecentNotes();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to generate notes",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    setUserId(user.id);
  };

  const fetchRecentNotes = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("notes")
      .select("id, topic, style, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);

    if (!error && data) {
      setRecentNotes(data);
    }
  };

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast({
        title: "Please enter a topic",
        description: "Tell us what you want to learn about",
        variant: "destructive",
      });
      return;
    }

    if (!userId) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to generate notes",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    setIsGenerating(true);
    setGeneratedNotes(null);

    try {
      const { data, error } = await supabase.functions.invoke("ai-study", {
        body: { 
          type: "notes", 
          topic: topic.trim(),
          style: noteType 
        },
      });

      if (error) {
        throw new Error(error.message || "Failed to generate notes");
      }

      if (!data?.content) {
        throw new Error("No content received from AI");
      }

      const generatedContent = data.content;
      setGeneratedNotes(generatedContent);

      // Save to database
      const { data: savedNote, error: saveError } = await supabase
        .from("notes")
        .insert({
          user_id: userId,
          topic: topic.trim(),
          style: noteType,
          content: generatedContent,
        })
        .select("id")
        .single();

      if (saveError) {
        console.error("Error saving note:", saveError);
        toast({
          title: "Notes generated!",
          description: "Generated but couldn't save to database",
        });
      } else {
        setCurrentNoteId(savedNote.id);
        fetchRecentNotes();
        toast({
          title: "Notes generated! 📝",
          description: "Your AI-powered notes are ready and saved",
        });
      }
    } catch (error) {
      console.error("Error generating notes:", error);
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = async () => {
    if (currentNoteId) {
      // Delete the old note before regenerating
      await supabase.from("notes").delete().eq("id", currentNoteId);
      setCurrentNoteId(null);
    }
    handleGenerate();
  };

  const loadNote = async (noteId: string) => {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("id", noteId)
      .single();

    if (!error && data) {
      setTopic(data.topic);
      setNoteType(data.style as typeof noteType);
      setGeneratedNotes(data.content);
      setCurrentNoteId(data.id);
    }
  };

  const deleteNote = async (noteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const { error } = await supabase.from("notes").delete().eq("id", noteId);
    
    if (!error) {
      setRecentNotes(prev => prev.filter(n => n.id !== noteId));
      if (currentNoteId === noteId) {
        setGeneratedNotes(null);
        setCurrentNoteId(null);
      }
      toast({ title: "Note deleted" });
    }
  };

  const handleCopy = () => {
    if (generatedNotes) {
      navigator.clipboard.writeText(generatedNotes);
      toast({ title: "Copied to clipboard!" });
    }
  };

  const handleDownload = () => {
    if (generatedNotes) {
      const blob = new Blob([generatedNotes], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${topic.replace(/\s+/g, "_")}_notes.md`;
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: "Downloaded!" });
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
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
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-glow rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
                  <FileText className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="font-display font-bold text-lg">AI Notes Generator</h1>
                  <p className="text-xs text-muted-foreground">Create smart study notes instantly</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {!generatedNotes ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Topic Input */}
              <Card variant="glass" className="p-8">
                <h2 className="font-display text-xl font-semibold mb-2">What do you want to learn?</h2>
                <p className="text-muted-foreground mb-6">Enter a topic and we'll generate comprehensive notes for you.</p>
                
                <div className="relative">
                  <Input
                    placeholder="e.g., Thermodynamics, Organic Chemistry, Calculus..."
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="text-lg h-14 pr-14"
                    onKeyDown={(e) => e.key === "Enter" && !isGenerating && handleGenerate()}
                    disabled={isGenerating}
                  />
                  <Button
                    variant="hero"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </Card>

              {/* Note Type Selection */}
              <div>
                <h3 className="font-medium mb-4">Choose note style</h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  {noteTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        onClick={() => setNoteType(type.id as typeof noteType)}
                        disabled={isGenerating}
                        className={`p-4 rounded-xl border-2 text-left transition-all hover:shadow-lg disabled:opacity-50 ${
                          noteType === type.id
                            ? "border-primary bg-primary/10 shadow-md"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <Icon className={`w-6 h-6 mb-2 ${noteType === type.id ? "text-primary" : "text-muted-foreground"}`} />
                        <p className="font-medium">{type.label}</p>
                        <p className="text-xs text-muted-foreground">{type.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Recent Notes */}
              <div>
                <h3 className="font-medium mb-4">Recent Notes</h3>
                {recentNotes.length > 0 ? (
                  <div className="space-y-2">
                    {recentNotes.map((note) => (
                      <button
                        key={note.id}
                        onClick={() => loadNote(note.id)}
                        className="w-full flex items-center justify-between p-4 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors text-left group"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{note.topic}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDate(note.created_at)} • {note.style}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => deleteNote(note.id, e)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {["Newton's Laws", "Photosynthesis", "Integration", "Chemical Bonding", "World War II"].map((t) => (
                      <button
                        key={t}
                        onClick={() => setTopic(t)}
                        disabled={isGenerating}
                        className="px-4 py-2 rounded-full bg-secondary hover:bg-secondary/80 text-sm transition-colors disabled:opacity-50"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Loading State */}
              {isGenerating && (
                <Card variant="glass" className="p-8 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                  <p className="font-medium">Generating your notes...</p>
                  <p className="text-sm text-muted-foreground">This may take a few seconds</p>
                </Card>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Actions */}
              <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => { setGeneratedNotes(null); setCurrentNoteId(null); }}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Generate New
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopy}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownload}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleRegenerate} disabled={isGenerating}>
                    {isGenerating ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4 mr-2" />
                    )}
                    Regenerate
                  </Button>
                </div>
              </div>

              {/* Notes Content */}
              <Card variant="glass" className="p-8">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
                    {generatedNotes}
                  </div>
                </div>
              </Card>

              {/* Quick Actions */}
              <div className="flex gap-4 pt-4">
                <Button variant="hero" className="flex-1" asChild>
                  <Link to="/doubts">
                    Ask Follow-up Questions
                  </Link>
                </Button>
                <Button variant="glass" className="flex-1" asChild>
                  <Link to="/tests">
                    Take Practice Test
                  </Link>
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Notes;
