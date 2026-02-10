import { useState } from 'react';
import { Vulnerability } from '@/types/scanner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wand2, Loader2, Copy, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CodeDiffView } from './CodeDiffView';

interface AIFixSuggestionProps {
  vulnerability: Vulnerability | null;
  code: string;
  language: string;
}

export function AIFixSuggestion({ vulnerability, code, language }: AIFixSuggestionProps) {
  const [fixedCode, setFixedCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleFix = async () => {
    if (!vulnerability) return;
    setLoading(true);
    setFixedCode(null);

    try {
      const { data, error } = await supabase.functions.invoke('ai-fix', {
        body: { code, language, vulnerability },
      });

      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);

      setFixedCode(data.fixedCode);
    } catch (err: any) {
      toast.error(err.message || 'Failed to generate fix');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (fixedCode) {
      navigator.clipboard.writeText(fixedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Fixed code copied to clipboard');
    }
  };

  if (!vulnerability) return null;

  return (
    <Card className="p-4 bg-card/50 border-border/50 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          <Wand2 className="w-4 h-4 text-primary" />
          AI Fix Suggestion
        </h4>
        <div className="flex gap-2">
          {fixedCode && (
            <Button variant="ghost" size="sm" onClick={handleCopy}>
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied' : 'Copy Fix'}
            </Button>
          )}
          <Button variant="cyber" size="sm" onClick={handleFix} disabled={loading}>
            {loading ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Wand2 className="w-3 h-3 mr-1" />}
            {loading ? 'Generating...' : fixedCode ? 'Regenerate' : 'Fix with AI'}
          </Button>
        </div>
      </div>

      {fixedCode && (
        <CodeDiffView originalCode={code} fixedCode={fixedCode} vulnerability={vulnerability} />
      )}
    </Card>
  );
}
