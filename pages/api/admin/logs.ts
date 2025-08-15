// pages/api/admin/logs.ts
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

    const limit = Math.min(50, Math.max(1, Number(req.query.limit || 10)));

    const { data, error } = await supabaseAdmin
      .from("logs")
      .select("id,fecha,user_id,tipo,mensaje")
      .order("fecha", { ascending: false })
      .limit(limit);

    if (error) throw error;

    return res.status(200).json({ items: data || [] });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || "Server error" });
  }
}
