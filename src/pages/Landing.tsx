import { Shield, Scan, Brain, FileText, GitCompare, BarChart3, Upload, BookOpen, ArrowRight, Zap, Lock, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useTheme, THEMES } from '@/contexts/ThemeContext';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Palette } from 'lucide-react';

const features = [
  { icon: Brain, title: 'AI-Powered Analysis', desc: 'Gemini AI scans your code for vulnerabilities in real-time with expert-level accuracy.' },
  { icon: Scan, title: 'Multi-Language Support', desc: 'Supports JavaScript, TypeScript, Python, PHP, Java, C#, Go, and Ruby.' },
  { icon: FileText, title: 'PDF Reports', desc: 'Generate professional security reports with detailed findings and recommendations.' },
  { icon: GitCompare, title: 'Scan Comparison', desc: 'Compare scans side-by-side to track how your security posture improves over time.' },
  { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Visualize trends, severity distributions, and vulnerability patterns across scans.' },
  { icon: Upload, title: 'Drag & Drop Upload', desc: 'Upload code files or paste directly — auto-detects language from file extension.' },
  { icon: BookOpen, title: 'Knowledge Base', desc: 'Educational resources explaining common vulnerabilities with code examples.' },
  { icon: Zap, title: 'AI Fix Suggestions', desc: 'Get AI-generated code fixes with before/after diff views for each vulnerability.' },
];

const stats = [
  { label: 'Vulnerability Types', value: '20+' },
  { label: 'Languages Supported', value: '8' },
  { label: 'AI Model', value: 'Gemini' },
  { label: 'Analysis Time', value: '< 10s' },
];

const Landing = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed inset-0 cyber-grid opacity-10 pointer-events-none" />
      <div className="fixed inset-0 matrix-bg pointer-events-none" />

      {/* Minimal Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-lg font-bold text-foreground">BackDoor<span className="text-primary">Scanner</span></h1>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon"><Palette className="w-4 h-4" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {THEMES.map((t) => (
                  <DropdownMenuItem key={t.value} onClick={() => setTheme(t.value)} className={theme === t.value ? 'bg-accent/20' : ''}>
                    <div>
                      <div className="font-medium text-sm">{t.label}</div>
                      <div className="text-xs text-muted-foreground">{t.description}</div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="cyber" onClick={() => navigate('/scanner')}>
              Launch Scanner <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 py-20 text-center">
        <div className="relative inline-block mb-6">
          <Shield className="w-20 h-20 text-primary mx-auto animate-float" />
          <div className="absolute inset-0 blur-2xl bg-primary/20 -z-10" />
        </div>
        <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-4 leading-tight">
          AI-Powered <span className="text-primary">Security Scanner</span>
          <br />for Your Code
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Detect SQL injections, XSS vulnerabilities, hardcoded credentials, and more. 
          Powered by Gemini AI for instant, expert-level code auditing.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="cyber" size="xl" onClick={() => navigate('/scanner')}>
            <Scan className="w-5 h-5 mr-2" /> Start Scanning
          </Button>
          <Button variant="cyberOutline" size="lg" onClick={() => navigate('/knowledge-base')}>
            <BookOpen className="w-5 h-5 mr-2" /> Learn About Vulnerabilities
          </Button>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 container mx-auto px-4 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(s => (
            <Card key={s.label} className="p-6 bg-card/30 border-border/30 text-center">
              <div className="text-3xl font-bold text-primary mb-1">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 container mx-auto px-4 py-16">
        <h3 className="text-2xl font-bold text-foreground text-center mb-10">Everything You Need</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map(f => {
            const Icon = f.icon;
            return (
              <Card key={f.title} className="p-6 bg-card/30 border-border/30 hover:border-primary/30 transition-all group">
                <div className="p-3 rounded-xl bg-primary/10 w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">{f.title}</h4>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 container mx-auto px-4 py-16">
        <h3 className="text-2xl font-bold text-foreground text-center mb-10">How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: '01', icon: Code2, title: 'Paste or Upload Code', desc: 'Paste your code directly or drag & drop files. Supports 8 programming languages.' },
            { step: '02', icon: Brain, title: 'AI Analyzes', desc: 'Gemini AI scans for vulnerabilities, assigns severity levels, and calculates a risk score.' },
            { step: '03', icon: Lock, title: 'Get Secure', desc: 'Review findings, get AI-generated fixes, download reports, and track improvements.' },
          ].map(s => {
            const Icon = s.icon;
            return (
              <div key={s.step} className="text-center">
                <div className="text-5xl font-bold text-primary/20 mb-4">{s.step}</div>
                <div className="p-4 rounded-xl bg-primary/10 w-fit mx-auto mb-4">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">{s.title}</h4>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 container mx-auto px-4 py-20 text-center">
        <Card className="p-12 bg-card/30 border-primary/20 max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-foreground mb-4">Ready to Secure Your Code?</h3>
          <p className="text-muted-foreground mb-6">Start scanning for free. No signup required.</p>
          <Button variant="cyber" size="xl" onClick={() => navigate('/scanner')}>
            <Shield className="w-5 h-5 mr-2" /> Launch BackDoorScanner
          </Button>
        </Card>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/30 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>BackDoorScanner — AI-Powered Code Vulnerability Scanner</p>
          <p className="mt-1">Built with React, TypeScript, Tailwind CSS, and Gemini AI</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
