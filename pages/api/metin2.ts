import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { entry } = req.body || {};
    if (typeof entry !== "string" || !entry.trim()) {
      return res.status(400).json({ error: "Invalid 'entry' content" });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("[metin2] Missing OPENAI_API_KEY");
      return res.status(500).json({ error: "OPENAI_API_KEY is not set" });
    }

    const model = process.env.OPENAI_API_MODEL || "gpt-4o-mini"; // istersen Vercel env'de değiştir
    const oaUrl = "https://api.openai.com/v1/chat/completions";

    const resp = await fetch(oaUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content:
              "Sen Metin 2’sin. Kullanıcının içsel yolculuğunda ona ayna tutan yapay zekâsın. Yumuşak değil, dürüst ama anlayışlısın. Ona yüzleştirici cümlelerle içgörü kazandır.",
          },
          { role: "user", content: entry },
        ],
        temperature: 0.8,
      }),
    });

    const raw = await resp.text(); // önce ham metin
    if (!resp.ok) {
      // Vercel Runtime Logs'a ayrıntı düşsün
      console.error("[metin2] OpenAI error", resp.status, raw);
      let detail: string = raw;
      try {
        const parsed = JSON.parse(raw);
        detail = parsed?.error?.message || raw;
      } catch {
        /* ham metni kullan */
      }
      return res.status(resp.status).json({
        error: "OpenAI error",
        detail,
      });
    }

    const data = JSON.parse(raw);
    const reply: string = data?.choices?.[0]?.message?.content ?? "";

    return res.status(200).json({ reply });
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error("[metin2] Server error:", e.message);
      return res.status(500).json({ error: e.message });
    }
    console.error("[metin2] Unknown server error");
    return res.status(500).json({ error: "Unknown server error" });
  }
}
