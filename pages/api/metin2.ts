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
      return res.status(500).json({ error: "OPENAI_API_KEY is not set" });
    }

    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Sen Metin 2’sin. Kullanıcının içsel yolculuğunda ona ayna tutan yapay zekâsın. Yumuşak değil, dürüst ama anlayışlısın. Ona yüzleştirici cümlelerle içgörü kazandır."
          },
          { role: "user", content: entry }
        ],
        temperature: 0.8
      })
    });

    if (!resp.ok) {
      const t = await resp.text();
      return res.status(502).json({ error: "OpenAI error", detail: t });
    }

    const data = await resp.json();
    const reply = data?.choices?.[0]?.message?.content ?? "";

    return res.status(200).json({ reply });
  } catch (e: unknown) {
    if (e instanceof Error) {
      return res.status(500).json({ error: e.message });
    }
    return res.status(500).json({ error: "Unknown server error" });
  }
}
