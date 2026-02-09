import { Shield, History, Github, LayoutDashboard, Palette, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme, THEMES } from '@/contexts/ThemeContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  onHistoryClick: () => void;
  showHistory: boolean;
  isDashboard?: boolean;
}

export function Header({ onHistoryClick, showHistory, isDashboard }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();

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
          {/* Nav links */}
          <Button
            variant={location.pathname === '/' ? 'cyber' : 'ghost'}
            size="sm"
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Scanner</span>
          </Button>
          <Button
            variant={location.pathname === '/dashboard' ? 'cyber' : 'ghost'}
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="gap-2"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Button>

          {!isDashboard && (
            <Button
              variant={showHistory ? 'cyber' : 'ghost'}
              size="sm"
              onClick={onHistoryClick}
              className="gap-2"
            >
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">History</span>
            </Button>
          )}

          {/* Theme Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Palette className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {THEMES.map((t) => (
                <DropdownMenuItem
                  key={t.value}
                  onClick={() => setTheme(t.value)}
                  className={theme === t.value ? 'bg-accent/20' : ''}
                >
                  <div>
                    <div className="font-medium text-sm">{t.label}</div>
                    <div className="text-xs text-muted-foreground">{t.description}</div>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

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
