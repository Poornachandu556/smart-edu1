import { NextRequest } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    
    // Validate input
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid payload: messages array is required" }), { 
        status: 400,
        headers: { "content-type": "application/json" }
      });
    }

    // Prefer Gemini if GOOGLE_API_KEY is configured
    const googleKey = process.env.GOOGLE_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    if (!googleKey && !openaiKey) {
      return new Response(
        JSON.stringify({ error: "Missing AI provider key. Set GOOGLE_API_KEY for Gemini or OPENAI_API_KEY for OpenAI." }),
        { status: 500, headers: { "content-type": "application/json" } }
      );
    }

    // If Gemini key is present, call Gemini
    if (googleKey) {
      // Transform OpenAI-style messages to Gemini content turns
      const roleMap: Record<string, "user" | "model"> = { user: "user", assistant: "model", system: "user" };
      const contents = (messages as Array<{ role: string; content: string }> )
        .filter((m) => typeof m?.content === "string")
        .map((m) => ({
          role: roleMap[m.role] ?? "user",
          parts: [{ text: m.content }],
        }));

      // Use stable v1 endpoint and latest-flavor model alias to avoid version lock (e.g., -002)
      const geminiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=${googleKey}`;

      try {
        const resp = await fetch(geminiUrl, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ contents }),
        });

        const data = await resp.json();
        if (!resp.ok) {
          const msg = data?.error?.message || `Gemini error ${resp.status}`;
          // If OpenAI is configured, auto-fallback instead of failing the request
          if (openaiKey) {
            console.warn("Gemini call failed, falling back to OpenAI:", msg);
          } else {
            return new Response(
              JSON.stringify({ error: msg, provider: "gemini", details: data, hint: "Ensure 'Generative Language API' is enabled for your Google Cloud project and the key has access to gemini-1.5-flash-latest." }),
              { status: resp.status, headers: { "content-type": "application/json" } }
            );
          }
        } else {
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a response.";
          return new Response(JSON.stringify({ text, provider: "gemini" }), {
            status: 200,
            headers: { "content-type": "application/json" },
          });
        }
      } catch (geminiErr: any) {
        // Network or parsing error; proceed to OpenAI fallback if available
        if (!openaiKey) {
          const message = geminiErr?.message || "Gemini request failed";
          return new Response(
            JSON.stringify({ error: message, provider: "gemini", type: geminiErr?.name || "Error" }),
            { status: 502, headers: { "content-type": "application/json" } }
          );
        }
      }
      // If we reach here, Gemini failed but OpenAI key exists; proceed to OpenAI below
    }

    // Otherwise use OpenAI
    const client = new OpenAI({ 
      apiKey: openaiKey!,
      // Support project-scoped keys if provided
      organization: process.env.OPENAI_ORG,
      project: process.env.OPENAI_PROJECT,
    });
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const text = completion.choices[0]?.message?.content ?? "I'm sorry, I couldn't generate a response. Please try again.";
    return new Response(JSON.stringify({ text, provider: "openai" }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (err) {
    console.error("AI API Error:", err);

    // Normalize error
    const anyErr: any = err as any;
    const status = typeof anyErr?.status === "number" ? anyErr.status : 500;
    const message = anyErr?.message || "AI request failed";
    const type = anyErr?.type || anyErr?.name || "UnknownError";
    const details = anyErr?.error || anyErr?.response || undefined;

    // Helpful buckets for common issues
    let hint = undefined as string | undefined;
    const lower = String(message).toLowerCase();
    if (lower.includes("api key") || lower.includes("authentication")) hint = "Check OPENAI_API_KEY or GOOGLE_API_KEY in your environment and restart the server.";
    else if (lower.includes("model") && lower.includes("not found")) hint = "Model not available for this key. For Gemini, ensure 'Generative Language API' is enabled and use 'gemini-1.5-flash-latest'. For OpenAI, try 'gpt-4o-mini'.";
    else if (lower.includes("rate") && lower.includes("limit")) hint = "Rate limit exceeded. Wait a minute and try again.";
    else if (lower.includes("network") || lower.includes("fetch")) hint = "Network issue. Verify internet/firewall access.";

    return new Response(
      JSON.stringify({ error: message, type, status, details, hint }),
      { status, headers: { "content-type": "application/json" } }
    );
  }
}


