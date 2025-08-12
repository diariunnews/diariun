import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../../components/DashboardLayout";
import AdminRoute from "../../../components/AdminRoute";
import { useAuth } from "../../../context/AuthContext";
import { Layers, Plus, Trash2, RefreshCcw, Search } from "lucide-react";

type Categoria = { id: number; nombre: string; slug: string };

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AdminCategorias() {
  const { supabase } = useAuth();
  const [rows, setRows] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [nombre, setNombre] = useState("");
  const [q, setQ] = useState("");

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("categorias")
      .select("id, nombre, slug")
      .order("nombre", { ascending: true });
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
    return rows.filter((r) => r.nombre.toLowerCase().includes(s) || r.slug.toLowerCase().includes(s));
  }, [q, rows]);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    const n = nombre.trim();
    if (!n) return;
    const slug = slugify(n);
    const { error } = await supabase.from("categorias").insert({ nombre: n, slug });
    if (error) {
      alert("Error creando categoría: " + error.message);
      return;
    }
    setNombre("");
    await load();
  };

  const remove = async (id: number) => {
    const ok = confirm("¿Eliminar esta categoría?");
    if (!ok) return;
    const { error } = await supabase.from("categorias").delete().eq("id", id);
    if (error) {
      alert("Error eliminando: " + error.message);
      return;
    }
    await load();
  };

  return (
    <AdminRoute>
      <DashboardLayout>
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center gap-3 mb-8">
            <Layers className="text-blue-600" size={28} />
            <h1 className="text-3xl font-bold">Categorías</h1>
          </div>

          {/* Crear */}
          <form className="bg-white rounded-2xl shadow p-5 mb-8" onSubmit={add}>
            <div className="flex gap-3">
              <input
                className="border rounded-lg px-3 py-2 flex-1"
                placeholder="Nombre de la categoría"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                maxLength={60}
              />
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white font-semibold">
                <Plus size={18} /> Crear
              </button>
              <button
                type="button"
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                onClick={load}
                title="Refrescar"
              >
                <RefreshCcw size={16} /> Refrescar
              </button>
            </div>
            {nombre && (
              <div className="text-xs text-gray-500 mt-2">
                slug sugerido: <span className="font-mono">{slugify(nombre)}</span>
              </div>
            )}
          </form>

          {/* Buscar */}
          <div className="bg-white rounded-2xl shadow p-4 mb-4">
            <div className="flex items-center gap-3">
              <Search size={18} className="text-gray-500" />
              <input
                className="flex-1 border rounded-lg px-3 py-2"
                placeholder="Buscar por nombre o slug…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
          </div>

          {/* Lista */}
          <div className="bg-white rounded-2xl shadow overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-500 text-sm">
                  <th className="py-3 px-4">Nombre</th>
                  <th className="py-3 px-4">Slug</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td className="py-6 px-4" colSpan={3}>Cargando…</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td className="py-6 px-4 text-gray-500" colSpan={3}>Sin categorías.</td></tr>
                ) : (
                  filtered.map((c) => (
                    <tr key={c.id} className="border-t last:border-b">
                      <td className="py-3 px-4">{c.nombre}</td>
                      <td className="py-3 px-4 font-mono text-sm">{c.slug}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            className="px-3 py-1 rounded-lg bg-red-600 text-white text-sm flex items-center gap-2"
                            onClick={() => remove(c.id)}
                          >
                            <Trash2 size={16} /> Eliminar
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
