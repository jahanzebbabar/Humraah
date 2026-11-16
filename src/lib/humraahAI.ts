/**
 * Talks to the Humraah server (D:\NBS_app\server.ts), which calls Gemini with the GEMINI_API_KEY it
 * keeps server-side. The key never ships inside the app: anything bundled into the app can be extracted.
 *
 * Set EXPO_PUBLIC_HUMRAAH_API_URL in mobile/.env.local (e.g. http://192.168.1.20:3000 for a phone on
 * your Wi-Fi, http://localhost:3000 for web). Leave it empty to keep the offline canned replies.
 */
const API_URL = (process.env.EXPO_PUBLIC_HUMRAAH_API_URL ?? '').replace(/\/+$/, '');

export const humraahAIConfigured = API_URL.length > 0;

export type HumraahTurn = { sender: 'user' | 'ai'; text: string };

export type HumraahContext = {
  userId?: string;
  userName?: string;
  language: 'en' | 'ur';
  stage: 'Expecting' | 'New mom';
  week?: number;
};

/** Returns Gemini's reply, or null when the server is not configured, unreachable or out of quota. */
export async function askHumraahAI(message: string, history: HumraahTurn[], ctx: HumraahContext): Promise<string | null> {
  if (!humraahAIConfigured) return null;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  try {
    const res = await fetch(`${API_URL}/api/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        message,
        history: history.slice(-10),
        context: {
          userId: ctx.userId,
          userName: ctx.userName,
          language: ctx.language,
          motherhoodStage: ctx.stage === 'Expecting' ? 'pregnancy' : 'postpartum',
          pregnancyWeek: ctx.stage === 'Expecting' ? ctx.week ?? null : null,
          goals: [],
          wellnessPreferences: [],
        },
      }),
    });
    const data = await res.json().catch(() => null);
    const text: unknown = data?.text;
    // Quota/unavailable responses still carry a friendly message in `text`, so show it if present.
    return typeof text === 'string' && text.trim() ? text.trim() : null;
  } catch (e) {
    console.warn('[humraah ai]', (e as Error).message);
    return null;
  } finally {
    clearTimeout(timer);
  }
}
