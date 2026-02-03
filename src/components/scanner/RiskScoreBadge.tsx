import { SeverityLevel } from '@/types/scanner';
import { Shield, ShieldAlert, ShieldX, ShieldCheck } from 'lucide-react';

interface RiskScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

function getScoreLevel(score: number): SeverityLevel {
  if (score >= 75) return 'critical';
  if (score >= 50) return 'high';
  if (score >= 25) return 'medium';
  return 'low';
}

const levelConfig = {
  low: {
    icon: ShieldCheck,
    label: 'Low Risk',
    bgClass: 'bg-success/10 border-success/30',
    textClass: 'text-success',
    glowClass: 'cyber-glow-success',
  },
  medium: {
    icon: Shield,
    label: 'Medium Risk',
    bgClass: 'bg-warning/10 border-warning/30',
    textClass: 'text-warning',
    glowClass: 'cyber-glow-warning',
  },
  high: {
    icon: ShieldAlert,
    label: 'High Risk',
    bgClass: 'bg-warning/20 border-warning/50',
    textClass: 'text-warning',
    glowClass: 'cyber-glow-warning',
  },
  critical: {
    icon: ShieldX,
    label: 'Critical Risk',
    bgClass: 'bg-critical/10 border-critical/30',
    textClass: 'text-critical',
    glowClass: 'cyber-glow-critical',
  },
};

const sizeClasses = {
  sm: 'w-16 h-16 text-xl',
  md: 'w-24 h-24 text-3xl',
  lg: 'w-32 h-32 text-4xl',
};

export function RiskScoreBadge({ score, size = 'lg' }: RiskScoreBadgeProps) {
  const level = getScoreLevel(score);
  const config = levelConfig[level];
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`relative ${sizeClasses[size]} rounded-full ${config.bgClass} border flex items-center justify-center ${config.glowClass}`}>
        <span className={`font-bold font-mono ${config.textClass}`}>
          {score}
        </span>
        <div className="absolute -top-2 -right-2">
          <Icon className={`w-6 h-6 ${config.textClass}`} />
        </div>
      </div>
      <div className="text-center">
        <p className={`font-semibold ${config.textClass}`}>{config.label}</p>
        <p className="text-xs text-muted-foreground">Security Score</p>
      </div>
    </div>
  );
}
