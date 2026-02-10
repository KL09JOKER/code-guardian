import { useState, useCallback, useRef } from 'react';
import { FolderUp, FileCode, X, Archive } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EXTENSION_MAP: Record<string, string> = {
  js: 'javascript', jsx: 'javascript', ts: 'typescript', tsx: 'typescript',
  py: 'python', php: 'php', java: 'java', cs: 'csharp', go: 'go', rb: 'ruby',
};

interface MultiFileUploadZoneProps {
  onFilesLoaded: (combinedCode: string, language: string) => void;
}

export function MultiFileUploadZone({ onFilesLoaded }: MultiFileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback(async (files: FileList) => {
    const codeFiles: { name: string; content: string; lang: string }[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      if (!(ext in EXTENSION_MAP)) continue;

      const content = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsText(file);
      });

      codeFiles.push({ name: file.name, content, lang: EXTENSION_MAP[ext] });
    }

    if (codeFiles.length === 0) return;

    setFileNames(codeFiles.map(f => f.name));
    
    // Combine all files with separators
    const combined = codeFiles.map(f => 
      `// ===== FILE: ${f.name} =====\n${f.content}`
    ).join('\n\n');

    // Use the most common language
    const langCounts: Record<string, number> = {};
    codeFiles.forEach(f => { langCounts[f.lang] = (langCounts[f.lang] || 0) + 1; });
    const primaryLang = Object.entries(langCounts).sort((a, b) => b[1] - a[1])[0][0];

    onFilesLoaded(combined, primaryLang);
  }, [onFilesLoaded]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) processFiles(e.dataTransfer.files);
  }, [processFiles]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) processFiles(e.target.files);
  }, [processFiles]);

  const clear = useCallback(() => {
    setFileNames([]);
    if (inputRef.current) inputRef.current.value = '';
  }, []);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 cursor-pointer ${
        isDragging ? 'border-primary bg-primary/10 scale-[1.01]' : 'border-border/50 hover:border-primary/40 bg-card/20'
      }`}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".js,.jsx,.ts,.tsx,.py,.php,.java,.cs,.go,.rb"
        onChange={handleInputChange}
        className="hidden"
      />

      {fileNames.length > 0 ? (
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <Archive className="w-5 h-5 text-primary" />
            <span className="text-sm text-foreground font-medium">{fileNames.length} files loaded</span>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); clear(); }}>
              <X className="w-3 h-3" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-1 justify-center">
            {fileNames.slice(0, 5).map(name => (
              <span key={name} className="text-xs bg-muted/50 px-2 py-0.5 rounded text-muted-foreground">{name}</span>
            ))}
            {fileNames.length > 5 && <span className="text-xs text-muted-foreground">+{fileNames.length - 5} more</span>}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <FolderUp className={`w-8 h-8 transition-colors ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
          <p className="text-sm text-muted-foreground">
            <span className="text-primary font-medium">Upload multiple files</span> for project scanning
          </p>
          <p className="text-xs text-muted-foreground/60">Drop multiple code files to scan together</p>
        </div>
      )}
    </div>
  );
}
