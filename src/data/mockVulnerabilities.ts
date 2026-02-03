import { Vulnerability, ScanHistoryItem } from '@/types/scanner';

export const mockVulnerabilities: Vulnerability[] = [
  {
    id: 'vuln-1',
    type: 'SQL Injection',
    severity: 'critical',
    line: 15,
    endLine: 17,
    description: 'User input is directly concatenated into SQL query without sanitization, allowing attackers to execute arbitrary SQL commands.',
    recommendation: 'Use parameterized queries or prepared statements instead of string concatenation. Consider using an ORM like Prisma or Sequelize.',
  },
  {
    id: 'vuln-2',
    type: 'Cross-Site Scripting (XSS)',
    severity: 'high',
    line: 28,
    endLine: 30,
    description: 'Unsanitized user input is rendered directly in the DOM using innerHTML, enabling script injection attacks.',
    recommendation: 'Use textContent instead of innerHTML, or sanitize input with a library like DOMPurify before rendering.',
  },
  {
    id: 'vuln-3',
    type: 'Hardcoded Credentials',
    severity: 'critical',
    line: 5,
    description: 'API keys and passwords are hardcoded in the source code, exposing sensitive credentials.',
    recommendation: 'Use environment variables or a secrets manager. Never commit credentials to version control.',
  },
  {
    id: 'vuln-4',
    type: 'Insecure Dependency',
    severity: 'medium',
    line: 1,
    description: 'The lodash package version 4.17.15 has known prototype pollution vulnerabilities (CVE-2020-8203).',
    recommendation: 'Update lodash to version 4.17.21 or later to patch the vulnerability.',
  },
  {
    id: 'vuln-5',
    type: 'Missing Authentication',
    severity: 'high',
    line: 42,
    endLine: 48,
    description: 'API endpoint lacks authentication checks, allowing unauthorized access to sensitive operations.',
    recommendation: 'Implement authentication middleware and verify user permissions before processing requests.',
  },
  {
    id: 'vuln-6',
    type: 'Insecure Random',
    severity: 'low',
    line: 33,
    description: 'Math.random() is used for generating session tokens. This is not cryptographically secure.',
    recommendation: 'Use crypto.randomBytes() or crypto.randomUUID() for security-sensitive random values.',
  },
];

export const mockScanHistory: ScanHistoryItem[] = [
  {
    id: 'scan-1',
    language: 'javascript',
    riskScore: 78,
    vulnerabilityCount: 6,
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    codePreview: 'const query = "SELECT * FROM users WHERE id = " + userId;',
  },
  {
    id: 'scan-2',
    language: 'python',
    riskScore: 45,
    vulnerabilityCount: 3,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    codePreview: 'subprocess.call(user_input, shell=True)',
  },
  {
    id: 'scan-3',
    language: 'typescript',
    riskScore: 12,
    vulnerabilityCount: 1,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    codePreview: 'const token = Math.random().toString(36);',
  },
  {
    id: 'scan-4',
    language: 'php',
    riskScore: 92,
    vulnerabilityCount: 8,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
    codePreview: '$query = "SELECT * FROM users WHERE id = $_GET[\'id\']";',
  },
];

export const sampleVulnerableCode = `// WARNING: This code contains intentional vulnerabilities for demo purposes
const API_KEY = "sk-1234567890abcdef"; // Hardcoded credential
const DB_PASSWORD = "admin123";

const express = require('express');
const mysql = require('mysql');
const app = express();

// Vulnerable SQL query - SQL Injection
app.get('/user', (req, res) => {
  const userId = req.query.id;
  const query = "SELECT * FROM users WHERE id = " + userId;
  db.query(query, (err, results) => {
    res.json(results);
  });
});

// Vulnerable XSS - Unsanitized output
app.get('/comment', (req, res) => {
  const comment = req.query.text;
  res.send(\`
    <div class="comment">
      <p>\${comment}</p>
    </div>
  \`);
});

// Insecure random for session token
function generateToken() {
  return Math.random().toString(36).substring(2);
}

// Missing authentication check
app.delete('/admin/users/:id', (req, res) => {
  // No auth check here!
  db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
  res.json({ success: true });
});

// Vulnerable command execution
const { exec } = require('child_process');
app.get('/ping', (req, res) => {
  const host = req.query.host;
  exec(\`ping -c 1 \${host}\`, (err, stdout) => {
    res.send(stdout);
  });
});`;
