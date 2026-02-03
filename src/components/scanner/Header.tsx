import { Shield, History, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onHistoryClick: () => void;
  showHistory: boolean;
}

export function Header({ onHistoryClick, showHistory }: HeaderProps) {
  return (
    <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Shield className="w-8 h-8 text-primary" />
            <div className="absolute inset-0 blur-lg bg-primary/30 -z-10" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-foreground">
              BackDoor<span className="text-primary">Scanner</span>
            </h1>
            <p className="text-xs text-muted-foreground">AI Code Vulnerability Scanner</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={showHistory ? "cyber" : "ghost"}
            size="sm"
            onClick={onHistoryClick}
            className="gap-2"
          >
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">History</span>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <Github className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
