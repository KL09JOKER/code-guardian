import { useState } from 'react';
import { ScanResult, Vulnerability } from '@/types/scanner';
import { Button } from '@/components/ui/button';
import { RiskScoreBadge } from './RiskScoreBadge';
import { VulnerabilityCard } from './VulnerabilityCard';
import { CodeViewer } from './CodeViewer';
import { AIExplanation } from './AIExplanation';
import { Download, RotateCcw, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ResultsScreenProps {
  result: ScanResult;
  onNewScan: () => void;
}

export function ResultsScreen({ result, onNewScan }: ResultsScreenProps) {
  const [selectedVulnerability, setSelectedVulnerability] = useState<Vulnerability | null>(
    result.vulnerabilities[0] || null
  );

  const handleDownloadReport = () => {
    import('@/lib/generateReport').then(({ generatePdfReport }) => {
      generatePdfReport(result);
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Score */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 p-6 rounded-2xl bg-card/30 border border-border/30">
        <div className="flex items-center gap-6">
          <RiskScoreBadge score={result.riskScore} size="lg" />
          
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Scan Complete
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatDistanceToNow(result.timestamp, { addSuffix: true })}
              </span>
              <span className="capitalize">• {result.language}</span>
              <span>• {result.vulnerabilities.length} vulnerabilities found</span>
              <span>• Scanned in {result.scanDuration}ms</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="cyberOutline" onClick={handleDownloadReport}>
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
          <Button variant="ghost" onClick={onNewScan}>
            <RotateCcw className="w-4 h-4 mr-2" />
            New Scan
          </Button>
        </div>
      </div>

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
                onClick={() => setSelectedVulnerability(vuln)}
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
