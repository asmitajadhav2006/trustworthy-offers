import { motion } from "framer-motion";
import { Info } from "lucide-react";
import type { AnalysisResult } from "@/lib/analysisEngine";

interface TransparencyBannerProps {
  result: AnalysisResult;
}

const TransparencyBanner = ({ result }: TransparencyBannerProps) => {
  const notes = [
    "Results are based on heuristic pattern matching — not a definitive verdict",
    "Always verify independently through official company channels",
  ];

  if (result.phoneIntelligence?.transparencyNotes) {
    notes.push(...result.phoneIntelligence.transparencyNotes);
  }

  // Deduplicate
  const unique = [...new Set(notes)];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.6 }}
      className="rounded-xl border border-border/50 bg-muted/30 p-3 space-y-1.5"
    >
      <h5 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
        <Info className="w-3 h-3" /> Transparency & Disclaimers
      </h5>
      {unique.map((note, i) => (
        <p key={i} className="text-[10px] text-muted-foreground/70 flex items-start gap-1.5">
          <span className="mt-1 w-1 h-1 rounded-full bg-muted-foreground/30 flex-shrink-0" />
          {note}
        </p>
      ))}
    </motion.div>
  );
};

export default TransparencyBanner;
