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

    const systemPrompt = `You are an expert security engineer specializing in secure coding practices. Your task is to fix ALL security vulnerabilities in the provided code, not just the one highlighted.

CRITICAL INSTRUCTIONS:
1. Fix the SPECIFIC highlighted vulnerability first
2. Then scan the ENTIRE code and fix ALL other security issues you can find
3. The resulting code must be production-ready and have a security risk score of 0
4. Replace all hardcoded secrets/credentials with environment variable references
5. Sanitize all user inputs
6. Use parameterized queries instead of string concatenation for SQL
7. Replace eval(), exec(), and other dangerous functions with safe alternatives
8. Add input validation and proper error handling
9. Use cryptographically secure random functions instead of Math.random()
10. Add proper authentication/authorization checks where missing

Return ONLY the complete fixed code — no explanations, no markdown fences, no comments about what was changed. Just the pure secure source code.`;

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
