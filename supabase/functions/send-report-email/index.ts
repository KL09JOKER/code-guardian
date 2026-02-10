import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { email, result } = await req.json();

    if (!email || !result) {
      return new Response(JSON.stringify({ error: "Email and result are required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const severityCounts = { critical: 0, high: 0, medium: 0, low: 0 };
    (result.vulnerabilities || []).forEach((v: any) => {
      if (v.severity in severityCounts) severityCounts[v.severity as keyof typeof severityCounts]++;
    });

    const riskColor = result.riskScore >= 75 ? '#ef4444' :
      result.riskScore >= 50 ? '#f59e0b' :
      result.riskScore >= 25 ? '#eab308' : '#10b981';

    const vulnRows = (result.vulnerabilities || []).map((v: any, i: number) => `
      <tr style="border-bottom: 1px solid #1e293b;">
        <td style="padding: 8px; color: #94a3b8;">${i + 1}</td>
        <td style="padding: 8px; color: #f1f5f9; font-weight: 600;">${v.type}</td>
        <td style="padding: 8px;"><span style="color: ${
          v.severity === 'critical' ? '#ef4444' : v.severity === 'high' ? '#f59e0b' : v.severity === 'medium' ? '#eab308' : '#10b981'
        }; text-transform: uppercase; font-weight: 700; font-size: 11px;">${v.severity}</span></td>
        <td style="padding: 8px; color: #94a3b8; font-family: monospace;">Line ${v.line}${v.endLine ? `-${v.endLine}` : ''}</td>
        <td style="padding: 8px; color: #cbd5e1; font-size: 12px;">${v.description}</td>
        <td style="padding: 8px; color: #10b981; font-size: 12px;">${v.recommendation}</td>
      </tr>
    `).join('');

    const html = `
      <div style="background: #0f172a; color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 32px; max-width: 900px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #3b82f6; font-size: 28px; margin: 0;">🛡️ BackDoorScanner</h1>
          <p style="color: #64748b; margin-top: 4px;">Security Vulnerability Report</p>
        </div>
        <div style="background: #1e293b; border-radius: 12px; padding: 24px; margin-bottom: 24px; text-align: center;">
          <div style="display: inline-block; background: ${riskColor}; color: white; font-size: 32px; font-weight: 800; padding: 12px 24px; border-radius: 12px;">
            ${result.riskScore}/100
          </div>
          <p style="color: #94a3b8; margin-top: 8px;">Risk Score</p>
        </div>
        <div style="display: flex; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; justify-content: center;">
          <div style="background: #1e293b; padding: 12px 20px; border-radius: 8px;">
            <span style="color: #94a3b8;">Language:</span> <span style="color: #f1f5f9; text-transform: capitalize;">${result.language}</span>
          </div>
          <div style="background: #1e293b; padding: 12px 20px; border-radius: 8px;">
            <span style="color: #94a3b8;">Total Issues:</span> <span style="color: #f1f5f9;">${result.vulnerabilities?.length || 0}</span>
          </div>
          <div style="background: #1e293b; padding: 12px 20px; border-radius: 8px;">
            <span style="color: #ef4444;">Critical: ${severityCounts.critical}</span> |
            <span style="color: #f59e0b;"> High: ${severityCounts.high}</span> |
            <span style="color: #eab308;"> Medium: ${severityCounts.medium}</span> |
            <span style="color: #10b981;"> Low: ${severityCounts.low}</span>
          </div>
        </div>
        ${result.vulnerabilities?.length ? `
        <table style="width: 100%; border-collapse: collapse; background: #1e293b; border-radius: 8px; overflow: hidden;">
          <thead>
            <tr style="background: #3b82f6;">
              <th style="padding: 10px; text-align: left; color: white; font-size: 12px;">#</th>
              <th style="padding: 10px; text-align: left; color: white; font-size: 12px;">Type</th>
              <th style="padding: 10px; text-align: left; color: white; font-size: 12px;">Severity</th>
              <th style="padding: 10px; text-align: left; color: white; font-size: 12px;">Location</th>
              <th style="padding: 10px; text-align: left; color: white; font-size: 12px;">Description</th>
              <th style="padding: 10px; text-align: left; color: white; font-size: 12px;">Fix</th>
            </tr>
          </thead>
          <tbody>${vulnRows}</tbody>
        </table>
        ` : '<p style="text-align: center; color: #10b981;">No vulnerabilities found! ✅</p>'}
        <div style="text-align: center; margin-top: 32px; padding-top: 16px; border-top: 1px solid #1e293b;">
          <p style="color: #64748b; font-size: 12px;">Generated by BackDoorScanner — AI-Powered Code Vulnerability Scanner</p>
        </div>
      </div>
    `;

    // Use Lovable AI to "send" the email - in a real app you'd use Resend/SendGrid
    // For now we'll simulate email by returning the HTML content
    // The user would need to configure RESEND_API_KEY for actual sending
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    
    if (RESEND_API_KEY) {
      const { Resend } = await import("npm:resend@2.0.0");
      const resend = new Resend(RESEND_API_KEY);
      
      await resend.emails.send({
        from: "BackDoorScanner <noreply@resend.dev>",
        to: [email],
        subject: `Security Report — Risk Score: ${result.riskScore}/100`,
        html,
      });
      
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fallback: return success with note
    return new Response(JSON.stringify({ 
      success: true, 
      note: "Email simulation — configure RESEND_API_KEY for actual delivery" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Email error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
