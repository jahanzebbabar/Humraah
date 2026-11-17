// Vercel serverless function: POST /api/ai/chat
// The web app on Vercel has no Humraah server next to it, so this function calls Gemini itself.
// GEMINI_API_KEY lives only in Vercel's environment variables; it never ships inside the app.
// Request/response shape matches the Humraah server's /api/ai/chat, so src/lib/humraahAI.ts works unchanged.
import { findRelevantKnowledge } from '../_lib/knowledgeBase';

type Turn = { sender?: string; text?: string };
type Ctx = {
  userName?: string;
  language?: 'en' | 'ur';
  motherhoodStage?: string;
  pregnancyWeek?: number | null;
};

const MODELS = [process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite', 'gemini-3.6-flash'];
const UNAVAILABLE = {
  en: 'Humraah AI is not available right now. Please try again in a little while. If anything feels urgent, call your doctor or 1122.',
  ur: 'ہمراہ اے آئی اس وقت دستیاب نہیں۔ تھوڑی دیر بعد دوبارہ کوشش کریں۔ کوئی بات فوری لگے تو اپنے ڈاکٹر یا 1122 پر کال کریں۔',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

function systemInstruction(ctx: Ctx, message: string) {
  const stage = ctx.motherhoodStage || 'pregnancy';
  const snippets = findRelevantKnowledge(message, stage);
  const knowledge = snippets.length
    ? `\nHUMRAAH VERIFIED CLINICAL KNOWLEDGE:\n${snippets.map((s) => `[${s.title}] (${s.guidelineSource}): ${s.summary}`).join('\n')}`
    : '';
  return `
You are "Humraah" (ہمراہ), an authoritative, culturally empathetic Maternal & Newborn Health Companion for Pakistani mothers and families.
You support women across pre-conception, pregnancy, postpartum recovery, and newborn care.

USER PROFILE CONTEXT:
- Mother's Name: ${ctx.userName || 'Mama'}
- Stage: ${stage}
- Gestational Week: ${ctx.pregnancyWeek ?? 'N/A'}
- Reply language: ${ctx.language === 'ur' ? 'Urdu' : 'English'}
${knowledge}

CLINICAL & SAFETY RULES:
1. STRICTLY NON-DIAGNOSTIC: Never diagnose conditions or prescribe medicines. Suggest discussing with an obstetrician/pediatrician.
2. CULTURAL HARMONY: Be respectful of Pakistani maternal traditions (e.g. Chilla recovery, Panjeeri, desi remedies), explaining safe practices warmly while gently cautioning against harmful ones.
3. RED FLAGS: If the user mentions severe bleeding, unbearable abdominal pain, blurred vision with high BP, fluid leakage, or absent kicks, tell her clearly to call 1122 or go to hospital now.
4. Reply in plain text (no markdown headings), in 2–4 short, comforting, direct paragraphs.
`.trim();
}

async function callGemini(apiKey: string, model: string, system: string, contents: unknown[]) {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
    signal: AbortSignal.timeout(12000),
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents,
      generationConfig: { maxOutputTokens: 650, temperature: 0.4 },
    }),
  });
  if (!res.ok) throw new Error(`Gemini ${model} ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const data = await res.json();
  const text: string = (data?.candidates?.[0]?.content?.parts ?? []).map((p: { text?: string }) => p.text ?? '').join('').trim();
  if (!text) throw new Error(`Gemini ${model} returned no text`);
  return text;
}

export async function POST(request: Request): Promise<Response> {
  let body: { message?: unknown; history?: Turn[]; context?: Ctx };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }
  const message = typeof body.message === 'string' ? body.message.trim() : '';
  if (!message) return json({ error: 'Missing or invalid message string' }, 400);
  if (message.length > 2000) return json({ error: 'Message is too long' }, 413);

  const ctx: Ctx = body.context ?? {};
  const lang = ctx.language === 'ur' ? 'ur' : 'en';
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    console.error('[api/ai/chat] GEMINI_API_KEY is not set in Vercel environment variables');
    return json({ status: 'AI_UNAVAILABLE', text: UNAVAILABLE[lang], creditsConsumed: 0 }, 503);
  }

  // Last 6 turns, alternating, starting with the user (Gemini requires that).
  const contents: { role: 'user' | 'model'; parts: { text: string }[] }[] = [];
  for (const t of (Array.isArray(body.history) ? body.history : []).slice(-6)) {
    const text = typeof t?.text === 'string' ? t.text.trim().slice(0, 2000) : '';
    if (!text) continue;
    const role = t.sender === 'user' ? 'user' : 'model';
    if (!contents.length && role === 'model') continue;
    const last = contents[contents.length - 1];
    if (last?.role === role) last.parts[0].text += `\n${text}`;
    else contents.push({ role, parts: [{ text }] });
  }
  if (contents[contents.length - 1]?.role === 'user') contents[contents.length - 1].parts[0].text += `\n${message}`;
  else contents.push({ role: 'user', parts: [{ text: message }] });

  const system = systemInstruction(ctx, message);
  for (const model of MODELS) {
    try {
      const text = await callGemini(apiKey, model, system, contents);
      return json({ status: 'SUCCESS', text, providerUsed: 'gemini', modelUsed: model, creditsConsumed: 1 });
    } catch (e) {
      console.error('[api/ai/chat]', (e as Error).message);
    }
  }
  return json({ status: 'AI_UNAVAILABLE', text: UNAVAILABLE[lang], creditsConsumed: 0 }, 503);
}
