import { motion } from "framer-motion";
import { Shield, ShieldAlert, ShieldX, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import type { RiskDetail } from "@/lib/analysisEngine";

const RiskCard = ({ risk, index }: { risk: RiskDetail; index: number }) => {
  const [expanded, setExpanded] = useState(false);

  const config = {
    safe: {
      icon: Shield,
      borderColor: "border-safe/30",
      bgColor: "bg-safe/5",
      textColor: "text-safe",
      label: "Safe",
    },
    warning: {
      icon: ShieldAlert,
      borderColor: "border-warning/30",
      bgColor: "bg-warning/5",
      textColor: "text-warning",
      label: "Warning",
    },
    danger: {
      icon: ShieldX,
      borderColor: "border-destructive/30",
      bgColor: "bg-destructive/5",
      textColor: "text-destructive",
      label: "Danger",
    },
  };

  const { icon: Icon, borderColor, bgColor, textColor, label } = config[risk.level];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 + 0.3, duration: 0.4 }}
      className={`rounded-xl border ${borderColor} ${bgColor} p-4 cursor-pointer transition-all hover:border-opacity-60`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon className={`w-5 h-5 ${textColor}`} />
          <div>
            <p className="text-sm font-medium text-foreground">{risk.category}</p>
            <p className={`text-xs font-mono ${textColor}`}>{label} · {risk.score}/100</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                backgroundColor:
                  risk.level === "safe"
                    ? "hsl(152, 70%, 45%)"
                    : risk.level === "warning"
                    ? "hsl(38, 92%, 55%)"
                    : "hsl(0, 72%, 55%)",
              }}
              initial={{ width: 0 }}
              animate={{ width: `${risk.score}%` }}
              transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
            />
          </div>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </div>

      {expanded && (
        <motion.ul
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-3 space-y-1.5 pl-8"
        >
          {risk.findings.map((f, i) => (
            <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
              <span className={`mt-1 w-1 h-1 rounded-full flex-shrink-0 ${
                risk.level === "safe" ? "bg-safe" : risk.level === "warning" ? "bg-warning" : "bg-destructive"
              }`} />
              {f}
            </li>
          ))}
        </motion.ul>
      )}
    </motion.div>
  );
};

export default RiskCard;
