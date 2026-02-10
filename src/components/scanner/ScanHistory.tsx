import { useState, useMemo } from 'react';
import { ScanHistoryItem } from '@/types/scanner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Trash2, Eye, Shield, ShieldAlert, ShieldX, ShieldCheck } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { HistoryFilters } from './HistoryFilters';

interface ScanHistoryProps {
  history: ScanHistoryItem[];
  onSelect: (item: ScanHistoryItem) => void;
  onDelete: (id: string) => void;
}

function getRiskIcon(score: number) {
  if (score >= 75) return ShieldX;
  if (score >= 50) return ShieldAlert;
  if (score >= 25) return Shield;
  return ShieldCheck;
}

function getRiskColor(score: number) {
  if (score >= 75) return 'text-critical';
  if (score >= 50) return 'text-warning';
  if (score >= 25) return 'text-warning';
  return 'text-success';
}

export function ScanHistory({ history, onSelect, onDelete }: ScanHistoryProps) {
  const [search, setSearch] = useState('');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');

  const filtered = useMemo(() => {
    return history.filter(item => {
      if (search && !item.codePreview.toLowerCase().includes(search.toLowerCase()) && !item.language.toLowerCase().includes(search.toLowerCase())) return false;
      if (languageFilter !== 'all' && item.language !== languageFilter) return false;
      if (severityFilter === 'high' && item.riskScore < 75) return false;
      if (severityFilter === 'medium' && (item.riskScore < 50 || item.riskScore >= 75)) return false;
      if (severityFilter === 'low' && item.riskScore >= 50) return false;
      return true;
    });
  }, [history, search, languageFilter, severityFilter]);

  if (history.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
        <p className="text-muted-foreground">No scan history yet</p>
        <p className="text-sm text-muted-foreground/70">Your scans will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <HistoryFilters
        search={search}
        onSearchChange={setSearch}
        languageFilter={languageFilter}
        onLanguageFilterChange={setLanguageFilter}
        severityFilter={severityFilter}
        onSeverityFilterChange={setSeverityFilter}
      />

      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider px-1">
        {filtered.length} of {history.length} Scans
      </h3>
      
      {filtered.map((item) => {
        const RiskIcon = getRiskIcon(item.riskScore);
        const riskColor = getRiskColor(item.riskScore);

        return (
          <Card
            key={item.id}
            className="p-3 bg-card/50 border-border/50 hover:bg-card/80 transition-colors group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <RiskIcon className={`w-4 h-4 ${riskColor}`} />
                  <span className={`font-mono font-bold ${riskColor}`}>
                    {item.riskScore}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    • {item.vulnerabilityCount} issues
                  </span>
                </div>
                
                <p className="text-xs text-muted-foreground font-mono truncate mb-1">
                  {item.codePreview}
                </p>
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground/70">
                  <span className="capitalize">{item.language}</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(item.timestamp, { addSuffix: true })}</span>
                </div>
              </div>

              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => onSelect(item)}
                >
                  <Eye className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-critical hover:text-critical"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(item.id);
                  }}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
