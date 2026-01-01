import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    positive: boolean;
  };
  color?: "primary" | "accent" | "success";
}

export const StatCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend,
  color = "primary" 
}: StatCardProps) => {
  const colorClasses = {
    primary: {
      bg: "from-primary/10 to-primary/5",
      icon: "from-primary to-primary-glow",
      shadow: "shadow-primary/20",
    },
    accent: {
      bg: "from-accent/10 to-accent/5",
      icon: "from-accent to-amber-400",
      shadow: "shadow-accent/20",
    },
    success: {
      bg: "from-success/10 to-success/5",
      icon: "from-success to-emerald-400",
      shadow: "shadow-success/20",
    },
  };

  const colors = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={`stat-card bg-gradient-to-br ${colors.bg}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${colors.icon} rounded-xl flex items-center justify-center shadow-lg ${colors.shadow}`}>
          <Icon className="w-6 h-6 text-primary-foreground" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-medium ${trend.positive ? 'text-success' : 'text-destructive'}`}>
            <span>{trend.positive ? '↑' : '↓'}</span>
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-3xl font-display font-bold mb-1">{value}</h3>
        <p className="text-sm text-muted-foreground">{title}</p>
        {subtitle && (
          <p className="text-xs text-muted-foreground/70 mt-1">{subtitle}</p>
        )}
      </div>
    </motion.div>
  );
};
