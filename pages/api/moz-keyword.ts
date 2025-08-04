import { NextApiRequest, NextApiResponse } from "next";

// Si usas Node.js puro, importa crypto para generar el id único:
import { randomUUID } from "crypto"; // Puedes usar cualquier string largo si quieres

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { keyword } = req.body;
  if (!keyword) return res.status(400).json({ error: "Keyword is required" });

  const MOZ_API_TOKEN = process.env.MOZ_API_TOKEN;
  if (!MOZ_API_TOKEN) return res.status(500).json({ error: "MOZ_API_TOKEN not set" });

  const endpointUrl = "https://api.moz.com/jsonrpc";
  const payload = {
    jsonrpc: "2.0",
    id: randomUUID(), // O un string largo único (ej: Date.now().toString() + Math.random())
    method: "data.keyword.search.intent.fetch",
    params: {
      data: {
        keyword: keyword, // <--- la palabra a analizar
        search_engine: "google", // Puedes poner google.com, google.es, etc
        locale: "en-US", // Cambia si quieres otro idioma/localización
      },
    },
  };

  try {
    const mozRes = await fetch(endpointUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-moz-token": MOZ_API_TOKEN, // ¡No Authorization!
      },
      body: JSON.stringify(payload),
    });

    const data = await mozRes.json();
    if (!mozRes.ok || data.error) {
      return res.status(400).json({ error: data.error || "Error from Moz", details: data });
    }

    return res.status(200).json(data.result); // Aquí están los resultados
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch from Moz API", details: err });
  }
}
