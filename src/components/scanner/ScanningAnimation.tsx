import { useEffect, useState } from 'react';
import { Shield, Scan, Brain, FileText } from 'lucide-react';

const scanningSteps = [
  { icon: Scan, text: 'Parsing code structure...' },
  { icon: Shield, text: 'Running vulnerability detection...' },
  { icon: Brain, text: 'AI analysis in progress...' },
  { icon: FileText, text: 'Generating security report...' },
];

export function ScanningAnimation() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % scanningSteps.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const CurrentIcon = scanningSteps[currentStep].icon;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] relative">
      {/* Background effects */}
      <div className="absolute inset-0 matrix-bg opacity-50" />
      <div className="absolute inset-0 cyber-grid opacity-20" />
      
      {/* Radar animation */}
      <div className="relative mb-12">
        {/* Outer rings */}
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute inset-0 rounded-full border border-primary/20 pulse-ring"
            style={{
              width: `${120 + i * 60}px`,
              height: `${120 + i * 60}px`,
              left: `${-30 - i * 30}px`,
              top: `${-30 - i * 30}px`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
        
        {/* Center icon */}
        <div className="relative w-[120px] h-[120px] rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center cyber-glow">
          <CurrentIcon className="w-12 h-12 text-primary animate-pulse" />
          
          {/* Radar sweep */}
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div 
              className="absolute inset-0 animate-radar"
              style={{
                background: 'conic-gradient(from 0deg, transparent 0deg, hsl(var(--primary) / 0.3) 30deg, transparent 60deg)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Status text */}
      <div className="relative z-10 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-4 animate-fade-in">
          Scanning Your Code
        </h2>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="font-mono text-sm" key={currentStep}>
            {scanningSteps[currentStep].text}
          </span>
        </div>
      </div>

      {/* Progress indicators */}
      <div className="flex gap-2 mt-8">
        {scanningSteps.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === currentStep 
                ? 'bg-primary cyber-glow w-8' 
                : i < currentStep 
                  ? 'bg-primary/50' 
                  : 'bg-muted'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
