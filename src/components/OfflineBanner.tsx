import { useState, useEffect } from 'react';
import { WifiOff, X } from 'lucide-react';

export function OfflineBanner() {
  const [offline, setOffline] = useState(!navigator.onLine);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const goOffline = () => { setOffline(true); setDismissed(false); };
    const goOnline = () => setOffline(false);
    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);
    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online', goOnline);
    };
  }, []);

  if (!offline || dismissed) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm animate-fade-in">
      <div className="flex items-start gap-3 rounded-xl border bg-card p-4 shadow-lg">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
          <WifiOff className="h-4 w-4 text-destructive" />
        </div>
        <div className="flex-1 space-y-1">
          <p className="text-sm font-semibold text-card-foreground">You're offline</p>
          <p className="text-xs text-muted-foreground">Scanning and AI fixes require an internet connection.</p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
