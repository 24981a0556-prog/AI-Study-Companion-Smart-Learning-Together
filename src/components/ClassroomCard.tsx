import { Users, BookOpen, MessageSquare, ChevronRight, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface ClassroomCardProps {
  name: string;
  subject: string;
  memberCount: number;
  activeNow: number;
  isOwner?: boolean;
  progress: number;
}

export const ClassroomCard = ({ 
  name, 
  subject, 
  memberCount, 
  activeNow, 
  isOwner = false,
  progress 
}: ClassroomCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      className="glass-card rounded-2xl p-6 group cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-glow rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
            <BookOpen className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-semibold text-lg">{name}</h3>
              {isOwner && (
                <Crown className="w-4 h-4 text-accent" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">{subject}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-muted-foreground">Group Progress</span>
          <span className="font-medium">{progress}%</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-full bg-gradient-to-r from-primary to-primary-glow rounded-full"
          />
        </div>
      </div>

      {/* Members */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {[...Array(Math.min(4, memberCount))].map((_, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-background flex items-center justify-center text-xs font-medium"
                style={{ zIndex: 4 - i }}
              >
                {String.fromCharCode(65 + i)}
              </div>
            ))}
            {memberCount > 4 && (
              <div className="w-8 h-8 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-xs font-medium">
                +{memberCount - 4}
              </div>
            )}
          </div>
          <span className="text-sm text-muted-foreground">
            <Users className="w-4 h-4 inline mr-1" />
            {memberCount} members
          </span>
        </div>
        
        {activeNow > 0 && (
          <div className="flex items-center gap-1.5 text-sm text-success">
            <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
            {activeNow} active
          </div>
        )}
      </div>
    </motion.div>
  );
};
