import { Button } from '@/components/ui/button';
import { CodeEditor } from './CodeEditor';
import { LanguageSelector } from './LanguageSelector';
import { Scan } from 'lucide-react';

interface UploadScreenProps {
  code: string;
  language: string;
  onCodeChange: (code: string) => void;
  onLanguageChange: (language: string) => void;
  onStartScan: () => void;
}

export function UploadScreen({
  code,
  language,
  onCodeChange,
  onLanguageChange,
  onStartScan,
}: UploadScreenProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
          Scan Your Code for{' '}
          <span className="text-primary">Vulnerabilities</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Paste your code below and let our AI-powered scanner detect security issues, 
          potential backdoors, and vulnerabilities in real-time.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <LanguageSelector value={language} onChange={onLanguageChange} />
      </div>

      {/* Code Editor */}
      <CodeEditor
        value={code}
        onChange={onCodeChange}
        placeholder={`// Paste your code here...\n// Supports JavaScript, TypeScript, Python, PHP, and more.\n\nfunction example() {\n  // Your code will be analyzed for security vulnerabilities\n}`}
      />

      {/* Start Scan Button */}
      <div className="flex justify-center">
        <Button
          variant="cyber"
          size="xl"
          onClick={onStartScan}
          disabled={!code.trim()}
          className="group min-w-[200px]"
        >
          <Scan className="w-5 h-5 mr-2 group-hover:animate-pulse" />
          Start Security Scan
        </Button>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        {[
          { title: 'SQL Injection', desc: 'Detect database query vulnerabilities' },
          { title: 'XSS Attacks', desc: 'Find cross-site scripting issues' },
          { title: 'Hardcoded Secrets', desc: 'Identify exposed credentials' },
        ].map((item) => (
          <div
            key={item.title}
            className="p-4 rounded-xl bg-card/30 border border-border/30 hover:border-primary/30 transition-colors"
          >
            <h4 className="font-medium text-foreground mb-1">{item.title}</h4>
            <p className="text-sm text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
