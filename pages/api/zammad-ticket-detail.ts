import type { NextApiRequest, NextApiResponse } from "next";
import { ticketDetail } from "../../lib/zammadClient";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createPagesServerClient({ req, res });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return res.status(401).json({ error: "No auth" });

  try {
    if (req.method === "GET") {
      const id = Number(req.query.id);
      if (!id) return res.status(400).json({ error: "id requerido" });
      const data = await ticketDetail(id);
      return res.status(200).json(data);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || "Error Zammad" });
  }
}
