
CREATE TABLE public.scan_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  language TEXT NOT NULL,
  risk_score INTEGER NOT NULL,
  vulnerability_count INTEGER NOT NULL DEFAULT 0,
  code TEXT NOT NULL,
  code_preview TEXT NOT NULL,
  vulnerabilities JSONB NOT NULL DEFAULT '[]'::jsonb,
  scan_duration INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- No RLS since this is a single-user app without auth
ALTER TABLE public.scan_history ENABLE ROW LEVEL SECURITY;

-- Allow all operations publicly (no auth)
CREATE POLICY "Allow public read" ON public.scan_history FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.scan_history FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete" ON public.scan_history FOR DELETE USING (true);
