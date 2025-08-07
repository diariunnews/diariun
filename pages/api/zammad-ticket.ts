// pages/api/zammad-tickets.ts
import type { NextApiRequest, NextApiResponse } from "next";

const ZAMMAD_URL = process.env.ZAMMAD_API_URL!;
const ZAMMAD_TOKEN = process.env.ZAMMAD_API_TOKEN!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Falta email" });

  // Buscar tickets por cliente (customer)
  try {
    const zammadRes = await fetch(`${ZAMMAD_URL}/tickets/search?query=customer.email:${encodeURIComponent(email)}`, {
      headers: { "Authorization": `Token token=${ZAMMAD_TOKEN}` },
    });
    if (!zammadRes.ok) {
      const err = await zammadRes.text();
      return res.status(500).json({ error: "Error buscando tickets", details: err });
    }
    const data = await zammadRes.json();
    res.status(200).json({ tickets: data });
  } catch (err: any) {
    res.status(500).json({ error: "Error conexión Zammad", details: err.message });
  }
}
