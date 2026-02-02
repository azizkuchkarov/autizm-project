import OpenAI from "openai";

export const runtime = "nodejs";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { error: "OPENAI_API_KEY topilmadi. (.env.local yoki Vercel env)" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const prompt = buildPrompt(body);

    const resp = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content:
            "You write parent-friendly Uzbek screening explanations. No diagnosis. Output STRICT JSON only.",
        },
        { role: "user", content: prompt },
      ],
    });

    const text = resp.choices?.[0]?.message?.content || "{}";
    const data = safeJson(text);

    return Response.json(data, { status: 200 });
  } catch (e: any) {
    console.error("AI ERROR:", e?.message, e);
    return Response.json(
      { error: e?.message || "AI server error" },
      { status: 500 }
    );
  }
}

function buildPrompt(payload: any) {
  const child = payload?.child || {};
  const warmup = payload?.warmup || {};
  const scores = payload?.scores || {};

  return `
IMPORTANT:
- This is a SCREENING, NOT a diagnosis.
- Do NOT say the child "has autism". Do NOT provide medical diagnosis.
- Calm, supportive Uzbek.
- If you mention ADHD, ASD, or Sensor sezgirlik, include a short explanation in parentheses.
- Return STRICT JSON with keys:
  summary (string),
  why (array of 3-5 strings),
  nextSteps (array of 3-5 strings),
  disclaimer (string),
  usedTerms (array of strings among ["ADHD","ASD","Sensor sezgirlik"] if mentioned)

DATA:
Child=${JSON.stringify(child)}
Warmup=${JSON.stringify(warmup)}
Scores=${JSON.stringify(scores)}

Return ONLY JSON.
`;
}

function safeJson(text: string) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  const slice = start >= 0 && end > start ? text.slice(start, end + 1) : "{}";
  try {
    return JSON.parse(slice);
  } catch {
    return {
      summary:
        "AI javobi noto‘g‘ri formatda keldi. Iltimos, qayta urinib ko‘ring.",
      why: [],
      nextSteps: [],
      disclaimer:
        "Eslatma: Bu skrining — diagnosis emas. Zarurat bo‘lsa mutaxassisga murojaat qiling.",
      usedTerms: [],
    };
  }
}
