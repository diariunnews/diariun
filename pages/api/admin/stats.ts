// pages/api/admin/stats.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "../../../lib/server/requireAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const guard = await requireAdmin(req);

  // ✅ Narrowing seguro: si NO tiene supabaseAdmin, es el caso de error
  if (!("supabaseAdmin" in guard)) {
    return res.status(guard.status).json({ error: guard.error });
  }

  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { supabaseAdmin } = guard;

    const count = async (table: string, filter?: { column: string; is: any }) => {
      let q = supabaseAdmin.from(table).select("id", { count: "exact", head: true });
      if (filter) q = q.is(filter.column, filter.is);
      const { count, error } = await q;
      if (error) throw error;
      return count ?? 0;
    };

    const [users, articles, images, keywords] = await Promise.all([
      count("profiles", { column: "deleted_at", is: null }), // solo activos
      count("articulos"),
      count("imagenes"),
      count("keywords"),
    ]);

    return res.status(200).json({ users, articles, images, keywords });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || "Server error" });
  }
}
