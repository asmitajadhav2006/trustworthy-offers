import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Trash2, RefreshCw, ChevronDown, ChevronUp, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AnalysisInput, AnalysisResult } from "@/lib/analysisEngine";

export interface SearchHistoryEntry {
  id: string;
  input: AnalysisInput;
  result: AnalysisResult;
  timestamp: number;
}

const STORAGE_KEY = "fakejobshield_history";

export function saveToHistory(input: AnalysisInput, result: AnalysisResult) {
  const entries = getHistory();
  const entry: SearchHistoryEntry = {
    id: crypto.randomUUID(),
    input,
    result,
    timestamp: Date.now(),
  };
  entries.unshift(entry);
  // Keep last 50 entries
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, 50)));
}

export function getHistory(): SearchHistoryEntry[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function deleteFromHistory(id: string) {
  const entries = getHistory().filter((e) => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function clearHistory() {
  localStorage.removeItem(STORAGE_KEY);
}

interface SearchHistoryProps {
  onRecheck: (input: AnalysisInput) => void;
}

const SearchHistory = ({ onRecheck }: SearchHistoryProps) => {
  const [entries, setEntries] = useState<SearchHistoryEntry[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setEntries(getHistory());
  }, []);

  const refreshEntries = () => setEntries(getHistory());

  const handleDelete = (id: string) => {
    deleteFromHistory(id);
    refreshEntries();
  };

  const handleClear = () => {
    clearHistory();
    refreshEntries();
  };

  const riskBadge = (level: string) => {
    const config = {
      safe: { text: "Safe", cls: "bg-safe/10 text-safe border-safe/30" },
      warning: { text: "Suspicious", cls: "bg-warning/10 text-warning border-warning/30" },
      danger: { text: "Fraud", cls: "bg-destructive/10 text-destructive border-destructive/30" },
    };
    const c = config[level as keyof typeof config] || config.danger;
    return (
      <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${c.cls}`}>
        {c.text}
      </span>
    );
  };

  if (entries.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-8"
    >
      <button
        onClick={() => { setIsOpen(!isOpen); refreshEntries(); }}
        className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 hover:text-foreground transition-colors w-full"
      >
        <Clock className="w-4 h-4 text-primary" />
        Search History ({entries.length})
        {isOpen ? <ChevronUp className="w-4 h-4 ml-auto" /> : <ChevronDown className="w-4 h-4 ml-auto" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden space-y-2"
          >
            <div className="flex justify-end mb-2">
              <Button variant="ghost" size="sm" onClick={handleClear} className="text-xs text-muted-foreground hover:text-destructive">
                <Trash2 className="w-3 h-3 mr-1" /> Clear All
              </Button>
            </div>

            {entries.slice(0, 10).map((entry) => {
              const preview = entry.input.message?.slice(0, 60) || entry.input.company || entry.input.url || entry.input.email || "Analysis";
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/50 hover:border-primary/20 transition-colors"
                >
                  <Shield className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground truncate">{preview}{preview.length >= 60 ? "..." : ""}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(entry.timestamp).toLocaleDateString()} {new Date(entry.timestamp).toLocaleTimeString()} • Score: {entry.result.overallScore}
                    </p>
                  </div>
                  {riskBadge(entry.result.riskLevel)}
                  <div className="flex gap-1">
                    <button
                      onClick={() => onRecheck(entry.input)}
                      className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                      title="Re-check"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SearchHistory;
