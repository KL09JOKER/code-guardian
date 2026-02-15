import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { code, language, vulnerability } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are an elite security engineer. Your SOLE task is to produce FULLY SECURE code with ZERO vulnerabilities remaining. 

ABSOLUTE REQUIREMENTS — every single one must be satisfied:
1. Fix EVERY vulnerability in the code — not just the highlighted one
2. Replace ALL hardcoded secrets, passwords, API keys, tokens with environment variable lookups (e.g. process.env.VAR_NAME)
3. Replace ALL string-concatenated SQL with parameterized/prepared statements  
4. Remove or replace eval(), exec(), Function(), setTimeout(string), setInterval(string) with safe alternatives
5. Sanitize and validate ALL user inputs (query params, body, headers, URL params)
6. Use cryptographically secure random (crypto.randomBytes / crypto.getRandomValues) instead of Math.random()
7. Add proper error handling that does NOT leak stack traces or internal details to users
8. Add authentication/authorization checks where missing
9. Set secure HTTP headers (CSRF, CORS, Content-Security-Policy, etc.) where applicable
10. Escape all outputs to prevent XSS (HTML encoding, etc.)
11. Use secure session/cookie settings (httpOnly, secure, sameSite)
12. Remove any debug/console.log statements that log sensitive data
13. Ensure no path traversal vulnerabilities exist in file operations
14. Use constant-time comparison for secrets/tokens

The final code MUST have a security risk score of 0. If you are unsure about something, choose the MORE secure option.

Return ONLY the complete fixed source code. No explanations, no markdown fences, no comments about changes, and absolutely NO code comments (no // or /* */ or # comments anywhere in the output). The code must be clean with zero comments.`;

    const userPrompt = `Fix ALL security vulnerabilities in this ${language} code. The primary vulnerability is a ${vulnerability.severity} "${vulnerability.type}" at line ${vulnerability.line}${vulnerability.endLine ? `-${vulnerability.endLine}` : ''}.

Primary issue: ${vulnerability.description}
Recommendation: ${vulnerability.recommendation}

But you MUST also fix every other security issue in the code. The final code should have zero vulnerabilities.

Original code:
\`\`\`${language}
${code}
\`\`\`

Return ONLY the complete, fully-secured fixed code.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      throw new Error(`AI gateway returned ${response.status}`);
    }

    const data = await response.json();
    let fixedCode = data.choices?.[0]?.message?.content?.trim() || "";

    // Clean markdown fences
    if (fixedCode.startsWith("```")) {
      fixedCode = fixedCode.replace(/^```(?:\w+)?\n?/, "").replace(/\n?```$/, "");
    }

    return new Response(JSON.stringify({ fixedCode }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("AI fix error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
