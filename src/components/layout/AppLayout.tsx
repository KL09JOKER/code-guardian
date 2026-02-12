import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/scanner/Header';
import { ScanHistory } from '@/components/scanner/ScanHistory';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ScanHistoryItem, ScanResult } from '@/types/scanner';
import { useNavigate } from 'react-router-dom';

interface AppLayoutProps {
  children: React.ReactNode;
  onHistorySelect?: (result: ScanResult) => void;
}

export function AppLayout({ children, onHistorySelect }: AppLayoutProps) {
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadHistory = async () => {
      const { data, error } = await supabase
        .from('scan_history')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to load history:', error);
        return;
      }

      if (data) {
        setHistory(
          data.map((row) => ({
            id: row.id,
            language: row.language,
            riskScore: row.risk_score,
            vulnerabilityCount: row.vulnerability_count,
            timestamp: new Date(row.created_at),
            codePreview: row.code_preview,
          }))
        );
      }
    };
    loadHistory();
  }, []);

  const handleHistorySelect = useCallback(async (item: ScanHistoryItem) => {
    const { data, error } = await supabase
      .from('scan_history')
      .select('*')
      .eq('id', item.id)
      .maybeSingle();

    if (error || !data) {
      toast.error('Failed to load scan details');
      return;
    }

    const vulnerabilities = (data.vulnerabilities as any[]) || [];
    const result: ScanResult = {
      id: data.id,
      code: data.code,
      language: data.language,
      riskScore: data.risk_score,
      vulnerabilities: vulnerabilities.map((v: any, i: number) => ({
        id: v.id || `vuln-${i}`,
        type: v.type,
        severity: v.severity,
        line: v.line,
        endLine: v.endLine,
        description: v.description,
        recommendation: v.recommendation,
      })),
      timestamp: new Date(data.created_at),
      scanDuration: data.scan_duration,
    };

    if (onHistorySelect) {
      onHistorySelect(result);
    } else {
      // Navigate to scanner with the result via state
      navigate('/scanner', { state: { scanResult: result } });
    }
    setShowHistory(false);
  }, [onHistorySelect, navigate]);

  const handleHistoryDelete = useCallback(async (id: string) => {
    const { error } = await supabase.from('scan_history').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete scan');
      return;
    }
    setHistory((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const addToHistory = useCallback((item: ScanHistoryItem) => {
    setHistory((prev) => [item, ...prev]);
  }, []);

  return (
    <div className="min-h-screen bg-background relative">
      <div className="fixed inset-0 cyber-grid opacity-10 pointer-events-none" />
      <div className="fixed inset-0 matrix-bg pointer-events-none" />

      <Header
        onHistoryClick={() => setShowHistory(true)}
        showHistory={showHistory}
      />

      <main className="container mx-auto px-4 py-8 relative z-10">
        {typeof children === 'function'
          ? (children as any)({ addToHistory })
          : children}
      </main>

      <Sheet open={showHistory} onOpenChange={setShowHistory}>
        <SheetContent className="bg-sidebar border-l border-sidebar-border w-[350px] sm:w-[400px]">
          <SheetHeader>
            <SheetTitle className="text-sidebar-foreground">Scan History</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <ScanHistory
              history={history}
              onSelect={handleHistorySelect}
              onDelete={handleHistoryDelete}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
