import { Vulnerability } from '@/types/scanner';
import { Card } from '@/components/ui/card';
import { Brain, Lightbulb, AlertTriangle, Code2 } from 'lucide-react';

interface AIExplanationProps {
  vulnerability: Vulnerability | null;
}

export function AIExplanation({ vulnerability }: AIExplanationProps) {
  if (!vulnerability) {
    return (
      <Card className="p-6 bg-card/50 border-border/50 text-center">
        <Brain className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
        <p className="text-muted-foreground">
          Select a vulnerability to see AI-powered analysis and recommendations.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-card/50 border-border/50 animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-primary/10">
          <Brain className="w-5 h-5 text-primary" />
        </div>
        <h3 className="font-semibold text-foreground">AI Analysis</h3>
      </div>

      <div className="space-y-4">
        {/* Vulnerability Details */}
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-warning mt-0.5 shrink-0" />
          <div>
            <h4 className="font-medium text-foreground mb-1">{vulnerability.type}</h4>
            <p className="text-sm text-muted-foreground">
              {vulnerability.description}
            </p>
          </div>
        </div>

        {/* Affected Code */}
        <div className="flex items-start gap-3">
          <Code2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
          <div>
            <h4 className="font-medium text-foreground mb-1">Affected Location</h4>
            <p className="text-sm font-mono bg-muted/50 px-2 py-1 rounded inline-block">
              Line {vulnerability.line}
              {vulnerability.endLine && vulnerability.endLine !== vulnerability.line 
                ? ` - ${vulnerability.endLine}` 
                : ''}
            </p>
          </div>
        </div>

        {/* Recommendation */}
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-success mt-0.5 shrink-0" />
          <div>
            <h4 className="font-medium text-foreground mb-1">Recommendation</h4>
            <p className="text-sm text-muted-foreground">
              {vulnerability.recommendation}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
