import { motion } from "framer-motion";
import { ExternalLink, ShieldCheck, AlertTriangle, XOctagon, TrendingUp } from "lucide-react";
import type { AnalysisResult } from "@/lib/analysisEngine";

interface SmartResultEnhancementProps {
  result: AnalysisResult;
}

const SmartResultEnhancement = ({ result }: SmartResultEnhancementProps) => {
  if (result.riskLevel === "safe") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
        className="space-y-3"
      >
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-safe" /> Verified Resources
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { label: "LinkedIn Jobs", url: "https://linkedin.com/jobs", desc: "Verify on LinkedIn" },
            { label: "Glassdoor", url: "https://glassdoor.com", desc: "Check company reviews" },
            { label: "Indeed", url: "https://indeed.com", desc: "Cross-reference posting" },
            { label: "Company Website", url: "#", desc: "Visit official site" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-2.5 rounded-lg bg-safe/5 border border-safe/20 hover:border-safe/40 transition-colors group"
            >
              <ExternalLink className="w-3.5 h-3.5 text-safe group-hover:scale-110 transition-transform" />
              <div>
                <p className="text-xs font-semibold text-foreground">{link.label}</p>
                <p className="text-[10px] text-muted-foreground">{link.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </motion.div>
    );
  }

  if (result.riskLevel === "warning") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
        className="space-y-3"
      >
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-warning" /> Proceed with Caution
        </h4>
        <div className="rounded-xl border border-warning/20 bg-warning/5 p-4 space-y-2">
          {[
            "Verify the company independently on LinkedIn and official websites",
            "Never share bank details, Aadhaar, SSN, or ID documents before verification",
            "Search for the company name + 'scam' or 'fraud' online",
            "Ask for a formal offer letter on company letterhead",
            "Contact the company HR through their official website, not the provided contact",
          ].map((tip, i) => (
            <p key={i} className="text-xs text-foreground flex items-start gap-2">
              <TrendingUp className="w-3 h-3 text-warning flex-shrink-0 mt-0.5" />
              {tip}
            </p>
          ))}
        </div>
      </motion.div>
    );
  }

  // FRAUD
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.4 }}
      className="space-y-3"
    >
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
        <XOctagon className="w-3.5 h-3.5 text-destructive" /> ⛔ Critical Alert
      </h4>
      <div className="rounded-xl border-2 border-destructive/40 bg-destructive/10 p-4 space-y-3">
        <p className="text-sm font-bold text-destructive">
          🚨 DO NOT PROCEED WITH THIS OPPORTUNITY
        </p>
        <ul className="space-y-1.5">
          {[
            "Do not share any personal information or documents",
            "Do not make any payments or transfers",
            "Block the contact number and email immediately",
            "Report this scam to local cyber crime authorities",
            "If you've already shared details, monitor your accounts closely",
          ].map((warning, i) => (
            <li key={i} className="text-xs text-foreground flex items-start gap-2">
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-destructive flex-shrink-0" />
              {warning}
            </li>
          ))}
        </ul>
        <div className="mt-2 pt-2 border-t border-destructive/20">
          <p className="text-[10px] text-muted-foreground">
            Report scams: cybercrime.gov.in (India) | ic3.gov (US) | actionfraud.police.uk (UK)
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default SmartResultEnhancement;
