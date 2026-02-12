import { Shield, History, Github, LayoutDashboard, Palette, Home, GitCompare, BookOpen, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme, THEMES } from '@/contexts/ThemeContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  onHistoryClick: () => void;
  showHistory: boolean;
  isDashboard?: boolean;
}

export function Header({ onHistoryClick, showHistory, isDashboard }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme, autoRiskTheme, setAutoRiskTheme } = useTheme();

  const navItems = [
    { path: '/scanner', label: 'Scanner', icon: Home },
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/compare', label: 'Compare', icon: GitCompare },
    { path: '/knowledge-base', label: 'Learn', icon: BookOpen },
  ];

  return (
    <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
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

        <div className="flex items-center gap-1">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <Button
                key={item.path}
                variant={location.pathname === item.path ? 'cyber' : 'ghost'}
                size="sm"
                onClick={() => navigate(item.path)}
                className="gap-1.5"
              >
                <Icon className="w-4 h-4" />
                <span className="hidden md:inline">{item.label}</span>
              </Button>
            );
          })}

          <Button
            variant={showHistory ? 'cyber' : 'ghost'}
            size="sm"
            onClick={onHistoryClick}
            className="gap-1.5"
          >
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">History</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Palette className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
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
              <DropdownMenuSeparator />
              <div className="px-2 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  <div>
                    <div className="text-sm font-medium">Auto Risk Theme</div>
                    <div className="text-xs text-muted-foreground">Theme by risk level</div>
                  </div>
                </div>
                <Switch
                  checked={autoRiskTheme}
                  onCheckedChange={setAutoRiskTheme}
                />
              </div>
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
