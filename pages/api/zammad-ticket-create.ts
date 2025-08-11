// pages/api/zammad-ticket-create.ts
import type { NextApiRequest, NextApiResponse } from "next";

const ZAMMAD_URL = process.env.ZAMMAD_API_URL;
const ZAMMAD_TOKEN = process.env.ZAMMAD_API_TOKEN;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { email, nombre, subject, body, category } = req.body || {};
  if (!email || !subject || !body) return res.status(400).json({ error: "Faltan campos (email, subject, body)" });

  // ----- MOCK -----
  if (!ZAMMAD_URL || !ZAMMAD_TOKEN) {
    return res.status(200).json({
      success: true,
      ticket: { id: Math.floor(Math.random() * 10000), title: subject, state: "open", created_at: new Date().toISOString() },
    });
  }

  // ----- REAL (descomentar al conectar Zammad) -----
  // try {
  //   const payload = {
  //     title: subject,
  //     group: "Users",         // ajusta según tus grupos en Zammad
  //     customer: email,
  //     article: {
  //       subject,
  //       body: `Categoría: ${category || "general"}\n\n${body}`,
  //       type: "web",
  //       internal: false,
  //     },
  //     tags: category ? [category] : [],
  //   };
  //   const r = await fetch(`${ZAMMAD_URL}/tickets`, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json", Authorization: `Token token=${ZAMMAD_TOKEN}` },
  //     body: JSON.stringify(payload),
  //   });
  //   const text = await r.text();
  //   if (!r.ok) return res.status(500).json({ error: "Error Zammad", details: text });
  //   const data = JSON.parse(text);
  //   return res.status(200).json({ success: true, ticket: data });
  // } catch (e: any) {
  //   return res.status(500).json({ error: "Error conexión Zammad", details: e.message });
  // }
}
