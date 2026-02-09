import { useState, useCallback, useRef } from 'react';
import { Upload, FileCode, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EXTENSION_MAP: Record<string, string> = {
  js: 'javascript',
  jsx: 'javascript',
  ts: 'typescript',
  tsx: 'typescript',
  py: 'python',
  php: 'php',
  java: 'java',
  cs: 'csharp',
  go: 'go',
  rb: 'ruby',
};

const ACCEPTED_EXTENSIONS = Object.keys(EXTENSION_MAP);

interface FileUploadZoneProps {
  onFileLoaded: (code: string, language: string) => void;
}

export function FileUploadZone({ onFileLoaded }: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback((file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (!ACCEPTED_EXTENSIONS.includes(ext)) {
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setFileName(file.name);
      onFileLoaded(content, EXTENSION_MAP[ext]);
    };
    reader.readAsText(file);
  }, [onFileLoaded]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }, [processFile]);

  const clearFile = useCallback(() => {
    setFileName(null);
    if (inputRef.current) inputRef.current.value = '';
  }, []);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 cursor-pointer ${
        isDragging
          ? 'border-primary bg-primary/10 scale-[1.01]'
          : 'border-border/50 hover:border-primary/40 bg-card/20'
      }`}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_EXTENSIONS.map(e => `.${e}`).join(',')}
        onChange={handleInputChange}
        className="hidden"
      />

      {fileName ? (
        <div className="flex items-center justify-center gap-3">
          <FileCode className="w-5 h-5 text-primary" />
          <span className="text-sm text-foreground font-medium">{fileName}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={(e) => { e.stopPropagation(); clearFile(); }}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <Upload className={`w-8 h-8 transition-colors ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
          <p className="text-sm text-muted-foreground">
            <span className="text-primary font-medium">Click to upload</span> or drag & drop a code file
          </p>
          <p className="text-xs text-muted-foreground/60">
            Supports: {ACCEPTED_EXTENSIONS.map(e => `.${e}`).join(', ')}
          </p>
        </div>
      )}
    </div>
  );
}
