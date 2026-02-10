import { useState } from 'react';
import { ScanResult } from '@/types/scanner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Mail, Loader2, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface EmailReportDialogProps {
  result: ScanResult;
}

export function EmailReportDialog({ result }: EmailReportDialogProps) {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSend = async () => {
    if (!email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-report-email', {
        body: { email, result },
      });

      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);

      setSent(true);
      toast.success('Report sent successfully!');
      setTimeout(() => { setOpen(false); setSent(false); setEmail(''); }, 2000);
    } catch (err: any) {
      toast.error(err.message || 'Failed to send report');
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Mail className="w-4 h-4 mr-2" />
          Email Report
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send Report via Email</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            Enter your email to receive a detailed HTML report of this scan.
          </p>
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={sending}
          />
          <Button
            variant="cyber"
            className="w-full"
            onClick={handleSend}
            disabled={sending || sent}
          >
            {sent ? (
              <><Check className="w-4 h-4 mr-2" /> Sent!</>
            ) : sending ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</>
            ) : (
              <><Mail className="w-4 h-4 mr-2" /> Send Report</>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
