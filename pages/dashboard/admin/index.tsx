import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardLayout from "../../../components/DashboardLayout";
import AdminRoute from "../../../components/AdminRoute";
import { useAuth } from "../../../context/AuthContext";
import { Users, FileText, Image as ImageIcon, Tag, ChevronRight, Activity } from "lucide-react";

type Metric = {
  label: string;
  count: number | null;
  href: string;
  icon: any;
};

type LogRow = {
  id: number;
  fecha: string | null;
  user_id: string | null;
  tipo: string;
  mensaje: string;
};

export default function AdminHome() {
  const { supabase } = useAuth();
  const [metrics, setMetrics] = useState<Metric[]>([
    { label: "Usuarios", count: null, href: "/dashboard/admin/users", icon: Users },
    { label: "Artículos", count: null, href: "/dashboard/articulos", icon: FileText },
    { label: "Imágenes", count: null, href: "/dashboard/imagenes", icon: ImageIcon },
    { label: "Keywords", count: null, href: "/dashboard/keywords", icon: Tag },
  ]);
  const [logs, setLogs] = useState<LogRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      // Contadores (count: 'exact', head: true)
      const [{ count: cUsers }, { count: cArts }, { count: cImgs }, { count: cKws }] =
        await Promise.all([
          supabase.from("profiles").select("*", { count: "exact", head: true }),
          supabase.from("articulos").select("*", { count: "exact", head: true }),
          supabase.from("imagenes").select("*", { count: "exact", head: true }),
          supabase.from("keywords").select("*", { count: "exact", head: true }),
        ]);

      setMetrics((prev) =>
        prev.map((m) => {
          if (m.label === "Usuarios") return { ...m, count: cUsers ?? 0 };
          if (m.label === "Artículos") return { ...m, count: cArts ?? 0 };
          if (m.label === "Imágenes") return { ...m, count: cImgs ?? 0 };
          if (m.label === "Keywords") return { ...m, count: cKws ?? 0 };
          return m;
        })
      );

      // Últimos logs
      const { data: logsData } = await supabase
        .from("logs")
        .select("id, fecha, user_id, tipo, mensaje")
        .order("fecha", { ascending: false })
        .limit(6);
      setLogs((logsData as any) || []);
      setLoading(false);
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fmt = (d?: string | null) => {
    if (!d) return "—";
    const dt = new Date(d);
    return dt.toLocaleString();
  };

  return (
    <AdminRoute>
      <DashboardLayout>
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-3 mb-8">
            <Activity className="text-blue-600" size={28} />
            <h1 className="text-3xl font-bold">Administración</h1>
          </div>

          {/* Métricas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {metrics.map(({ label, count, href, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                className="bg-white rounded-2xl shadow p-5 hover:shadow-md transition flex items-center justify-between"
              >
                <div>
                  <div className="text-sm text-gray-500">{label}</div>
                  <div className="text-3xl font-extrabold mt-1">{count ?? "…"}</div>
                </div>
                <div className="flex items-center gap-3">
                  <Icon className="text-gray-400" size={28} />
                  <ChevronRight className="text-gray-400" />
                </div>
              </Link>
            ))}
          </div>

          {/* Accesos rápidos */}
          <div className="bg-white rounded-2xl shadow p-6 mb-10">
            <h2 className="text-xl font-bold mb-4">Acciones rápidas</h2>
            <div className="flex flex-wrap gap-3">
              <Link href="/dashboard/admin/users" className="px-4 py-2 bg-black text-white rounded-lg font-semibold">
                Gestionar usuarios
              </Link>
              <Link href="/dashboard/admin/categorias" className="px-4 py-2 bg-black text-white rounded-lg font-semibold">
                Gestionar categorías
              </Link>
              <Link href="/dashboard/soporte" className="px-4 py-2 bg-black text-white rounded-lg font-semibold">
                Tickets (Zammad)
              </Link>
              <Link href="/dashboard/articulos" className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg font-semibold">
                Ver artículos
              </Link>
            </div>
          </div>

          {/* Actividad reciente (logs) */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold mb-4">Actividad reciente</h2>
            {loading ? (
              <div className="text-gray-500">Cargando…</div>
            ) : logs.length === 0 ? (
              <div className="text-gray-400">Sin actividad reciente.</div>
            ) : (
              <ul className="divide-y">
                {logs.map((l) => (
                  <li key={l.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{l.tipo}</div>
                      <div className="text-sm text-gray-600">{l.mensaje}</div>
                    </div>
                    <div className="text-sm text-gray-500 text-right">
                      <div>{fmt(l.fecha)}</div>
                      <div className="text-xs">user_id: {l.user_id ?? "—"}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </DashboardLayout>
    </AdminRoute>
  );
}
