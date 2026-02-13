import { useState } from 'react';
import { ScanResult, Vulnerability } from '@/types/scanner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RiskScoreBadge } from './RiskScoreBadge';
import { VulnerabilityCard } from './VulnerabilityCard';
import { CodeViewer } from './CodeViewer';
import { AIExplanation } from './AIExplanation';
import { CodeDiffView } from './CodeDiffView';
import { EmailReportDialog } from './EmailReportDialog';
import { Download, RotateCcw, Clock, Wand2, Loader2, Copy, Check } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ResultsScreenProps {
  result: ScanResult;
  onNewScan: () => void;
}

export function ResultsScreen({ result, onNewScan }: ResultsScreenProps) {
  const [selectedVulnerability, setSelectedVulnerability] = useState<Vulnerability | null>(
    result.vulnerabilities[0] || null
  );
  const [fixedCode, setFixedCode] = useState<string | null>(null);
  const [fixLoading, setFixLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDownloadReport = () => {
    import('@/lib/generateReport').then(({ generatePdfReport }) => {
      generatePdfReport(result);
    });
  };

  const handleFixWithAI = async () => {
    if (!selectedVulnerability) return;
    setFixLoading(true);
    setFixedCode(null);
    try {
      const { data, error } = await supabase.functions.invoke('ai-fix', {
        body: { code: result.code, language: result.language, vulnerability: selectedVulnerability },
      });
      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);
      setFixedCode(data.fixedCode);
    } catch (err: any) {
      toast.error(err.message || 'Failed to generate fix');
    } finally {
      setFixLoading(false);
    }
  };

  const handleCopyFix = () => {
    if (fixedCode) {
      navigator.clipboard.writeText(fixedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Fixed code copied to clipboard');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Score */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 p-6 rounded-2xl bg-card/30 border border-border/30">
        <div className="flex items-center gap-6">
          <RiskScoreBadge score={result.riskScore} size="lg" />
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Scan Complete</h2>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatDistanceToNow(result.timestamp, { addSuffix: true })}
              </span>
              <span className="capitalize">• {result.language}</span>
              <span>• {result.vulnerabilities.length} vulnerabilities found</span>
              <span>• Scanned in {(result.scanDuration / 1000).toFixed(1)}s</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          <Button variant="cyber" onClick={handleFixWithAI} disabled={fixLoading || !selectedVulnerability}>
            {fixLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Wand2 className="w-4 h-4 mr-2" />}
            {fixLoading ? 'Fixing...' : 'Fix with AI'}
          </Button>
          <Button variant="cyberOutline" onClick={handleDownloadReport}>
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
          <EmailReportDialog result={result} />
          <Button variant="ghost" onClick={onNewScan}>
            <RotateCcw className="w-4 h-4 mr-2" />
            New Scan
          </Button>
        </div>
      </div>

      {/* AI Fix Suggestion - Full Width */}
      {fixedCode && selectedVulnerability && (
        <Card className="p-6 bg-card/50 border-border/50 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-primary" />
              AI Fix Suggestion
            </h4>
            <Button variant="ghost" size="sm" onClick={handleCopyFix}>
              {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
              {copied ? 'Copied' : 'Copy Fix'}
            </Button>
          </div>
          <CodeDiffView originalCode={result.code} fixedCode={fixedCode} vulnerability={selectedVulnerability} />
        </Card>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Left Column: Vulnerabilities List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            Vulnerabilities ({result.vulnerabilities.length})
          </h3>
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {result.vulnerabilities.map((vuln) => (
              <VulnerabilityCard
                key={vuln.id}
                vulnerability={vuln}
                isSelected={selectedVulnerability?.id === vuln.id}
                onClick={() => { setSelectedVulnerability(vuln); setFixedCode(null); }}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Code Viewer + AI Explanation */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Code Analysis</h3>
          
          <CodeViewer
            code={result.code}
            vulnerabilities={result.vulnerabilities}
            selectedVulnerability={selectedVulnerability}
          />
          
          <AIExplanation vulnerability={selectedVulnerability} />
        </div>
      </div>
    </div>
  );
}
