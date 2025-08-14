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
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // <- SOLO server
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
    const count = async (table: string, filter?: { column: string; is: any }) => {
      let q = supabaseAdmin.from(table).select("id", { count: "exact", head: true });
      if (filter) q = q.is(filter.column, filter.is);
      const { count, error } = await q;
      if (error) throw error;
      return count || 0;
    };

    const [users, articles, images, keywords] = await Promise.all([
      count("profiles", { column: "deleted_at", is: null }), // activos
      count("articulos"),
      count("imagenes"),
      count("keywords"),
    ]);

    return res.status(200).json({ users, articles, images, keywords });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || "Server error" });
  }
}
