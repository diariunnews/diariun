import type { NextApiRequest, NextApiResponse } from "next";

// Placeholder provisional (borra esto cuando tengas tu server SD)
const MOCK_IMAGE_URL = "https://placehold.co/512x512/png?text=Stable+Diffusion";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  // ==============================
  // Cuando tengas tu servidor SD, descomenta y adapta esto:
  /*
  try {
    const response = await fetch("http://TU-SERVIDOR-SD/endpoint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    if (!response.ok) throw new Error("Stable Diffusion server error");
    const data = await response.json();
    return res.status(200).json({
      imageUrl: data.imageUrl, // O la clave que devuelva tu server
    });
  } catch (err) {
    return res.status(500).json({ error: "Error comunicando con Stable Diffusion" });
  }
  */
  // ==============================

  // Mientras tanto, devuelve placeholder:
  return res.status(200).json({
    imageUrl: MOCK_IMAGE_URL,
  });
}
