// pages/api/delete-user.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

// Solo usar Service Role Key aquí (NUNCA en frontend)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // El token se envía desde el frontend en el header Authorization
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "No token provided" });

  // 1. Obtener el usuario autenticado a partir del token
  const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
  if (userError || !user) return res.status(401).json({ error: "No user found" });

  // 2. Leer datos completos del perfil en profiles
  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) return res.status(404).json({ error: "Profile not found" });

  // 3. Copiar a deleted_accounts (si no existe ya)
  await supabaseAdmin
    .from("deleted_accounts")
    .upsert({
      id: user.id,
      email: user.email,
      user_metadata: user.user_metadata,
      original_data: profile,
      deleted_at: new Date().toISOString(),
    });

  // 4. Marcar el perfil como borrado (soft delete)
  await supabaseAdmin
    .from("profiles")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", user.id);

  return res.status(200).json({ success: true });
}
