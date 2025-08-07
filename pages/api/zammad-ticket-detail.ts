
// pages/api/zammad-ticket-detail.ts
import type { NextApiRequest, NextApiResponse } from "next";

const ZAMMAD_URL = process.env.ZAMMAD_API_URL!;
const ZAMMAD_TOKEN = process.env.ZAMMAD_API_TOKEN!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: "Falta ticket id" });

  if (req.method === "GET") {
    // Obtener historial de mensajes del ticket
    try {
      const zammadRes = await fetch(`${ZAMMAD_URL}/tickets/${id}/articles`, {
        headers: { "Authorization": `Token token=${ZAMMAD_TOKEN}` },
      });
      if (!zammadRes.ok) {
        const err = await zammadRes.text();
        return res.status(500).json({ error: "Error buscando historial", details: err });
      }
      const data = await zammadRes.json();
      res.status(200).json({ articles: data });
    } catch (err: any) {
      res.status(500).json({ error: "Error conexión Zammad", details: err.message });
    }
  }

  if (req.method === "POST") {
    // Responder al ticket
    const { body, subject, email } = req.body;
    if (!body || !subject || !email) return res.status(400).json({ error: "Campos obligatorios" });
    try {
      const payload = {
        subject,
        body,
        type: "web",
        internal: false,
      };
      const zammadRes = await fetch(`${ZAMMAD_URL}/tickets/${id}/articles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token token=${ZAMMAD_TOKEN}`,
        },
        body: JSON.stringify(payload),
      });
      if (!zammadRes.ok) {
        const err = await zammadRes.text();
        return res.status(500).json({ error: "Error enviando respuesta", details: err });
      }
      const data = await zammadRes.json();
      res.status(200).json({ article: data });
    } catch (err: any) {
      res.status(500).json({ error: "Error conexión Zammad", details: err.message });
    }
  }
}
