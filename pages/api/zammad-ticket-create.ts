import type { NextApiRequest, NextApiResponse } from "next";
import { createTicket } from "../../lib/zammadClient";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createPagesServerClient({ req, res });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return res.status(401).json({ error: "No auth" });

  try {
    if (req.method === "POST") {
      const { title, body, group } = req.body as { title: string; body: string; group?: string | number };
      if (!title || !body) return res.status(400).json({ error: "title y body son obligatorios" });

      const customer = user.email || undefined; // usa el email del usuario como “customer”
      const payload = {
        title,
        group, // si no envías group, Zammad usará el default
        customer,
        article: { body, type: "note", internal: false },
      };

      const created = await createTicket(payload);
      return res.status(201).json(created);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || "Error Zammad" });
  }
}
