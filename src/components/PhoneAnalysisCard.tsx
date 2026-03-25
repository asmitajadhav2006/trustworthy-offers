import { motion } from "framer-motion";
import {
  Phone,
  Smartphone,
  PhoneOff,
  Wifi,
  Shield,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Signal,
  MapPin,
  Radio,
  HelpCircle,
} from "lucide-react";
import type { PhoneIntelligenceResult } from "@/lib/phoneIntelligence";

interface PhoneAnalysisCardProps {
  result: PhoneIntelligenceResult;
}

const PhoneAnalysisCard = ({ result }: PhoneAnalysisCardProps) => {
  const statusConfig = {
    genuine: {
      icon: CheckCircle2,
      color: "text-safe",
      bg: "bg-safe/10",
      border: "border-safe/30",
      label: "Genuine",
      emoji: "✅",
    },
    suspicious: {
      icon: AlertTriangle,
      color: "text-warning",
      bg: "bg-warning/10",
      border: "border-warning/30",
      label: "Suspicious",
      emoji: "⚠️",
    },
    spam: {
      icon: ShieldAlert,
      color: "text-destructive",
      bg: "bg-destructive/10",
      border: "border-destructive/30",
      label: "Spam",
      emoji: "🚫",
    },
    fake: {
      icon: XCircle,
      color: "text-destructive",
      bg: "bg-destructive/10",
      border: "border-destructive/30",
      label: "Fake / VoIP",
      emoji: "❌",
    },
    unknown_risk: {
      icon: HelpCircle,
      color: "text-warning",
      bg: "bg-warning/10",
      border: "border-warning/30",
      label: "Unknown Risk",
      emoji: "🟡",
    },
  };

  const lineTypeConfig: Record<string, { icon: React.ElementType; label: string }> = {
    mobile: { icon: Smartphone, label: "Mobile" },
    voip: { icon: Wifi, label: "VoIP / Virtual" },
    landline: { icon: Phone, label: "Landline" },
    toll_free: { icon: Radio, label: "Toll-Free" },
    premium: { icon: PhoneOff, label: "Premium Rate" },
    unknown: { icon: Signal, label: "Unknown" },
  };

  const { icon: StatusIcon, color, bg, border, label, emoji } = statusConfig[result.status];
  const { icon: LineIcon, label: lineLabel } = lineTypeConfig[result.lineType];

  const spamColor =
    result.spamScore >= 60
      ? "text-destructive"
      : result.spamScore >= 30
      ? "text-warning"
      : "text-muted-foreground";

  const spamBarColor =
    result.spamScore >= 60
      ? "bg-destructive"
      : result.spamScore >= 30
      ? "bg-warning"
      : "bg-muted-foreground/40";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className={`rounded-xl border ${border} ${bg} p-5 space-y-4`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${bg} border ${border}`}>
            <Phone className={`w-5 h-5 ${color}`} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              📱 Phone Analysis
            </h4>
            <p className="text-xs text-muted-foreground font-mono">{result.formatted}</p>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${bg} ${color} border ${border}`}>
          <StatusIcon className="w-3.5 h-3.5" />
          {emoji} {label}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-muted/30 border border-border/50 p-3">
          <div className="flex items-center gap-2 mb-1">
            <LineIcon className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Type</span>
          </div>
          <p className="text-sm font-semibold text-foreground">{lineLabel}</p>
        </div>
        <div className="rounded-lg bg-muted/30 border border-border/50 p-3">
          <div className="flex items-center gap-2 mb-1">
            <Signal className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Carrier</span>
          </div>
          <p className="text-sm font-semibold text-foreground">{result.carrier}</p>
        </div>
        <div className="rounded-lg bg-muted/30 border border-border/50 p-3">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Country</span>
          </div>
          <p className="text-sm font-semibold text-foreground">{result.country}</p>
        </div>
        <div className="rounded-lg bg-muted/30 border border-border/50 p-3">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Reputation</span>
          </div>
          <p className={`text-sm font-semibold font-mono ${
            result.reputationScore >= 60 ? "text-safe" : result.reputationScore >= 30 ? "text-warning" : "text-destructive"
          }`}>
            {Math.round(result.reputationScore)}/100
          </p>
        </div>
      </div>

      {/* Spam Score Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Spam Score</span>
          <span className={`text-sm font-bold font-mono ${spamColor}`}>{result.spamScore}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${spamBarColor}`}
            initial={{ width: 0 }}
            animate={{ width: `${result.spamScore}%` }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
          />
        </div>
        {result.spamReports > 0 ? (
          <p className="text-[10px] text-muted-foreground">
            {result.spamReports} community spam reports found
          </p>
        ) : (
          <p className="text-[10px] text-muted-foreground/60 italic">
            No spam reports found — safety not guaranteed
          </p>
        )}
      </div>

      {/* Findings */}
      <div className="space-y-1.5">
        <h5 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Findings</h5>
        <ul className="space-y-1">
          {result.findings.map((f, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              className="text-xs text-muted-foreground flex items-start gap-2"
            >
              <span className={`mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                result.riskLevel === "safe" ? "bg-safe" : 
                result.riskLevel === "unknown" ? "bg-warning" :
                result.riskLevel === "warning" ? "bg-warning" : "bg-destructive"
              }`} />
              {f}
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Recommendation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className={`rounded-lg p-3 border ${border} ${bg}`}
      >
        <p className="text-xs text-foreground leading-relaxed">
          <span className="font-semibold">💡 Recommendation:</span>{" "}
          {result.recommendation}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default PhoneAnalysisCard;
