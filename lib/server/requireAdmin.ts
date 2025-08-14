// lib/server/requireAdmin.ts
import type { NextApiRequest } from "next";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

type GuardOk = {
  ok: true;
  userId: string;
  profile: { rol: "user" | "staff" | "admin" };
  supabaseAdmin: SupabaseClient;
};

type GuardErr = {
  ok: false;
  status: 401 | 403;
  error: string;
};

export async function requireAdmin(req: NextApiRequest): Promise<GuardOk | GuardErr> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY!; // SOLO servidor

  const supabasePublic = createClient(url, anon, { auth: { persistSession: false } });
  const supabaseAdmin  = createClient(url, service, { auth: { persistSession: false } });

  // 1) JWT del header
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return { ok: false, status: 401, error: "No auth" };

  // 2) Verificar usuario
  const { data, error } = await supabasePublic.auth.getUser(token);
  const user = data?.user;
  if (error || !user) return { ok: false, status: 401, error: "Invalid token" };

  // 3) Comprobar rol en profiles
  const { data: profile, error: pErr } = await supabaseAdmin
    .from("profiles")
    .select("rol")
    .eq("id", user.id)
    .single();

  if (pErr || !profile || !["admin", "staff"].includes(profile.rol)) {
    return { ok: false, status: 403, error: "Forbidden" };
  }

  // 4) OK
  return { ok: true, userId: user.id, profile, supabaseAdmin };
}
