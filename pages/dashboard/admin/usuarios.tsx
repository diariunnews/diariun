// pages/dashboard/admin/usuarios.tsx
import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../../components/DashboardLayout";
import AdminRoute from "../../../components/AdminRoute";
import BackButton from "../../../components/BackButton";
import { toast } from "react-hot-toast";
import { useAuth } from "../../../context/AuthContext";

type Row = {
  id: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
  rol: "user" | "staff" | "admin";
  created_at: string;
  deleted_at: string | null;
  creditos: number;
  activo: boolean;
};

export default function AdminUsuarios() {
  const { supabase } = useAuth();

  const [items, setItems] = useState<Row[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const perPage = 20;

  // Header con el JWT del usuario actual
  const authHeader = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // -------- Carga de usuarios (UNICA) --------
  const loadUsers = async (p = 1, s = "") => {
    setLoading(true);
    try {
      const qs = new URLSearchParams({ page: String(p), perPage: String(perPage) });
      if (s) qs.set("search", s);
      const headers = await authHeader();
      const res = await fetch(`/api/admin/users?${qs.toString()}`, { headers });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error cargando usuarios");
      setItems(data.items);
      setTotal(data.total);
      setPage(data.page);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers(1, "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pages = useMemo(() => Math.max(1, Math.ceil(total / perPage)), [total]);

  const saveRol = async (id: string, rol: Row["rol"]) => {
    const headers = { "Content-Type": "application/json", ...(await authHeader()) };
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers,
      body: JSON.stringify({ id, rol }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error guardando rol");
  };

  const saveCreditos = async (id: string, creditos: number) => {
    const headers = { "Content-Type": "application/json", ...(await authHeader()) };
    const res = await fetch("/api/admin/users?action=credits", {
      method: "POST",
      headers,
      body: JSON.stringify({ id, creditos }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error guardando créditos");
  };

  const toggleActivo = async (id: string, deactivate: boolean) => {
    const headers = { "Content-Type": "application/json", ...(await authHeader()) };
    const res = await fetch("/api/admin/users?action=toggle", {
      method: "POST",
      headers,
      body: JSON.stringify({ id, deactivate }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error actualizando estado");
  };

  const handleRolChange = async (row: Row, rol: Row["rol"]) => {
    const prev = row.rol;
    try {
      setItems(prevItems => prevItems.map(r => (r.id === row.id ? { ...r, rol } : r)));
      await saveRol(row.id, rol);
      toast.success("Rol actualizado");
    } catch (e: any) {
      setItems(prevItems => prevItems.map(r => (r.id === row.id ? { ...r, rol: prev } : r)));
      toast.error(e.message);
    }
  };

  const handleCreditosBlur = async (row: Row, value: string) => {
    const n = Number(value);
    if (Number.isNaN(n)) return toast.error("Créditos inválidos");
    const prev = row.creditos;
    try {
      setItems(prevItems => prevItems.map(r => (r.id === row.id ? { ...r, creditos: n } : r)));
      await saveCreditos(row.id, n);
      toast.success("Créditos guardados");
    } catch (e: any) {
      setItems(prevItems => prevItems.map(r => (r.id === row.id ? { ...r, creditos: prev } : r)));
      toast.error(e.message);
    }
  };

  const handleToggleActivo = async (row: Row) => {
    const deactivate = row.activo;
    try {
      setItems(prevItems => prevItems.map(r => (r.id === row.id ? { ...r, activo: !row.activo } : r)));
      await toggleActivo(row.id, deactivate);
      toast.success(deactivate ? "Cuenta desactivada" : "Cuenta activada");
    } catch (e: any) {
      setItems(prevItems => prevItems.map(r => (r.id === row.id ? { ...r, activo: row.activo } : r)));
      toast.error(e.message);
    }
  };

  return (
    <AdminRoute>
      <DashboardLayout>
        <div className="max-w-6xl mx-auto">
          <BackButton backHref="/dashboard/admin" className="mb-6" />

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">Usuarios</h1>
              <div className="flex items-center gap-2">
                <input
                  className="border rounded-lg px-3 py-2 text-sm"
                  placeholder="Buscar por email o nombre…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && loadUsers(1, search)}
                />
                <button
                  className="px-3 py-2 rounded-lg bg-black text-white text-sm font-semibold"
                  onClick={() => loadUsers(1, search)}
                >
                  Buscar
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-500 text-sm">
                    <th className="py-2 px-3">Usuario</th>
                    <th className="py-2 px-3">Rol</th>
                    <th className="py-2 px-3">Créditos</th>
                    <th className="py-2 px-3">Estado</th>
                    <th className="py-2 px-3 w-24"></th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={5} className="py-10 text-center text-gray-500">Cargando…</td></tr>
                  ) : items.length === 0 ? (
                    <tr><td colSpan={5} className="py-10 text-center text-gray-400">Sin resultados</td></tr>
                  ) : (
                    items.map((row) => (
                      <tr key={row.id} className="border-t">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-3">
                            {row.avatar_url ? (
                              <img src={row.avatar_url} className="w-8 h-8 rounded-full object-cover border" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold uppercase">
                                {(row.display_name?.[0] || row.email?.[0] || "U").toUpperCase()}
                              </div>
                            )}
                            <div className="min-w-0">
                              <div className="font-semibold truncate">{row.display_name || "—"}</div>
                              <div className="text-xs text-gray-500 truncate">{row.email || "—"}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          <select
                            value={row.rol}
                            onChange={(e) => handleRolChange(row, e.target.value as Row["rol"])}
                            className="border rounded-lg px-2 py-1 text-sm"
                          >
                            <option value="user">user</option>
                            <option value="staff">staff</option>
                            <option value="admin">admin</option>
                          </select>
                        </td>

                        <td className="py-3 px-3">
                          <input
                            type="number"
                            className="w-24 border rounded-lg px-2 py-1 text-sm"
                            defaultValue={row.creditos}
                            onBlur={(e) => handleCreditosBlur(row, e.target.value)}
                          />
                        </td>

                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              row.activo ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"
                            }`}
                          >
                            {row.activo ? "Activo" : "Desactivado"}
                          </span>
                        </td>

                        <td className="py-3 px-3">
                          <button
                            onClick={() => handleToggleActivo(row)}
                            className="text-sm px-3 py-1 rounded-lg border hover:bg-gray-50"
                          >
                            {row.activo ? "Desactivar" : "Activar"}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            {pages > 1 && (
              <div className="flex items-center justify-end gap-2 mt-4">
                <button
                  onClick={() => loadUsers(Math.max(1, page - 1), search)}
                  className="px-3 py-1.5 rounded border text-sm disabled:opacity-50"
                  disabled={page === 1}
                >
                  Anterior
                </button>
                <div className="text-sm text-gray-600">
                  Página {page} de {pages}
                </div>
                <button
                  onClick={() => loadUsers(Math.min(pages, page + 1), search)}
                  className="px-3 py-1.5 rounded border text-sm disabled:opacity-50"
                  disabled={page === pages}
                >
                  Siguiente
                </button>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </AdminRoute>
  );
}
