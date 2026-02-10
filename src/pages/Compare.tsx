import { useEffect, useState } from 'react';
import { Header } from '@/components/scanner/Header';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RiskScoreBadge } from '@/components/scanner/RiskScoreBadge';
import { GitCompare, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ScanRow {
  id: string;
  risk_score: number;
  vulnerability_count: number;
  vulnerabilities: any;
  created_at: string;
  language: string;
  code_preview: string;
  code: string;
}

const Compare = () => {
  const [scans, setScans] = useState<ScanRow[]>([]);
  const [leftId, setLeftId] = useState<string>('');
  const [rightId, setRightId] = useState<string>('');

  useEffect(() => {
    supabase.from('scan_history').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setScans(data || []);
    });
  }, []);

  const left = scans.find(s => s.id === leftId);
  const right = scans.find(s => s.id === rightId);

  const renderScanCard = (scan: ScanRow | undefined, label: string) => {
    if (!scan) return (
      <Card className="p-8 bg-card/30 border-border/30 flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Select {label} scan</p>
      </Card>
    );

    const vulns = (scan.vulnerabilities as any[]) || [];
    const severityCounts = { critical: 0, high: 0, medium: 0, low: 0 };
    vulns.forEach((v: any) => { if (v.severity in severityCounts) severityCounts[v.severity as keyof typeof severityCounts]++; });

    return (
      <Card className="p-6 bg-card/30 border-border/30 space-y-4">
        <div className="flex items-center justify-between">
          <RiskScoreBadge score={scan.risk_score} size="md" />
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(scan.created_at), { addSuffix: true })}
          </span>
        </div>
        <div className="text-sm space-y-2">
          <p className="text-muted-foreground capitalize">Language: <span className="text-foreground">{scan.language}</span></p>
          <p className="text-muted-foreground">Vulnerabilities: <span className="text-foreground">{scan.vulnerability_count}</span></p>
        </div>
        <div className="flex flex-wrap gap-2">
          {severityCounts.critical > 0 && <span className="text-xs px-2 py-1 rounded-full bg-critical/20 text-critical">{severityCounts.critical} Critical</span>}
          {severityCounts.high > 0 && <span className="text-xs px-2 py-1 rounded-full bg-warning/20 text-warning">{severityCounts.high} High</span>}
          {severityCounts.medium > 0 && <span className="text-xs px-2 py-1 rounded-full bg-warning/10 text-warning">{severityCounts.medium} Medium</span>}
          {severityCounts.low > 0 && <span className="text-xs px-2 py-1 rounded-full bg-success/20 text-success">{severityCounts.low} Low</span>}
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Vulnerabilities</h4>
          <div className="max-h-[250px] overflow-y-auto space-y-2">
            {vulns.map((v: any, i: number) => (
              <div key={i} className="text-xs p-2 rounded bg-muted/30 border border-border/30">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-1.5 py-0.5 rounded uppercase font-bold ${
                    v.severity === 'critical' ? 'bg-critical/20 text-critical' :
                    v.severity === 'high' ? 'bg-warning/20 text-warning' :
                    v.severity === 'medium' ? 'bg-warning/10 text-warning' :
                    'bg-success/20 text-success'
                  }`}>{v.severity}</span>
                  <span className="font-medium text-foreground">{v.type}</span>
                </div>
                <p className="text-muted-foreground">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  };

  const scoreDiff = left && right ? right.risk_score - left.risk_score : null;

  return (
    <div className="min-h-screen bg-background relative">
      <div className="fixed inset-0 cyber-grid opacity-10 pointer-events-none" />
      <div className="fixed inset-0 matrix-bg pointer-events-none" />
      <Header onHistoryClick={() => {}} showHistory={false} isDashboard />

      <main className="container mx-auto px-4 py-8 relative z-10 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-1 flex items-center gap-2">
            <GitCompare className="w-6 h-6 text-primary" /> Scan Comparison
          </h2>
          <p className="text-sm text-muted-foreground">Compare two scans side-by-side to track security improvements</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select value={leftId} onValueChange={setLeftId}>
            <SelectTrigger><SelectValue placeholder="Select first scan..." /></SelectTrigger>
            <SelectContent>
              {scans.map(s => (
                <SelectItem key={s.id} value={s.id}>
                  Score {s.risk_score} — {s.language} — {formatDistanceToNow(new Date(s.created_at), { addSuffix: true })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={rightId} onValueChange={setRightId}>
            <SelectTrigger><SelectValue placeholder="Select second scan..." /></SelectTrigger>
            <SelectContent>
              {scans.map(s => (
                <SelectItem key={s.id} value={s.id}>
                  Score {s.risk_score} — {s.language} — {formatDistanceToNow(new Date(s.created_at), { addSuffix: true })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {scoreDiff !== null && (
          <Card className="p-4 bg-card/30 border-border/30 flex items-center justify-center gap-4">
            <span className="text-sm text-muted-foreground">Risk Score Change:</span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-foreground">{left!.risk_score}</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
              <span className="text-lg font-bold text-foreground">{right!.risk_score}</span>
              <span className={`text-sm font-bold ${scoreDiff > 0 ? 'text-critical' : scoreDiff < 0 ? 'text-success' : 'text-muted-foreground'}`}>
                ({scoreDiff > 0 ? '+' : ''}{scoreDiff})
              </span>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderScanCard(left, 'first')}
          {renderScanCard(right, 'second')}
        </div>
      </main>
    </div>
  );
};

export default Compare;
