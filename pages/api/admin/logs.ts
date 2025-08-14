import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabasePublic = createClient(
  supabaseUrl,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { persistSession: false } }
);
const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // SOLO server
  { auth: { persistSession: false } }
);

async function requireAdmin(req: NextApiRequest) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return { ok: false, status: 401, error: "No auth" };

  const { data, error } = await supabasePublic.auth.getUser(token);
  const user = data?.user;
  if (error || !user) return { ok: false, status: 401, error: "Invalid token" };

  const { data: profile, error: pErr } = await supabaseAdmin
    .from("profiles")
    .select("rol")
    .eq("id", user.id)
    .single();

  if (pErr || !profile || !["admin", "staff"].includes(profile.rol)) {
    return { ok: false, status: 403, error: "Forbidden" };
  }
  return { ok: true };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const guard = await requireAdmin(req);
  if (!guard.ok) return res.status(guard.status!).json({ error: guard.error });

  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
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
