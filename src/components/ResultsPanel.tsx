import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Lightbulb, XCircle } from "lucide-react";
import TrustGauge from "./TrustGauge";
import RiskCard from "./RiskCard";
import type { AnalysisResult } from "@/lib/analysisEngine";

interface ResultsPanelProps {
  result: AnalysisResult | null;
  isAnalyzing: boolean;
}

const ResultsPanel = ({ result, isAnalyzing }: ResultsPanelProps) => {
  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="w-16 h-16 rounded-full border-2 border-primary/20 border-t-primary"
        />
        <motion.p
          className="mt-6 text-muted-foreground font-mono text-sm"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          Analyzing opportunity...
        </motion.p>
        <div className="mt-4 space-y-2 text-xs text-muted-foreground/60">
          {["Scanning message patterns", "Verifying links", "Checking contacts"].map((t, i) => (
            <motion.p
              key={t}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.6 }}
              className="flex items-center gap-2"
            >
              <motion.span
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 1, delay: i * 0.3 }}
                className="w-1.5 h-1.5 rounded-full bg-primary"
              />
              {t}
            </motion.p>
          ))}
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
        <div className="w-20 h-20 rounded-2xl bg-muted/50 border border-border flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8 text-muted-foreground/40" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-1">No Analysis Yet</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Enter job or internship details on the left to start verification
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Trust Score */}
      <div className="flex justify-center py-4">
        <TrustGauge score={result.overallScore} level={result.riskLevel} />
      </div>

      {/* Explanation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className={`rounded-xl p-4 border ${
          result.riskLevel === "safe"
            ? "border-safe/20 bg-safe/5"
            : result.riskLevel === "warning"
            ? "border-warning/20 bg-warning/5"
            : "border-destructive/20 bg-destructive/5"
        }`}
      >
        <div className="flex items-start gap-3">
          {result.riskLevel === "safe" ? (
            <CheckCircle2 className="w-5 h-5 text-safe flex-shrink-0 mt-0.5" />
          ) : result.riskLevel === "warning" ? (
            <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
          ) : (
            <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          )}
          <p className="text-sm text-foreground leading-relaxed">{result.explanation}</p>
        </div>
      </motion.div>

      {/* Highlighted Phrases */}
      {result.highlightedPhrases.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="space-y-2"
        >
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Flagged Phrases
          </h4>
          <div className="flex flex-wrap gap-2">
            {result.highlightedPhrases.map((h, i) => (
              <span
                key={i}
                className="px-2.5 py-1 text-xs rounded-lg bg-destructive/10 text-destructive border border-destructive/20 font-mono"
                title={h.reason}
              >
                "{h.text}"
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Risk Breakdown */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Risk Breakdown
        </h4>
        <div className="space-y-2">
          {result.risks.map((risk, i) => (
            <RiskCard key={risk.category} risk={risk} index={i} />
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="space-y-2"
      >
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <Lightbulb className="w-3.5 h-3.5" /> Recommendations
        </h4>
        <ul className="space-y-1.5">
          {result.recommendations.map((r, i) => (
            <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
              <span className="mt-1.5 w-1 h-1 rounded-full bg-primary flex-shrink-0" />
              {r}
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
};

export default ResultsPanel;
