import { motion } from "framer-motion";
import { ShieldCheck, AlertTriangle, Ban, BookOpen } from "lucide-react";

const tips = [
  { icon: Ban, text: "Never pay for a job or internship — legitimate employers don't charge fees." },
  { icon: ShieldCheck, text: "Always verify the company on LinkedIn and their official website." },
  { icon: AlertTriangle, text: "Be wary of offers that sound too good to be true — they usually are." },
  { icon: BookOpen, text: "Research the recruiter's identity independently before sharing personal info." },
  { icon: Ban, text: "Avoid sending documents via WhatsApp or personal email addresses." },
  { icon: ShieldCheck, text: "Check for HTTPS and verify the domain spelling on any job posting link." },
];

const SafetyTips = () => {
  return (
    <div className="mt-8">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-primary" /> Safety Tips
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {tips.map((tip, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-start gap-3 p-3 rounded-xl bg-card border border-border/50 hover:border-primary/20 transition-colors"
          >
            <tip.icon className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">{tip.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SafetyTips;
