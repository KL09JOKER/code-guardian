import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface HistoryFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  languageFilter: string;
  onLanguageFilterChange: (v: string) => void;
  severityFilter: string;
  onSeverityFilterChange: (v: string) => void;
}

export function HistoryFilters({
  search, onSearchChange,
  languageFilter, onLanguageFilterChange,
  severityFilter, onSeverityFilterChange,
}: HistoryFiltersProps) {
  return (
    <div className="space-y-2 mb-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
        <Input
          placeholder="Search scans..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8 h-8 text-xs bg-card/50"
        />
      </div>
      <div className="flex gap-2">
        <Select value={languageFilter} onValueChange={onLanguageFilterChange}>
          <SelectTrigger className="h-7 text-xs flex-1">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Languages</SelectItem>
            <SelectItem value="javascript">JavaScript</SelectItem>
            <SelectItem value="typescript">TypeScript</SelectItem>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="php">PHP</SelectItem>
            <SelectItem value="java">Java</SelectItem>
            <SelectItem value="csharp">C#</SelectItem>
            <SelectItem value="go">Go</SelectItem>
            <SelectItem value="ruby">Ruby</SelectItem>
          </SelectContent>
        </Select>
        <Select value={severityFilter} onValueChange={onSeverityFilterChange}>
          <SelectTrigger className="h-7 text-xs flex-1">
            <SelectValue placeholder="Risk Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Risk</SelectItem>
            <SelectItem value="high">High Risk (75+)</SelectItem>
            <SelectItem value="medium">Medium (50-74)</SelectItem>
            <SelectItem value="low">Low (&lt;50)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
