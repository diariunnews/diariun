import { NextApiRequest, NextApiResponse } from "next";
import { randomUUID } from "crypto";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { keyword } = req.body;
  if (!keyword)
    return res.status(400).json({ error: "Keyword is required" });

  const MOZ_API_TOKEN = process.env.MOZ_API_TOKEN;
  if (!MOZ_API_TOKEN)
    return res.status(500).json({ error: "MOZ_API_TOKEN not set in environment" });

  // JSON-RPC 2.0 request body
  const payload = {
    jsonrpc: "2.0",
    id: randomUUID(),
    method: "data.keyword.search.intent.fetch",
    params: {
      data: {
        serp_query: {
          keyword,
          locale: "en-US",       // prueba primero con en-US, luego puedes poner es-ES si quieres
          device: "desktop",
          engine: "google"
        }
      }
    }
  };

  try {
    const mozRes = await fetch("https://api.moz.com/jsonrpc", {
      method: "POST",
      headers: {
        "x-moz-token": MOZ_API_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await mozRes.json();
    console.log("Moz API response:", data);

    if (!mozRes.ok || data.error) {
      return res.status(400).json({ error: data.error || "Error from Moz", details: data });
    }

    // Si hay result, lo mandamos tal cual
    return res.status(200).json({ result: data.result || null });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch from Moz API", details: err });
  }
}
