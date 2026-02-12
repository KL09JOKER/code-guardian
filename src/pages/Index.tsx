import { useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AppState, ScanResult, ScanHistoryItem, Vulnerability } from '@/types/scanner';
import { UploadScreen } from '@/components/scanner/UploadScreen';
import { ScanningAnimation } from '@/components/scanner/ScanningAnimation';
import { ResultsScreen } from '@/components/scanner/ResultsScreen';
import { AppLayout } from '@/components/layout/AppLayout';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useTheme } from '@/contexts/ThemeContext';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('upload');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const location = useLocation();
  const { applyRiskTheme } = useTheme();

  // Handle incoming scan result from history navigation
  useEffect(() => {
    const state = location.state as any;
    if (state?.scanResult) {
      setScanResult(state.scanResult);
      setAppState('results');
      applyRiskTheme(state.scanResult.riskScore);
      // Clear the state
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

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
      applyRiskTheme(result.riskScore);

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

      setAppState('results');
    } catch (err: any) {
      console.error('Scan error:', err);
      toast.error(err.message || 'Failed to scan code. Please try again.');
      setAppState('upload');
    }
  }, [code, language, applyRiskTheme]);

  const handleNewScan = useCallback(() => {
    setCode('');
    setScanResult(null);
    setAppState('upload');
  }, []);

  const handleHistorySelect = useCallback((result: ScanResult) => {
    setScanResult(result);
    setAppState('results');
    applyRiskTheme(result.riskScore);
  }, [applyRiskTheme]);

  return (
    <AppLayout onHistorySelect={handleHistorySelect}>
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
    </AppLayout>
  );
};

export default Index;
