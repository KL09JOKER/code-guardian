import { Textarea } from '@/components/ui/textarea';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
}

export function CodeEditor({ value, onChange, placeholder, readOnly }: CodeEditorProps) {
  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        className="relative min-h-[400px] font-mono text-sm bg-card/80 border-border/50 rounded-xl resize-none focus:border-primary/50 focus:ring-primary/20 transition-all duration-300 placeholder:text-muted-foreground/50"
        style={{ 
          lineHeight: '1.6',
          tabSize: 2,
        }}
      />
      <div className="absolute bottom-3 right-3 text-xs text-muted-foreground/50">
        {value.split('\n').length} lines
      </div>
    </div>
  );
}
