// pages/api/zammad-tickets.ts
import type { NextApiRequest, NextApiResponse } from "next";

const ZAMMAD_URL = process.env.ZAMMAD_API_URL;   // ej: https://soporte.diariun.com/api/v1
const ZAMMAD_TOKEN = process.env.ZAMMAD_API_TOKEN;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Solo POST (enviamos el email del usuario)
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Falta email" });

  // ----- MOCK: sin configurar Zammad mostramos datos de ejemplo -----
  if (!ZAMMAD_URL || !ZAMMAD_TOKEN) {
    return res.status(200).json({
      tickets: [
        { id: 101, title: "Ejemplo de ticket", state: "open", created_at: "2025-08-01T12:01:00Z" },
        { id: 102, title: "Problema de acceso", state: "closed", created_at: "2025-08-04T09:20:00Z" },
      ],
    });
  }

  // ----- REAL: descomenta esto cuando tengas Zammad -----
  // try {
  //   const q = `customer.email:${encodeURIComponent(email)}`;
  //   const r = await fetch(`${ZAMMAD_URL}/tickets/search?query=${q}`, {
  //     headers: { Authorization: `Token token=${ZAMMAD_TOKEN}` },
  //   });
  //   const text = await r.text();
  //   if (!r.ok) return res.status(500).json({ error: "Error Zammad", details: text });
  //   const data = JSON.parse(text);
  //   return res.status(200).json({ tickets: data });
  // } catch (e: any) {
  //   return res.status(500).json({ error: "Error de conexión Zammad", details: e.message });
  // }
}
