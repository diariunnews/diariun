// pages/api/zammad/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { zammadFetch } from "../../../lib/zammadClient";

async function requireAdmin(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createPagesServerClient({ req, res });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, status: 401, error: "No auth" };

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("rol")
    .eq("id", user.id)
    .single();

  if (error || !profile || !["admin", "staff"].includes(profile.rol)) {
    return { ok: false, status: 403, error: "Forbidden" };
  }
  return { ok: true };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Guard (solo admin/staff)
  const guard = await requireAdmin(req, res);
  if (!guard.ok) return res.status(guard.status!).json({ error: guard.error });

  try {
    if (req.method === "GET") {
      // Listado
      if (req.query.list) {
        const page = Number(req.query.page || 1);
        const tickets = await zammadFetch(`/tickets?per_page=25&page=${page}`, { method: "GET" });
        return res.status(200).json({ tickets });
      }
      // Detalle
      if (req.query.id) {
        const id = Number(req.query.id);
        if (!id) return res.status(400).json({ error: "id inválido" });
        const detail = await zammadFetch(`/tickets/${id}?include=articles`, { method: "GET" });
        return res.status(200).json(detail);
      }
      return res.status(400).json({ error: "Parámetros no soportados" });
    }

    if (req.method === "POST") {
      const action = String(req.query.action || "");

      // Crear ticket
      if (action === "create") {
        const { title, group, customer, body } = req.body as {
          title: string; group?: string | number; customer?: string; body: string;
        };
        if (!title || !body) return res.status(400).json({ error: "title y body son obligatorios" });

        const payload = { title, group, customer, article: { body, type: "note", internal: false } };
        const created = await zammadFetch(`/tickets`, { method: "POST", body: JSON.stringify(payload) });
        return res.status(201).json(created);
      }

      // Responder a un ticket
      if (action === "reply") {
        const { ticket_id, body, internal } = req.body as { ticket_id: number; body: string; internal?: boolean };
        if (!ticket_id || !body) return res.status(400).json({ error: "ticket_id y body son obligatorios" });

        const payload = { ticket_id, body, type: "note", internal: !!internal };
        const reply = await zammadFetch(`/ticket_articles`, { method: "POST", body: JSON.stringify(payload) });
        return res.status(201).json(reply);
      }

      return res.status(400).json({ error: "Acción no soportada" });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || "Error Zammad" });
  }
}
