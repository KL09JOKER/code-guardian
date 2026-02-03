import { useState, useCallback } from 'react';
import { AppState, ScanResult, ScanHistoryItem } from '@/types/scanner';
import { mockVulnerabilities, mockScanHistory } from '@/data/mockVulnerabilities';
import { Header } from '@/components/scanner/Header';
import { UploadScreen } from '@/components/scanner/UploadScreen';
import { ScanningAnimation } from '@/components/scanner/ScanningAnimation';
import { ResultsScreen } from '@/components/scanner/ResultsScreen';
import { ScanHistory } from '@/components/scanner/ScanHistory';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('upload');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [history, setHistory] = useState<ScanHistoryItem[]>(mockScanHistory);
  const [showHistory, setShowHistory] = useState(false);

  const handleStartScan = useCallback(() => {
    if (!code.trim()) return;
    
    setAppState('scanning');
    
    // Simulate scanning process
    setTimeout(() => {
      const result: ScanResult = {
        id: `scan-${Date.now()}`,
        code,
        language,
        riskScore: Math.floor(Math.random() * 40) + 50, // 50-90 for demo
        vulnerabilities: mockVulnerabilities,
        timestamp: new Date(),
        scanDuration: Math.floor(Math.random() * 2000) + 1500,
      };
      
      setScanResult(result);
      
      // Add to history
      const historyItem: ScanHistoryItem = {
        id: result.id,
        language: result.language,
        riskScore: result.riskScore,
        vulnerabilityCount: result.vulnerabilities.length,
        timestamp: result.timestamp,
        codePreview: code.split('\n')[0].slice(0, 50),
      };
      setHistory((prev) => [historyItem, ...prev]);
      
      setAppState('results');
    }, 4000);
  }, [code, language]);

  const handleNewScan = useCallback(() => {
    setCode('');
    setScanResult(null);
    setAppState('upload');
  }, []);

  const handleHistorySelect = useCallback((item: ScanHistoryItem) => {
    // In a real app, this would load the full scan result
    // For demo, we'll just show mock results
    const result: ScanResult = {
      id: item.id,
      code: item.codePreview + '\n// ... rest of code',
      language: item.language,
      riskScore: item.riskScore,
      vulnerabilities: mockVulnerabilities.slice(0, item.vulnerabilityCount),
      timestamp: item.timestamp,
      scanDuration: 1500,
    };
    setScanResult(result);
    setAppState('results');
    setShowHistory(false);
  }, []);

  const handleHistoryDelete = useCallback((id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background Effects */}
      <div className="fixed inset-0 cyber-grid opacity-10 pointer-events-none" />
      <div className="fixed inset-0 matrix-bg pointer-events-none" />
      
      {/* Header */}
      <Header 
        onHistoryClick={() => setShowHistory(true)} 
        showHistory={showHistory}
      />

      {/* Main Content */}
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

      {/* History Sidebar */}
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
