import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/card';
import { Shield, AlertTriangle, Code2, Lock, Key, Bug, Zap, Database, Globe, Server } from 'lucide-react';

const vulnerabilityTypes = [
  {
    icon: Database,
    title: 'SQL Injection',
    severity: 'critical',
    description: 'Occurs when user input is directly embedded into SQL queries without sanitization, allowing attackers to manipulate database queries.',
    example: `// ❌ Vulnerable\nconst query = "SELECT * FROM users WHERE id = " + userId;\n\n// ✅ Safe\nconst query = "SELECT * FROM users WHERE id = $1";\ndb.query(query, [userId]);`,
    prevention: ['Use parameterized queries or prepared statements', 'Use an ORM (Prisma, Sequelize, SQLAlchemy)', 'Validate and sanitize all user inputs', 'Apply principle of least privilege to database accounts'],
  },
  {
    icon: Globe,
    title: 'Cross-Site Scripting (XSS)',
    severity: 'high',
    description: 'Allows attackers to inject malicious scripts into web pages viewed by other users, stealing cookies, session tokens, or personal data.',
    example: `// ❌ Vulnerable\nelement.innerHTML = userInput;\n\n// ✅ Safe\nelement.textContent = userInput;\n// Or use DOMPurify\nelement.innerHTML = DOMPurify.sanitize(userInput);`,
    prevention: ['Never use innerHTML with untrusted data', 'Use textContent or frameworks that auto-escape (React)', 'Implement Content Security Policy (CSP) headers', 'Sanitize with libraries like DOMPurify'],
  },
  {
    icon: Key,
    title: 'Hardcoded Credentials',
    severity: 'critical',
    description: 'API keys, passwords, or tokens stored directly in source code can be extracted by attackers through code repositories or decompiled binaries.',
    example: `// ❌ Vulnerable\nconst API_KEY = "sk-1234567890abcdef";\nconst DB_PASS = "admin123";\n\n// ✅ Safe\nconst API_KEY = process.env.API_KEY;\nconst DB_PASS = process.env.DB_PASSWORD;`,
    prevention: ['Use environment variables for all secrets', 'Use a secrets manager (Vault, AWS Secrets Manager)', 'Add .env to .gitignore', 'Rotate credentials regularly'],
  },
  {
    icon: Server,
    title: 'Command Injection',
    severity: 'critical',
    description: 'Occurs when user input is passed to system commands, allowing attackers to execute arbitrary commands on the server.',
    example: `// ❌ Vulnerable\nexec("ping " + userHost);\n\n// ✅ Safe\nexecFile("ping", ["-c", "1", userHost]);`,
    prevention: ['Never pass user input to shell commands', 'Use execFile instead of exec', 'Whitelist allowed inputs', 'Use language-specific APIs instead of shell commands'],
  },
  {
    icon: Lock,
    title: 'Missing Authentication',
    severity: 'high',
    description: 'API endpoints or pages that lack proper authentication checks, allowing unauthorized users to access sensitive functionality.',
    example: `// ❌ Vulnerable\napp.delete('/users/:id', (req, res) => {\n  db.deleteUser(req.params.id);\n});\n\n// ✅ Safe\napp.delete('/users/:id', authMiddleware, (req, res) => {\n  if (req.user.role !== 'admin') return res.status(403).json({error: 'Forbidden'});\n  db.deleteUser(req.params.id);\n});`,
    prevention: ['Implement authentication middleware', 'Use role-based access control (RBAC)', 'Verify permissions on every request', 'Use established auth libraries (Passport.js, NextAuth)'],
  },
  {
    icon: Bug,
    title: 'Insecure Deserialization',
    severity: 'high',
    description: 'Untrusted data is deserialized without validation, potentially leading to remote code execution or data tampering.',
    example: `// ❌ Vulnerable\nconst obj = JSON.parse(untrustedData);\neval(obj.callback);\n\n// ✅ Safe\nconst obj = JSON.parse(untrustedData);\n// Validate structure with a schema\nconst validated = schema.parse(obj);`,
    prevention: ['Validate deserialized data with schema validation (Zod, Joi)', 'Never use eval() with untrusted data', 'Implement integrity checks (HMAC)', 'Use safe serialization formats'],
  },
  {
    icon: Zap,
    title: 'Insecure Randomness',
    severity: 'low',
    description: 'Using Math.random() for security-sensitive operations like token generation, as it is not cryptographically secure.',
    example: `// ❌ Vulnerable\nconst token = Math.random().toString(36);\n\n// ✅ Safe\nconst token = crypto.randomUUID();\n// or\nconst bytes = crypto.randomBytes(32).toString('hex');`,
    prevention: ['Use crypto.randomBytes() or crypto.randomUUID()', 'Never use Math.random() for security tokens', 'Use established libraries for JWT/session management'],
  },
  {
    icon: AlertTriangle,
    title: 'Path Traversal',
    severity: 'high',
    description: 'Attackers manipulate file paths to access files outside the intended directory, potentially reading sensitive system files.',
    example: `// ❌ Vulnerable\nconst file = fs.readFileSync("/uploads/" + req.params.name);\n\n// ✅ Safe\nconst safeName = path.basename(req.params.name);\nconst file = fs.readFileSync(path.join("/uploads", safeName));`,
    prevention: ['Use path.basename() to strip directory components', 'Validate paths against a whitelist', 'Use chroot or sandboxed environments', 'Never directly concatenate user input with file paths'],
  },
];

const severityColors: Record<string, string> = {
  critical: 'bg-critical/20 text-critical border-critical/30',
  high: 'bg-warning/20 text-warning border-warning/30',
  medium: 'bg-warning/10 text-warning border-warning/20',
  low: 'bg-success/20 text-success border-success/30',
};

const KnowledgeBase = () => {
  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-3 flex items-center justify-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            Vulnerability Knowledge Base
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Learn about common security vulnerabilities, how to identify them, and best practices to prevent them in your code.
          </p>
        </div>

        <div className="space-y-6">
          {vulnerabilityTypes.map((vuln) => {
            const Icon = vuln.icon;
            return (
              <Card key={vuln.title} className="p-6 bg-card/30 border-border/30 hover:border-primary/30 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 shrink-0">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-xl font-bold text-foreground">{vuln.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase border ${severityColors[vuln.severity]}`}>
                        {vuln.severity}
                      </span>
                    </div>
                    <p className="text-muted-foreground">{vuln.description}</p>

                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                        <Code2 className="w-4 h-4 text-primary" /> Code Example
                      </h4>
                      <pre className="bg-muted/30 border border-border/30 rounded-lg p-4 overflow-x-auto text-sm font-mono text-foreground whitespace-pre">
                        {vuln.example}
                      </pre>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-2">Prevention Tips</h4>
                      <ul className="space-y-1">
                        {vuln.prevention.map((tip, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary mt-1">•</span> {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
};

export default KnowledgeBase;
