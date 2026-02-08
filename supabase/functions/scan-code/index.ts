import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { code, language } = await req.json();

    if (!code || !code.trim()) {
      return new Response(
        JSON.stringify({ error: "No code provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert cybersecurity code auditor. Analyze the provided code for security vulnerabilities.

Return a JSON object with this exact structure (no markdown, no code fences, pure JSON only):
{
  "riskScore": <number 0-100>,
  "vulnerabilities": [
    {
      "id": "<unique-id>",
      "type": "<vulnerability type e.g. SQL Injection, XSS, Hardcoded Credentials>",
      "severity": "<low|medium|high|critical>",
      "line": <line number where vulnerability starts>,
      "endLine": <line number where vulnerability ends, optional>,
      "description": "<clear description of the vulnerability and its impact>",
      "recommendation": "<actionable fix recommendation>"
    }
  ]
}

Rules:
- riskScore: 0 = perfectly safe, 100 = extremely dangerous
- Only report real vulnerabilities you can identify in the code
- If the code is safe, return riskScore 0 and empty vulnerabilities array
- Be specific about line numbers
- severity must be one of: low, medium, high, critical
- Return ONLY valid JSON, no explanation text`;

    const userPrompt = `Analyze this ${language} code for security vulnerabilities:\n\n${code}`;

    console.log("Calling AI gateway for code scan...");

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
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits in Settings." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI gateway returned ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content returned from AI");
    }

    console.log("AI response received, parsing...");

    // Clean potential markdown fences
    let cleaned = content.trim();
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    const result = JSON.parse(cleaned);

    // Validate structure
    if (typeof result.riskScore !== "number" || !Array.isArray(result.vulnerabilities)) {
      throw new Error("Invalid response structure from AI");
    }

    console.log(`Scan complete: riskScore=${result.riskScore}, vulnerabilities=${result.vulnerabilities.length}`);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Scan error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
