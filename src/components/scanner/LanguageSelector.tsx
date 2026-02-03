import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SUPPORTED_LANGUAGES } from '@/types/scanner';
import { Code2 } from 'lucide-react';

interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px] bg-card border-border/50 hover:border-primary/50 transition-colors">
        <Code2 className="w-4 h-4 mr-2 text-primary" />
        <SelectValue placeholder="Select language" />
      </SelectTrigger>
      <SelectContent className="bg-popover border-border">
        {SUPPORTED_LANGUAGES.map((lang) => (
          <SelectItem 
            key={lang.value} 
            value={lang.value}
            className="hover:bg-primary/10 focus:bg-primary/10 cursor-pointer"
          >
            {lang.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
