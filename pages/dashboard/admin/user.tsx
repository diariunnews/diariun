import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../../components/DashboardLayout";
import AdminRoute from "../../../components/AdminRoute";
import { useAuth } from "../../../context/AuthContext";
import { Shield, Search, CheckCircle2, XCircle, RefreshCcw } from "lucide-react";

type ProfileRow = {
  id: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
  rol: string | null;
  created_at: string | null;
  deleted_at: string | null;
};

export default function AdminUsers() {
  const { supabase } = useAuth();
  const [rows, setRows] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select("id, email, display_name, avatar_url, rol, created_at, deleted_at")
      .order("created_at", { ascending: false });
    setRows((data as any) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter(
      (r) =>
        (r.email || "").toLowerCase().includes(s) ||
        (r.display_name || "").toLowerCase().includes(s) ||
        (r.rol || "").toLowerCase().includes(s)
    );
  }, [q, rows]);

  const setRole = async (id: string, rol: "admin" | "staff" | "user") => {
    const ok = confirm(`¿Seguro que quieres cambiar el rol a "${rol}"?`);
    if (!ok) return;
    await supabase.from("profiles").update({ rol }).eq("id", id);
    await load();
  };

  const toggleActive = async (id: string, deleted_at: string | null) => {
    const willDeactivate = deleted_at === null;
    const ok = confirm(willDeactivate ? "¿Desactivar usuario?" : "¿Reactivar usuario?");
    if (!ok) return;
    await supabase
      .from("profiles")
      .update({ deleted_at: willDeactivate ? new Date().toISOString() : null })
      .eq("id", id);
    await load();
  };

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
            <Shield className="text-blue-600" size={28} />
            <h1 className="text-3xl font-bold">Usuarios</h1>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-2xl shadow p-4 mb-6">
            <div className="flex items-center gap-3">
              <Search size={18} className="text-gray-500" />
              <input
                className="flex-1 border rounded-lg px-3 py-2"
                placeholder="Buscar por email, nombre o rol…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <button
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                onClick={load}
                title="Refrescar"
              >
                <RefreshCcw size={16} /> Refrescar
              </button>
            </div>
          </div>

          {/* Tabla */}
          <div className="bg-white rounded-2xl shadow overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-500 text-sm">
                  <th className="py-3 px-4">Usuario</th>
                  <th className="py-3 px-4">Rol</th>
                  <th className="py-3 px-4">Alta</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td className="py-6 px-4" colSpan={5}>Cargando…</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td className="py-6 px-4 text-gray-500" colSpan={5}>Sin resultados.</td></tr>
                ) : (
                  filtered.map((u) => (
                    <tr key={u.id} className="border-t last:border-b">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={u.avatar_url || "/avatar_placeholder.png"}
                            alt={u.display_name || u.email || "avatar"}
                            className="w-9 h-9 rounded-full object-cover border"
                          />
                          <div>
                            <div className="font-semibold">{u.display_name || "—"}</div>
                            <div className="text-sm text-gray-500">{u.email || "—"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">{u.rol || "user"}</td>
                      <td className="py-3 px-4">{fmt(u.created_at)}</td>
                      <td className="py-3 px-4">
                        {u.deleted_at ? (
                          <span className="text-red-600 flex items-center gap-1">
                            <XCircle size={16} /> Desactivado
                          </span>
                        ) : (
                          <span className="text-green-600 flex items-center gap-1">
                            <CheckCircle2 size={16} /> Activo
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 justify-end">
                          <select
                            className="border rounded-lg px-2 py-1 text-sm"
                            value={u.rol || "user"}
                            onChange={(e) => setRole(u.id, e.target.value as any)}
                          >
                            <option value="user">user</option>
                            <option value="staff">staff</option>
                            <option value="admin">admin</option>
                          </select>
                          <button
                            className={`px-3 py-1 rounded-lg text-sm ${
                              u.deleted_at ? "bg-green-600 text-white" : "bg-red-600 text-white"
                            }`}
                            onClick={() => toggleActive(u.id, u.deleted_at)}
                          >
                            {u.deleted_at ? "Reactivar" : "Desactivar"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </DashboardLayout>
    </AdminRoute>
  );
}
