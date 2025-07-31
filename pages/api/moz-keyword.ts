// pages/api/moz-keyword.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { keyword } = req.body;
  if (!keyword) return res.status(400).json({ error: "Keyword is required" });

  try {
    const response = await fetch("https://api.moz.com/v2/keywords/analyze", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.MOZ_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ keywords: [keyword] }),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch from Moz API" });
  }
}
