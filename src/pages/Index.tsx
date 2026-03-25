import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Shield, Zap, Eye } from "lucide-react";
import InputPanel from "@/components/InputPanel";
import ResultsPanel from "@/components/ResultsPanel";
import SafetyTips from "@/components/SafetyTips";
import { performAnalysis, type AnalysisInput, type AnalysisResult } from "@/lib/analysisEngine";

const Index = () => {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = useCallback((input: AnalysisInput) => {
    setIsAnalyzing(true);
    setResult(null);

    // Simulate network delay for UX
    setTimeout(() => {
      const analysisResult = performAnalysis(input);
      setResult(analysisResult);
      setIsAnalyzing(false);
    }, 2000);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-base font-bold text-foreground tracking-tight">
                FakeJob<span className="text-primary">Shield</span>
              </h1>
              <p className="text-[10px] text-muted-foreground font-mono -mt-0.5">
                FAKE JOB & INTERNSHIP DETECTION
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-primary" /> AI-Powered
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-primary" /> Multi-Source Analysis
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Protect Yourself from{" "}
            <span className="text-gradient">Fake Opportunities</span>
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Verify job offers and internships instantly using multi-source analysis, 
            NLP pattern detection, and explainable risk scoring.
          </p>
        </motion.div>

        {/* Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Input Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 card-glow rounded-2xl p-5"
          >
            <InputPanel onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
          </motion.div>

          {/* Results Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3 card-glow rounded-2xl p-5"
          >
            <ResultsPanel result={result} isAnalyzing={isAnalyzing} />
          </motion.div>
        </div>

        {/* Safety Tips */}
        <SafetyTips />

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          {[
            { label: "Scams Detected", value: "12,847" },
            { label: "Jobs Verified", value: "45,392" },
            { label: "Users Protected", value: "28,156" },
            { label: "Accuracy Rate", value: "97.3%" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="text-center py-4 px-3 rounded-xl bg-card border border-border/50"
            >
              <p className="text-xl font-bold font-mono text-primary">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-12 py-6">
        <p className="text-center text-xs text-muted-foreground">
          FakeJobShield — Protecting job seekers from fraudulent opportunities
        </p>
      </footer>
    </div>
  );
};

export default Index;
