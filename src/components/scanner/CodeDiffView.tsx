import { Vulnerability } from '@/types/scanner';

interface CodeDiffViewProps {
  originalCode: string;
  fixedCode: string;
  vulnerability: Vulnerability;
}

export function CodeDiffView({ originalCode, fixedCode, vulnerability }: CodeDiffViewProps) {
  const origLines = originalCode.split('\n');
  const fixedLines = fixedCode.split('\n');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div>
        <div className="text-xs font-medium text-critical mb-2 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-critical" /> Original (Vulnerable)
        </div>
        <pre className="bg-critical/5 border border-critical/20 rounded-lg p-4 overflow-x-auto overflow-y-auto max-h-[70vh] min-h-[300px] text-xs font-mono leading-relaxed">
          {origLines.map((line, i) => {
            const lineNum = i + 1;
            const isVulnLine = lineNum >= vulnerability.line && lineNum <= (vulnerability.endLine || vulnerability.line);
            return (
              <div key={i} className={`flex ${isVulnLine ? 'bg-critical/20' : ''}`}>
                <span className="select-none w-10 text-right pr-3 text-muted-foreground/50 shrink-0">{lineNum}</span>
                <span className={isVulnLine ? 'text-critical' : 'text-foreground'}>{line || ' '}</span>
              </div>
            );
          })}
        </pre>
      </div>
      <div>
        <div className="text-xs font-medium text-success mb-2 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-success" /> Fixed (Secure)
        </div>
        <pre className="bg-success/5 border border-success/20 rounded-lg p-4 overflow-x-auto overflow-y-auto max-h-[70vh] min-h-[300px] text-xs font-mono leading-relaxed">
          {fixedLines.map((line, i) => {
            const lineNum = i + 1;
            // Highlight lines that differ from original
            const origLine = origLines[i];
            const isDifferent = origLine !== line;
            return (
              <div key={i} className={`flex ${isDifferent ? 'bg-success/20' : ''}`}>
                <span className="select-none w-10 text-right pr-3 text-muted-foreground/50 shrink-0">{lineNum}</span>
                <span className={isDifferent ? 'text-success' : 'text-foreground'}>{line || ' '}</span>
              </div>
            );
          })}
        </pre>
      </div>
    </div>
  );
}
