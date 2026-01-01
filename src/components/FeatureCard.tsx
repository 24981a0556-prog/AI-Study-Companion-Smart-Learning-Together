import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: "primary" | "accent" | "success";
  features: string[];
  onClick?: () => void;
}

export const FeatureCard = ({ 
  title, 
  description, 
  icon: Icon, 
  color,
  features,
  onClick 
}: FeatureCardProps) => {
  const colorClasses = {
    primary: {
      bg: "from-primary to-primary-glow",
      shadow: "shadow-primary/25",
      badge: "bg-primary/10 text-primary",
    },
    accent: {
      bg: "from-accent to-amber-400",
      shadow: "shadow-accent/25",
      badge: "bg-accent/10 text-accent",
    },
    success: {
      bg: "from-success to-emerald-400",
      shadow: "shadow-success/25",
      badge: "bg-success/10 text-success",
    },
  };

  const colors = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="feature-card group"
    >
      <div className={`w-14 h-14 bg-gradient-to-br ${colors.bg} rounded-2xl flex items-center justify-center shadow-lg ${colors.shadow} mb-6`}>
        <Icon className="w-7 h-7 text-primary-foreground" />
      </div>

      <h3 className="text-xl font-display font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6">{description}</p>

      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-sm">
            <span className={`w-5 h-5 rounded-full ${colors.badge} flex items-center justify-center text-xs`}>
              ✓
            </span>
            {feature}
          </li>
        ))}
      </ul>

      <Button 
        variant="ghost" 
        className="group/btn p-0 h-auto font-medium"
        onClick={onClick}
      >
        Try it now
        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
      </Button>
    </motion.div>
  );
};
