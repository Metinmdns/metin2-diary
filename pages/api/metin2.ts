import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { entry } = req.body;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4",
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

  const data = await response.json();
  res.status(200).json({ reply: data.choices[0].message.content });
}