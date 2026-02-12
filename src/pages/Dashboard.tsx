import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { RiskChart } from '@/components/dashboard/RiskChart';
import { SeverityPieChart } from '@/components/dashboard/SeverityPieChart';
import { VulnTypeChart } from '@/components/dashboard/VulnTypeChart';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

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

  const totalScans = scans.length;
  const avgRiskScore = totalScans > 0 ? scans.reduce((s, r) => s + r.risk_score, 0) / totalScans : 0;
  const totalVulns = scans.reduce((s, r) => s + r.vulnerability_count, 0);
  const latestDate = scans[0] ? format(new Date(scans[0].created_at), 'MMM d, yyyy') : null;

  const riskData = scans.slice(0, 10).reverse().map((s, i) => ({
    name: `Scan ${i + 1}`,
    riskScore: s.risk_score,
  }));

  const severityCounts = { critical: 0, high: 0, medium: 0, low: 0 };
  scans.forEach(s => {
    const vulns = (s.vulnerabilities as any[]) || [];
    vulns.forEach((v: any) => {
      if (v.severity in severityCounts) severityCounts[v.severity as keyof typeof severityCounts]++;
    });
  });
  const severityData = Object.entries(severityCounts).map(([name, value]) => ({ name, value }));

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

  const handleExportDashboardPdf = () => {
    import('jspdf').then(({ default: jsPDF }) => {
      const doc = new jsPDF();
      const pw = doc.internal.pageSize.getWidth();
      
      doc.setFontSize(22);
      doc.setTextColor(59, 130, 246);
      doc.text('BackDoorScanner', 14, 20);
      doc.setFontSize(12);
      doc.setTextColor(150, 150, 150);
      doc.text('Analytics Dashboard Summary', 14, 28);
      doc.setDrawColor(59, 130, 246);
      doc.line(14, 32, pw - 14, 32);

      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      doc.text(`Generated: ${format(new Date(), 'PPpp')}`, 14, 40);
      doc.text(`Total Scans: ${totalScans}`, 14, 48);
      doc.text(`Average Risk Score: ${Math.round(avgRiskScore)}`, 14, 56);
      doc.text(`Total Vulnerabilities: ${totalVulns}`, 14, 64);

      let y = 78;
      doc.setFontSize(14);
      doc.setTextColor(40, 40, 40);
      doc.text('Severity Distribution', 14, y);
      y += 8;
      doc.setFontSize(10);
      severityData.forEach(s => {
        doc.text(`${s.name}: ${s.value}`, 14, y);
        y += 6;
      });

      y += 4;
      doc.setFontSize(14);
      doc.text('Top Vulnerability Types', 14, y);
      y += 8;
      doc.setFontSize(10);
      vulnTypeData.forEach(v => {
        doc.text(`${v.type}: ${v.count}`, 14, y);
        y += 6;
      });

      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text('BackDoorScanner Dashboard Report', pw / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });

      doc.save('dashboard-report.pdf');
    });
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-1">Dashboard</h2>
            <p className="text-sm text-muted-foreground">Overview of your scan analytics</p>
          </div>
          <Button variant="cyberOutline" size="sm" onClick={handleExportDashboardPdf}>
            <Download className="w-4 h-4 mr-2" /> Export PDF
          </Button>
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
      </div>
    </AppLayout>
  );
};

export default Dashboard;
