import { Vulnerability } from '@/types/scanner';
import { useEffect, useRef } from 'react';

interface CodeViewerProps {
  code: string;
  vulnerabilities: Vulnerability[];
  selectedVulnerability: Vulnerability | null;
}

export function CodeViewer({ code, vulnerabilities, selectedVulnerability }: CodeViewerProps) {
  const codeRef = useRef<HTMLPreElement>(null);
  const lines = code.split('\n');

  useEffect(() => {
    if (selectedVulnerability && codeRef.current) {
      const lineElement = codeRef.current.querySelector(`[data-line="${selectedVulnerability.line}"]`);
      if (lineElement) {
        lineElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedVulnerability]);

  const getLineHighlight = (lineNumber: number): string => {
    const vuln = vulnerabilities.find(
      (v) => lineNumber >= v.line && lineNumber <= (v.endLine || v.line)
    );
    
    if (!vuln) return '';
    
    const isSelected = selectedVulnerability?.id === vuln.id;
    
    if (vuln.severity === 'critical' || vuln.severity === 'high') {
      return isSelected 
        ? 'code-highlight-danger bg-critical/30' 
        : 'code-highlight-danger';
    }
    
    return isSelected 
      ? 'code-highlight-warning bg-warning/30' 
      : 'code-highlight-warning';
  };

  return (
    <div className="relative rounded-xl overflow-hidden border border-border/50 bg-card/50">
      <div className="flex items-center gap-2 px-4 py-2 bg-muted/30 border-b border-border/50">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-critical/50" />
          <div className="w-3 h-3 rounded-full bg-warning/50" />
          <div className="w-3 h-3 rounded-full bg-success/50" />
        </div>
        <span className="text-xs text-muted-foreground font-mono">code-viewer</span>
      </div>
      
      <div className="overflow-auto max-h-[500px] p-0">
        <pre ref={codeRef} className="text-sm leading-relaxed">
          <code>
            {lines.map((line, index) => {
              const lineNumber = index + 1;
              const highlight = getLineHighlight(lineNumber);
              
              return (
                <div
                  key={lineNumber}
                  data-line={lineNumber}
                  className={`flex hover:bg-muted/20 transition-colors ${highlight}`}
                >
                  <span className="select-none w-12 px-3 py-0.5 text-right text-muted-foreground/50 border-r border-border/30 font-mono text-xs">
                    {lineNumber}
                  </span>
                  <span className="px-4 py-0.5 font-mono whitespace-pre flex-1">
                    {line || ' '}
                  </span>
                </div>
              );
            })}
          </code>
        </pre>
      </div>
    </div>
  );
}
