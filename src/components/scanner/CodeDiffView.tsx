import { Vulnerability } from '@/types/scanner';

interface CodeDiffViewProps {
  originalCode: string;
  fixedCode: string;
  vulnerability: Vulnerability;
}

export function CodeDiffView({ originalCode, fixedCode, vulnerability }: CodeDiffViewProps) {
  const origLines = originalCode.split('\n');
  const fixedLines = fixedCode.split('\n');

  // Show context around the vulnerability
  const startLine = Math.max(0, vulnerability.line - 3);
  const endLine = Math.min(origLines.length, (vulnerability.endLine || vulnerability.line) + 3);

  const origSlice = origLines.slice(startLine, endLine);
  const fixedSlice = fixedLines.slice(startLine, Math.min(fixedLines.length, endLine + (fixedLines.length - origLines.length)));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div>
        <div className="text-xs font-medium text-critical mb-1 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-critical" /> Original (Vulnerable)
        </div>
        <pre className="bg-critical/5 border border-critical/20 rounded-lg p-3 overflow-x-auto text-xs font-mono leading-relaxed">
          {origSlice.map((line, i) => {
            const lineNum = startLine + i + 1;
            const isVulnLine = lineNum >= vulnerability.line && lineNum <= (vulnerability.endLine || vulnerability.line);
            return (
              <div key={i} className={`flex ${isVulnLine ? 'bg-critical/20' : ''}`}>
                <span className="select-none w-8 text-right pr-2 text-muted-foreground/50">{lineNum}</span>
                <span className={isVulnLine ? 'text-critical' : 'text-foreground'}>{line || ' '}</span>
              </div>
            );
          })}
        </pre>
      </div>
      <div>
        <div className="text-xs font-medium text-success mb-1 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-success" /> Fixed (Secure)
        </div>
        <pre className="bg-success/5 border border-success/20 rounded-lg p-3 overflow-x-auto text-xs font-mono leading-relaxed">
          {fixedSlice.map((line, i) => {
            const lineNum = startLine + i + 1;
            const isFixLine = lineNum >= vulnerability.line && lineNum <= (vulnerability.endLine || vulnerability.line) + (fixedSlice.length - origSlice.length);
            return (
              <div key={i} className={`flex ${isFixLine ? 'bg-success/20' : ''}`}>
                <span className="select-none w-8 text-right pr-2 text-muted-foreground/50">{lineNum}</span>
                <span className={isFixLine ? 'text-success' : 'text-foreground'}>{line || ' '}</span>
              </div>
            );
          })}
        </pre>
      </div>
    </div>
  );
}
