import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, MessageSquare, Link, Phone, Mail, Building2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import type { AnalysisInput } from "@/lib/analysisEngine";

interface InputPanelProps {
  onAnalyze: (input: AnalysisInput) => void;
  isAnalyzing: boolean;
  initialInput?: AnalysisInput | null;
}

const InputPanel = ({ onAnalyze, isAnalyzing, initialInput }: InputPanelProps) => {
  const [input, setInput] = useState<AnalysisInput>({
    message: "",
    url: "",
    phone: "",
    email: "",
    company: "",
  });

  useEffect(() => {
    if (initialInput) {
      setInput(initialInput);
    }
  }, [initialInput]);

  const handleSubmit = () => {
    onAnalyze(input);
  };

  const hasInput = Object.values(input).some((v) => v.trim());

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Verify Opportunity</h2>
          <p className="text-xs text-muted-foreground">Paste any details you have</p>
        </div>
      </div>

      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Message */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5" /> Job/Internship Message
          </label>
          <Textarea
            placeholder="Paste the job offer message, WhatsApp text, or email content..."
            value={input.message}
            onChange={(e) => setInput((p) => ({ ...p, message: e.target.value }))}
            className="min-h-[100px] bg-muted/50 border-border/50 text-foreground placeholder:text-muted-foreground/50 resize-none focus:border-primary/50 focus:ring-primary/20"
          />
        </div>

        {/* URL */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <Link className="w-3.5 h-3.5" /> Job URL
          </label>
          <Input
            placeholder="https://example.com/job-posting"
            value={input.url}
            onChange={(e) => setInput((p) => ({ ...p, url: e.target.value }))}
            className="bg-muted/50 border-border/50 text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-primary/20"
          />
        </div>

        {/* Company */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5" /> Company Name
          </label>
          <Input
            placeholder="Acme Corporation"
            value={input.company}
            onChange={(e) => setInput((p) => ({ ...p, company: e.target.value }))}
            className="bg-muted/50 border-border/50 text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-primary/20"
          />
        </div>

        {/* Email & Phone row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" /> Email
            </label>
            <Input
              placeholder="hr@company.com"
              value={input.email}
              onChange={(e) => setInput((p) => ({ ...p, email: e.target.value }))}
              className="bg-muted/50 border-border/50 text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-primary/20"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" /> Phone
            </label>
            <Input
              placeholder="+1 234 567 8900"
              value={input.phone}
              onChange={(e) => setInput((p) => ({ ...p, phone: e.target.value }))}
              className="bg-muted/50 border-border/50 text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-primary/20"
            />
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!hasInput || isAnalyzing}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold h-11 glow-primary"
        >
          {isAnalyzing ? (
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                <Search className="w-4 h-4" />
              </motion.div>
              Analyzing...
            </motion.div>
          ) : (
            <span className="flex items-center gap-2">
              <Search className="w-4 h-4" /> Analyze Opportunity
            </span>
          )}
        </Button>
      </motion.div>
    </div>
  );
};

export default InputPanel;
