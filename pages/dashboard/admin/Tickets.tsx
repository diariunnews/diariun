import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../../components/DashboardLayout";
import AdminRoute from "../../../components/AdminRoute";
import { useAuth } from "../../../context/AuthContext";
import { LifeBuoy, RefreshCcw, Search, ExternalLink, MessagesSquare } from "lucide-react";
import BackButton from "../../../components/BackButton";

/**
 * Internos (mirror en Supabase)
 * Si aún no tienes tablas, el código las detecta y te muestra instrucciones.
 * Sugerencia SQL (para ejecutar luego):
 *
 * create table if not exists public.support_tickets (
 *   id uuid primary key default gen_random_uuid(),
 *   user_id uuid references auth.users(id),
 *   subject text not null,
 *   status text not null default 'open',   -- open|pending|closed
 *   priority text not null default 'normal', -- low|normal|high|urgent
 *   external_id int, -- id en Zammad (opcional)
 *   created_at timestamptz default now()
 * );
 *
 * create table if not exists public.support_messages (
 *   id uuid primary key default gen_random_uuid(),
 *   ticket_id uuid references public.support_tickets(id) on delete cascade,
 *   user_id uuid references auth.users(id),
 *   sender text not null, -- 'user'|'staff'
 *   body text not null,
 *   created_at timestamptz default now()
 * );
 */

type ZammadTicket = {
  id: number;
  number?: string;
  title: string;
  state?: string;
  created_at?: string;
};

type InternalTicket = {
  id: string;
  subject: string;
  status: string;
  priority: string;
  created_at: string;
  user_id: string | null;
};

export default function AdminTickets() {
  const { supabase } = useAuth();
  const [tab, setTab] = useState<"externos" | "internos">("externos");

  // EXTERNOS (ZAMMAD)
  const [zamTickets, setZamTickets] = useState<ZammadTicket[]>([]);
  const [zamLoading, setZamLoading] = useState(false);
  const [qZam, setQZam] = useState("");

  // INTERNOS
  const [intTickets, setIntTickets] = useState<InternalTicket[]>([]);
  const [intLoading, setIntLoading] = useState(false);
  const [intErr, setIntErr] = useState<string | null>(null);
  const [qInt, setQInt] = useState("");

  const loadZammad = async () => {
    setZamLoading(true);
    try {
      const res = await fetch(`/api/zammad/proxy?list=1&page=1`);
      const json = await res.json();
      setZamTickets(json.tickets || []);
    } catch (e) {
      // mock si no hay .env
      setZamTickets([
        { id: 101, title: "Mock: No hay configuración Zammad", state: "new", created_at: new Date().toISOString() },
      ]);
    }
    setZamLoading(false);
  };

  const loadInternal = async () => {
    setIntLoading(true);
    setIntErr(null);
    try {
      const { data, error } = await supabase
        .from("support_tickets")
        .select("id, subject, status, priority, created_at, user_id")
        .order("created_at", { ascending: false });
      if (error) {
        // tabla no existe
        if ((error as any)?.code === "42P01") {
          setIntErr("Tablas internas no creadas aún. Abre el desplegable para ver el SQL sugerido.");
          setIntTickets([]);
        } else {
          setIntErr(error.message);
          setIntTickets([]);
        }
      } else {
        setIntTickets((data as any) || []);
      }
    } catch (e: any) {
      setIntErr(e.message);
      setIntTickets([]);
    }
    setIntLoading(false);
  };

  useEffect(() => {
    if (tab === "externos") loadZammad();
    if (tab === "internos") loadInternal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const filteredZam = useMemo(() => {
    const s = qZam.trim().toLowerCase();
    if (!s) return zamTickets;
    return zamTickets.filter(
      (t) =>
        (t.title || "").toLowerCase().includes(s) ||
        String(t.id).includes(s) ||
        (t.state || "").toLowerCase().includes(s)
    );
  }, [qZam, zamTickets]);

  const filteredInt = useMemo(() => {
    const s = qInt.trim().toLowerCase();
    if (!s) return intTickets;
    return intTickets.filter(
      (t) =>
        (t.subject || "").toLowerCase().includes(s) ||
        (t.status || "").toLowerCase().includes(s) ||
        (t.priority || "").toLowerCase().includes(s) ||
        (t.user_id || "").toLowerCase().includes(s)
    );
  }, [qInt, intTickets]);

  const fmt = (d?: string | null) => {
    if (!d) return "—";
    const dt = new Date(d);
    return dt.toLocaleString();
  };

  return (
    <AdminRoute>
      <DashboardLayout>
        <BackButton backHref="/dashboard/admin" className="mb-6" />
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-3 mb-6">
            <LifeBuoy className="text-blue-600" size={28} />
            <h1 className="text-3xl font-bold">Tickets</h1>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow p-2 mb-6 flex gap-2">
            <button
              className={`px-4 py-2 rounded-lg font-semibold ${tab === "externos" ? "bg-black text-white" : "bg-gray-100 text-gray-800"}`}
              onClick={() => setTab("externos")}
            >
              Externos (Zammad)
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-semibold ${tab === "internos" ? "bg-black text-white" : "bg-gray-100 text-gray-800"}`}
              onClick={() => setTab("internos")}
            >
              Internos (Supabase)
            </button>
          </div>

          {tab === "externos" && (
            <>
              {/* Filtros */}
              <div className="bg-white rounded-2xl shadow p-4 mb-4">
                <div className="flex items-center gap-3">
                  <Search size={18} className="text-gray-500" />
                  <input
                    className="flex-1 border rounded-lg px-3 py-2"
                    placeholder="Buscar por título, estado o ID…"
                    value={qZam}
                    onChange={(e) => setQZam(e.target.value)}
                  />
                  <button
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                    onClick={loadZammad}
                    title="Refrescar"
                  >
                    <RefreshCcw size={16} /> Refrescar
                  </button>
                </div>
              </div>

              {/* Lista Zammad */}
              <div className="bg-white rounded-2xl shadow overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-gray-500 text-sm">
                      <th className="py-3 px-4">ID</th>
                      <th className="py-3 px-4">Título</th>
                      <th className="py-3 px-4">Estado</th>
                      <th className="py-3 px-4">Creado</th>
                      <th className="py-3 px-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {zamLoading ? (
                      <tr><td className="py-6 px-4" colSpan={5}>Cargando…</td></tr>
                    ) : filteredZam.length === 0 ? (
                      <tr><td className="py-6 px-4 text-gray-500" colSpan={5}>Sin tickets.</td></tr>
                    ) : (
                      filteredZam.map((t) => (
                        <tr key={t.id} className="border-t last:border-b">
                          <td className="py-3 px-4">{t.id}</td>
                          <td className="py-3 px-4">{t.title}</td>
                          <td className="py-3 px-4">{t.state || "—"}</td>
                          <td className="py-3 px-4">{fmt(t.created_at)}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2 justify-end">
                              <a
                                href={`/dashboard/soporte`} // o detalle externo más adelante
                                className="px-3 py-1 rounded-lg bg-gray-100 text-sm flex items-center gap-2"
                              >
                                <ExternalLink size={16} /> Ver detalle
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {tab === "internos" && (
            <>
              {/* Filtros */}
              <div className="bg-white rounded-2xl shadow p-4 mb-4">
                <div className="flex items-center gap-3">
                  <Search size={18} className="text-gray-500" />
                  <input
                    className="flex-1 border rounded-lg px-3 py-2"
                    placeholder="Buscar por asunto, estado, prioridad o user_id…"
                    value={qInt}
                    onChange={(e) => setQInt(e.target.value)}
                  />
                  <button
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                    onClick={loadInternal}
                    title="Refrescar"
                  >
                    <RefreshCcw size={16} /> Refrescar
                  </button>
                </div>
              </div>

              {intErr && (
                <details className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
                  <summary className="font-semibold text-yellow-800 cursor-pointer">
                    {intErr}
                  </summary>
                  <pre className="mt-3 text-xs text-yellow-900 whitespace-pre-wrap">
{`-- Crea tablas internas sugeridas:
create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  subject text not null,
  status text not null default 'open',
  priority text not null default 'normal',
  external_id int,
  created_at timestamptz default now()
);

create table if not exists public.support_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid references public.support_tickets(id) on delete cascade,
  user_id uuid references auth.users(id),
  sender text not null,
  body text not null,
  created_at timestamptz default now()
);
`}
                  </pre>
                </details>
              )}

              {/* Lista internos */}
              <div className="bg-white rounded-2xl shadow overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-gray-500 text-sm">
                      <th className="py-3 px-4">Asunto</th>
                      <th className="py-3 px-4">Estado</th>
                      <th className="py-3 px-4">Prioridad</th>
                      <th className="py-3 px-4">Usuario</th>
                      <th className="py-3 px-4">Creado</th>
                      <th className="py-3 px-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {intLoading ? (
                      <tr><td className="py-6 px-4" colSpan={6}>Cargando…</td></tr>
                    ) : filteredInt.length === 0 ? (
                      <tr><td className="py-6 px-4 text-gray-500" colSpan={6}>Sin tickets internos.</td></tr>
                    ) : (
                      filteredInt.map((t) => (
                        <tr key={t.id} className="border-t last:border-b">
                          <td className="py-3 px-4">{t.subject}</td>
                          <td className="py-3 px-4">{t.status}</td>
                          <td className="py-3 px-4">{t.priority}</td>
                          <td className="py-3 px-4">{t.user_id || "—"}</td>
                          <td className="py-3 px-4">{fmt(t.created_at)}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2 justify-end">
                              <a
                                href={`/dashboard/soporte`} // puedes crear /dashboard/admin/tickets/[id] si quieres detalle propio
                                className="px-3 py-1 rounded-lg bg-gray-100 text-sm flex items-center gap-2"
                              >
                                <MessagesSquare size={16} /> Responder
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </DashboardLayout>
    </AdminRoute>
  );
}
