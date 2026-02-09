import { Card, CardContent } from '@/components/ui/card';
import { Shield, AlertTriangle, BarChart3, Clock } from 'lucide-react';

interface StatsCardsProps {
  totalScans: number;
  avgRiskScore: number;
  totalVulnerabilities: number;
  latestScanDate: string | null;
}

export function StatsCards({ totalScans, avgRiskScore, totalVulnerabilities, latestScanDate }: StatsCardsProps) {
  const stats = [
    { label: 'Total Scans', value: totalScans, icon: BarChart3, color: 'text-primary' },
    { label: 'Avg Risk Score', value: avgRiskScore.toFixed(1), icon: Shield, color: avgRiskScore >= 50 ? 'text-destructive' : 'text-green-400' },
    { label: 'Vulnerabilities Found', value: totalVulnerabilities, icon: AlertTriangle, color: 'text-warning' },
    { label: 'Latest Scan', value: latestScanDate || 'N/A', icon: Clock, color: 'text-muted-foreground' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="bg-card/50 border-border/30 backdrop-blur-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</span>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
