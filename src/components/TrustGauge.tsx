import { motion } from "framer-motion";
import { useMemo } from "react";

interface TrustGaugeProps {
  score: number;
  level: "safe" | "warning" | "danger";
}

const TrustGauge = ({ score, level }: TrustGaugeProps) => {
  const colorMap = {
    safe: { stroke: "hsl(152, 70%, 45%)", glow: "hsl(152, 70%, 45%)" },
    warning: { stroke: "hsl(38, 92%, 55%)", glow: "hsl(38, 92%, 55%)" },
    danger: { stroke: "hsl(0, 72%, 55%)", glow: "hsl(0, 72%, 55%)" },
  };

  const labelMap = { safe: "SAFE", warning: "SUSPICIOUS", danger: "FRAUD" };

  const { stroke, glow } = colorMap[level];
  const circumference = 2 * Math.PI * 80;
  const arcLength = circumference * 0.75; // 270 degrees
  const filledLength = (score / 100) * arcLength;

  const gradientId = useMemo(() => `gauge-gradient-${Math.random().toString(36).slice(2)}`, []);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-56 h-44">
        <svg viewBox="0 0 200 160" className="w-full h-full">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(0, 72%, 55%)" />
              <stop offset="50%" stopColor="hsl(38, 92%, 55%)" />
              <stop offset="100%" stopColor="hsl(152, 70%, 45%)" />
            </linearGradient>
          </defs>

          {/* Background arc */}
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="hsl(222, 30%, 18%)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${arcLength} ${circumference}`}
            transform="rotate(135 100 100)"
          />

          {/* Filled arc */}
          <motion.circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke={stroke}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${filledLength} ${circumference}`}
            transform="rotate(135 100 100)"
            filter="url(#glow)"
            initial={{ strokeDasharray: `0 ${circumference}` }}
            animate={{ strokeDasharray: `${filledLength} ${circumference}` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>

        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
          <motion.span
            className="font-mono text-5xl font-bold"
            style={{ color: stroke }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {score}
          </motion.span>
          <span className="text-muted-foreground text-xs font-mono mt-1">/ 100</span>
        </div>
      </div>

      <motion.div
        className="font-mono text-sm font-semibold tracking-widest mt-2 px-4 py-1.5 rounded-full"
        style={{
          color: stroke,
          backgroundColor: `${glow}15`,
          border: `1px solid ${glow}30`,
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.4 }}
      >
        {labelMap[level]}
      </motion.div>
    </div>
  );
};

export default TrustGauge;
