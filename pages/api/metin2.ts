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
      console.error("Missing OPENAI_API_KEY");
      return res.status(500).json({ error: "OPENAI_API_KEY is not set" });
    }

    const model = process.env.OPENAI_API_MODEL || "gpt-4o-mini"; // istersen "gpt-4o"
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
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

    const text = await resp.text(); // önce text al, sonra gerektiğinde parse et
    if (!resp.ok) {
      // Vercel Runtime Logs için
      console.error("OpenAI error", resp.status, text);
      let detail: any = {};
      try {
        detail = JSON.parse(text);
      } catch {}
      return res.status(resp.status).json({
        error: "OpenAI error",
        detail: detail?.error?.message || text || "Unknown error",
      });
    }

    // OK ise JSON'a güvenle parse et
    const data = JSON.parse(text);
    const reply = data?.choices?.[0]?.message?.content ?? "";
    return res.status(200).json({ reply });
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error("Server error:", e.message);
      return res.status(500).json({ error: e.message });
    }
    console.error("Unknown server error");
    return res.status(500).json({ error: "Unknown server error" });
  }
}
