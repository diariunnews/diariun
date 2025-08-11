// pages/api/zammad-ticket-detail.ts
import type { NextApiRequest, NextApiResponse } from "next";

const ZAMMAD_URL = process.env.ZAMMAD_API_URL;
const ZAMMAD_TOKEN = process.env.ZAMMAD_API_TOKEN;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: "Falta ticket id" });

  // ----- MOCK sin Zammad -----
  if (!ZAMMAD_URL || !ZAMMAD_TOKEN) {
    if (req.method === "GET") {
      return res.status(200).json({
        ticket: { id, title: "Ejemplo de ticket", state: "open", created_at: "2025-08-01T12:01:00Z" },
        articles: [
          { id: 1, from: "customer", body: "Hola, tengo una duda sobre mi cuenta.", created_at: "2025-08-01T12:05:00Z" },
          { id: 2, from: "agent", body: "¡Hola! ¿Puedes darnos más detalles?", created_at: "2025-08-01T12:25:00Z" },
        ],
      });
    }
    if (req.method === "POST") {
      // Simulamos respuesta creada
      return res.status(200).json({
        article: { id: Math.floor(Math.random() * 10000), from: "customer", body: req.body?.body || "", created_at: new Date().toISOString() },
      });
    }
  }

  // ----- REAL (descomentar al conectar Zammad) -----
  // if (req.method === "GET") {
  //   try {
  //     const r = await fetch(`${ZAMMAD_URL}/tickets/${id}/articles`, {
  //       headers: { Authorization: `Token token=${ZAMMAD_TOKEN}` },
  //     });
  //     const text = await r.text();
  //     if (!r.ok) return res.status(500).json({ error: "Error Zammad", details: text });
  //     const articles = JSON.parse(text);
  //
  //     // Opcional: también podemos pedir datos del ticket
  //     // const tR = await fetch(`${ZAMMAD_URL}/tickets/${id}`, { headers: { Authorization: `Token token=${ZAMMAD_TOKEN}` }});
  //     // const tText = await tR.text(); const ticket = JSON.parse(tText);
  //
  //    return res.status(200).json({ ticket: { id }, articles });
  //   } catch (e: any) {
  //     return res.status(500).json({ error: "Error de conexión Zammad", details: e.message });
  //   }
  // }
  //
  // if (req.method === "POST") {
  //   const { body, subject } = req.body || {};
  //   if (!body || !subject) return res.status(400).json({ error: "Faltan campos (body, subject)" });
  //   try {
  //     const payload = { subject, body, type: "web", internal: false };
  //     const r = await fetch(`${ZAMMAD_URL}/tickets/${id}/articles`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json", Authorization: `Token token=${ZAMMAD_TOKEN}` },
  //       body: JSON.stringify(payload),
  //     });
  //     const text = await r.text();
  //     if (!r.ok) return res.status(500).json({ error: "Error Zammad", details: text });
  //     const data = JSON.parse(text);
  //     return res.status(200).json({ article: data });
  //   } catch (e: any) {
  //     return res.status(500).json({ error: "Error de conexión Zammad", details: e.message });
  //   }
  // }

  return res.status(405).json({ error: "Method not allowed" });
}
