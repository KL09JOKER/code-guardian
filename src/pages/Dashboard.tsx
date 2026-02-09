import { useEffect, useState } from 'react';
import { Header } from '@/components/scanner/Header';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { RiskChart } from '@/components/dashboard/RiskChart';
import { SeverityPieChart } from '@/components/dashboard/SeverityPieChart';
import { VulnTypeChart } from '@/components/dashboard/VulnTypeChart';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';

interface ScanRow {
  id: string;
  risk_score: number;
  vulnerability_count: number;
  vulnerabilities: any;
  created_at: string;
  language: string;
}

const Dashboard = () => {
  const [scans, setScans] = useState<ScanRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('scan_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      setScans(data || []);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const totalScans = scans.length;
  const avgRiskScore = totalScans > 0 ? scans.reduce((s, r) => s + r.risk_score, 0) / totalScans : 0;
  const totalVulns = scans.reduce((s, r) => s + r.vulnerability_count, 0);
  const latestDate = scans[0] ? format(new Date(scans[0].created_at), 'MMM d, yyyy') : null;

  // Risk trend (last 10 reversed)
  const riskData = scans.slice(0, 10).reverse().map((s, i) => ({
    name: `Scan ${i + 1}`,
    riskScore: s.risk_score,
  }));

  // Severity distribution
  const severityCounts = { critical: 0, high: 0, medium: 0, low: 0 };
  scans.forEach(s => {
    const vulns = (s.vulnerabilities as any[]) || [];
    vulns.forEach((v: any) => {
      if (v.severity in severityCounts) severityCounts[v.severity as keyof typeof severityCounts]++;
    });
  });
  const severityData = Object.entries(severityCounts).map(([name, value]) => ({ name, value }));

  // Vuln types
  const typeMap: Record<string, number> = {};
  scans.forEach(s => {
    const vulns = (s.vulnerabilities as any[]) || [];
    vulns.forEach((v: any) => {
      typeMap[v.type] = (typeMap[v.type] || 0) + 1;
    });
  });
  const vulnTypeData = Object.entries(typeMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([type, count]) => ({ type, count }));

  return (
    <div className="min-h-screen bg-background relative">
      <div className="fixed inset-0 cyber-grid opacity-10 pointer-events-none" />
      <div className="fixed inset-0 matrix-bg pointer-events-none" />

      <Header onHistoryClick={() => {}} showHistory={false} isDashboard />

      <main className="container mx-auto px-4 py-8 relative z-10 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-1">Dashboard</h2>
          <p className="text-sm text-muted-foreground">Overview of your scan analytics</p>
        </div>

        <StatsCards
          totalScans={totalScans}
          avgRiskScore={avgRiskScore}
          totalVulnerabilities={totalVulns}
          latestScanDate={latestDate}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RiskChart data={riskData} />
          <SeverityPieChart data={severityData} />
        </div>

        <VulnTypeChart data={vulnTypeData} />
      </main>
    </div>
  );
};

export default Dashboard;
