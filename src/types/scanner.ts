export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';

export interface Vulnerability {
  id: string;
  type: string;
  severity: SeverityLevel;
  line: number;
  endLine?: number;
  description: string;
  recommendation: string;
}

export interface ScanResult {
  id: string;
  code: string;
  language: string;
  riskScore: number;
  vulnerabilities: Vulnerability[];
  timestamp: Date;
  scanDuration: number;
}

export interface ScanHistoryItem {
  id: string;
  language: string;
  riskScore: number;
  vulnerabilityCount: number;
  timestamp: Date;
  codePreview: string;
}

export type AppState = 'upload' | 'scanning' | 'results';

export const SUPPORTED_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'php', label: 'PHP' },
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' },
  { value: 'go', label: 'Go' },
  { value: 'ruby', label: 'Ruby' },
] as const;
