import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

// Clientes Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// Para verificar el token del usuario (vale con anon key)
const supabasePublic = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
  auth: { persistSession: false },
});
// Para operar en DB como servidor (bypassa RLS). NUNCA exponer esta key en client.
const supabaseAdmin = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { persistSession: false },
});

async function requireAdmin(req: NextApiRequest) {
  // Lee el JWT del header
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return { ok: false, status: 401, error: "No auth" };

  // Verifica el token y obtiene el user
  const { data, error } = await supabasePublic.auth.getUser(token);
  const user = data?.user;
  if (error || !user) return { ok: false, status: 401, error: "Invalid token" };

  // Comprueba rol en profiles
  const { data: profile, error: pErr } = await supabaseAdmin
    .from("profiles")
    .select("rol")
    .eq("id", user.id)
    .single();

  if (pErr || !profile || !["admin", "staff"].includes(profile.rol)) {
    return { ok: false, status: 403, error: "Forbidden" };
  }
  return { ok: true, userId: user.id };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const guard = await requireAdmin(req);
  if (!guard.ok) return res.status(guard.status!).json({ error: guard.error });

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
        q = q.or(`email.ilike.%${search}%,display_name.ilike.%${search}%`);
      }

      const { data: profiles, error, count } = await q;
      if (error) throw error;

      const ids = (profiles || []).map((p) => p.id);
      let creditosByUser: Record<string, number> = {};
      if (ids.length) {
        const { data: creds } = await supabaseAdmin
          .from("creditos_usuario")
          .select("user_id,creditos")
          .in("user_id", ids);
        (creds || []).forEach((c) => (creditosByUser[c.user_id] = c.creditos));
      }

      const merged = (profiles || []).map((p) => ({
        ...p,
        creditos: creditosByUser[p.id] ?? 0,
        activo: !p.deleted_at,
      }));

      return res.status(200).json({ items: merged, total: count || 0, page, perPage });
    }

    if (req.method === "PATCH") {
      // Cambiar rol
      const { id, rol } = req.body as { id: string; rol: "user" | "staff" | "admin" };
      if (!id || !rol) return res.status(400).json({ error: "id y rol son obligatorios" });
      const { error } = await supabaseAdmin.from("profiles").update({ rol }).eq("id", id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    if (req.method === "POST") {
      const action = String(req.query.action || "");
      if (action === "credits") {
        const { id, creditos } = req.body as { id: string; creditos: number };
        if (!id || creditos == null) return res.status(400).json({ error: "id y creditos son obligatorios" });
        const { error } = await supabaseAdmin
          .from("creditos_usuario")
          .upsert({ user_id: id, creditos }, { onConflict: "user_id" });
        if (error) throw error;
        return res.status(200).json({ ok: true });
      }

      if (action === "toggle") {
        const { id, deactivate } = req.body as { id: string; deactivate: boolean };
        if (!id) return res.status(400).json({ error: "id requerido" });
        const patch = deactivate ? { deleted_at: new Date().toISOString() } : { deleted_at: null as any };
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
