// pages/api/admin/users.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "../../../lib/server/requireAdmin";

type Rol = "user" | "staff" | "admin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const guard = await requireAdmin(req);

  // ✅ Narrowing seguro: si NO tiene supabaseAdmin, es el caso de error
  if (!("supabaseAdmin" in guard)) {
    return res.status(guard.status).json({ error: guard.error });
  }

  const { supabaseAdmin } = guard;

  try {
    if (req.method === "GET") {
      const search = String(req.query.search || "").trim();
      const page = Math.max(1, Number(req.query.page || 1));
      const perPage = Math.min(50, Math.max(5, Number(req.query.perPage || 20)));
      const from = (page - 1) * perPage;
      const to = from + perPage - 1;

      let q = supabaseAdmin
        .from("profiles")
        .select("id,email,display_name,avatar_url,rol,created_at,deleted_at", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to);

      if (search) {
        // Busca por email o display_name
        q = q.or(`email.ilike.%${search}%,display_name.ilike.%${search}%`);
      }

      const { data: profiles, error, count } = await q;
      if (error) throw error;

      // Juntamos créditos
      const ids = (profiles || []).map((p) => p.id);
      let creditosByUser: Record<string, number> = {};
      if (ids.length) {
        const { data: creds } = await supabaseAdmin
          .from("creditos_usuario")
          .select("user_id,creditos")
          .in("user_id", ids);
        (creds || []).forEach((c) => (creditosByUser[c.user_id] = c.creditos));
      }

      const items = (profiles || []).map((p) => ({
        ...p,
        creditos: creditosByUser[p.id] ?? 0,
        activo: !p.deleted_at,
      }));

      return res.status(200).json({ items, total: count || 0, page, perPage });
    }

    if (req.method === "PATCH") {
      // Cambiar rol
      const { id, rol } = req.body as { id: string; rol: Rol };
      if (!id || !rol) return res.status(400).json({ error: "id y rol son obligatorios" });
      if (!["user", "staff", "admin"].includes(rol)) {
        return res.status(400).json({ error: "rol inválido" });
      }

      const { error } = await supabaseAdmin.from("profiles").update({ rol }).eq("id", id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    if (req.method === "POST") {
      const action = String(req.query.action || "");

      if (action === "credits") {
        // Upsert créditos
        const { id, creditos } = req.body as { id: string; creditos: number };
        if (!id || creditos == null) return res.status(400).json({ error: "id y creditos son obligatorios" });

        const { error } = await supabaseAdmin
          .from("creditos_usuario")
          .upsert({ user_id: id, creditos }, { onConflict: "user_id" });
        if (error) throw error;

        return res.status(200).json({ ok: true });
      }

      if (action === "toggle") {
        // Activar/Desactivar usuario (soft delete via deleted_at)
        const { id, deactivate } = req.body as { id: string; deactivate: boolean };
        if (!id) return res.status(400).json({ error: "id requerido" });

        const patch = deactivate
          ? { deleted_at: new Date().toISOString() }
          : ({ deleted_at: null } as any);

        const { error } = await supabaseAdmin.from("profiles").update(patch).eq("id", id);
        if (error) throw error;

        return res.status(200).json({ ok: true });
      }

      return res.status(400).json({ error: "Acción no soportada" });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || "Server error" });
  }
}
