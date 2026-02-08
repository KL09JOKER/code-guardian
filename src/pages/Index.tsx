import { useState, useCallback, useEffect } from 'react';
import { AppState, ScanResult, ScanHistoryItem, Vulnerability } from '@/types/scanner';
import { Header } from '@/components/scanner/Header';
import { UploadScreen } from '@/components/scanner/UploadScreen';
import { ScanningAnimation } from '@/components/scanner/ScanningAnimation';
import { ResultsScreen } from '@/components/scanner/ResultsScreen';
import { ScanHistory } from '@/components/scanner/ScanHistory';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('upload');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load history from database on mount
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

  const handleStartScan = useCallback(async () => {
    if (!code.trim()) return;

    setAppState('scanning');
    const startTime = Date.now();

    try {
      const { data, error } = await supabase.functions.invoke('scan-code', {
        body: { code, language },
      });

      if (error) {
        throw new Error(error.message || 'Scan failed');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      const scanDuration = Date.now() - startTime;
      const vulnerabilities: Vulnerability[] = (data.vulnerabilities || []).map(
        (v: any, i: number) => ({
          id: v.id || `vuln-${i}`,
          type: v.type,
          severity: v.severity,
          line: v.line,
          endLine: v.endLine,
          description: v.description,
          recommendation: v.recommendation,
        })
      );

      const result: ScanResult = {
        id: `scan-${Date.now()}`,
        code,
        language,
        riskScore: data.riskScore ?? 0,
        vulnerabilities,
        timestamp: new Date(),
        scanDuration,
      };

      setScanResult(result);

      // Save to database
      const { data: inserted, error: insertError } = await supabase
        .from('scan_history')
        .insert({
          language: result.language,
          risk_score: result.riskScore,
          vulnerability_count: result.vulnerabilities.length,
          code: code,
          code_preview: code.split('\n')[0].slice(0, 50),
          vulnerabilities: JSON.parse(JSON.stringify(result.vulnerabilities)),
          scan_duration: result.scanDuration,
        })
        .select()
        .single();

      if (!insertError && inserted) {
        const historyItem: ScanHistoryItem = {
          id: inserted.id,
          language: inserted.language,
          riskScore: inserted.risk_score,
          vulnerabilityCount: inserted.vulnerability_count,
          timestamp: new Date(inserted.created_at),
          codePreview: inserted.code_preview,
        };
        setHistory((prev) => [historyItem, ...prev]);
      }

      setAppState('results');
    } catch (err: any) {
      console.error('Scan error:', err);
      toast.error(err.message || 'Failed to scan code. Please try again.');
      setAppState('upload');
    }
  }, [code, language]);

  const handleNewScan = useCallback(() => {
    setCode('');
    setScanResult(null);
    setAppState('upload');
  }, []);

  const handleHistorySelect = useCallback(async (item: ScanHistoryItem) => {
    // Load full scan from database
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
    setScanResult(result);
    setAppState('results');
    setShowHistory(false);
  }, []);

  const handleHistoryDelete = useCallback(async (id: string) => {
    const { error } = await supabase.from('scan_history').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete scan');
      return;
    }
    setHistory((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background Effects */}
      <div className="fixed inset-0 cyber-grid opacity-10 pointer-events-none" />
      <div className="fixed inset-0 matrix-bg pointer-events-none" />
      
      <Header 
        onHistoryClick={() => setShowHistory(true)} 
        showHistory={showHistory}
      />

      <main className="container mx-auto px-4 py-8 relative z-10">
        {appState === 'upload' && (
          <UploadScreen
            code={code}
            language={language}
            onCodeChange={setCode}
            onLanguageChange={setLanguage}
            onStartScan={handleStartScan}
          />
        )}
        
        {appState === 'scanning' && <ScanningAnimation />}
        
        {appState === 'results' && scanResult && (
          <ResultsScreen result={scanResult} onNewScan={handleNewScan} />
        )}
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
};

export default Index;
