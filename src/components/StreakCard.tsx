import { Flame, Trophy, Target, Zap } from "lucide-react";
import { motion } from "framer-motion";

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
  todayComplete: boolean;
}

export const StreakCard = ({ currentStreak, longestStreak, todayComplete }: StreakCardProps) => {
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const completedDays = [true, true, true, true, todayComplete, false, false]; // Example data

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-6 relative overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent/20 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-accent to-amber-400 rounded-xl flex items-center justify-center shadow-lg shadow-accent/30">
              <Flame className="w-6 h-6 text-accent-foreground" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-lg">Study Streak</h3>
              <p className="text-sm text-muted-foreground">Keep the momentum!</p>
            </div>
          </div>
          <div className="streak-badge">
            <Zap className="w-4 h-4" />
            <span>{currentStreak} days</span>
          </div>
        </div>

        {/* Week Progress */}
        <div className="flex gap-2 mb-6">
          {weekDays.map((day, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-medium text-sm transition-all ${
                  completedDays[index]
                    ? 'bg-gradient-to-br from-accent to-amber-400 text-accent-foreground shadow-lg shadow-accent/25'
                    : index === 4 && !todayComplete
                    ? 'bg-secondary border-2 border-dashed border-accent/50 text-muted-foreground'
                    : 'bg-secondary text-muted-foreground'
                }`}
              >
                {completedDays[index] ? '✓' : day}
              </motion.div>
              <span className="text-xs text-muted-foreground">{day}</span>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-secondary/50 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Trophy className="w-4 h-4 text-accent" />
              <span className="text-2xl font-display font-bold">{longestStreak}</span>
            </div>
            <p className="text-xs text-muted-foreground">Longest Streak</p>
          </div>
          <div className="bg-secondary/50 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-2xl font-display font-bold">7</span>
            </div>
            <p className="text-xs text-muted-foreground">Weekly Goal</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
