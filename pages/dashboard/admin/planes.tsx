import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../../components/DashboardLayout";
import AdminRoute from "../../../components/AdminRoute";
import { useAuth } from "../../../context/AuthContext";
import { Layers, Plus, Trash2, RefreshCcw, Search, Pencil, Save, X, ToggleLeft, ToggleRight } from "lucide-react";
import BackButton from "../../../components/BackButton";


type Plan = {
  id: number;
  nombre: string;
  descripcion: string | null;
  creditos_incluidos: number;
  precio: number;
  stripe_price_id: string | null;
  activo: boolean | null;
};

export default function AdminPlanes() {
  const { supabase } = useAuth();
  const [rows, setRows] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  // Crear
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [creditos, setCreditos] = useState<number>(10);
  const [precio, setPrecio] = useState<number>(9.99);
  const [stripePriceId, setStripePriceId] = useState("");

  // Buscar
  const [q, setQ] = useState("");

  // Edit inline
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Plan>>({});

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("planes")
      .select("id, nombre, descripcion, creditos_incluidos, precio, stripe_price_id, activo")
      .order("id", { ascending: true });
    if (!error) setRows((data as any) || []);
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
        r.nombre.toLowerCase().includes(s) ||
        (r.descripcion || "").toLowerCase().includes(s) ||
        (r.stripe_price_id || "").toLowerCase().includes(s)
    );
  }, [q, rows]);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      nombre: nombre.trim(),
      descripcion: descripcion.trim() || null,
      creditos_incluidos: Number(creditos) || 0,
      precio: Number(precio) || 0,
      stripe_price_id: stripePriceId.trim() || null,
      activo: true,
    };
    const { error } = await supabase.from("planes").insert(payload);
    if (error) {
      alert("Error creando plan: " + error.message);
      return;
    }
    setNombre(""); setDescripcion(""); setCreditos(10); setPrecio(9.99); setStripePriceId("");
    await load();
  };

  const startEdit = (p: Plan) => {
    setEditId(p.id);
    setEditForm({ ...p });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditForm({});
  };

  const saveEdit = async () => {
    if (!editId) return;
    const { error } = await supabase
      .from("planes")
      .update({
        nombre: editForm.nombre,
        descripcion: (editForm.descripcion ?? "") || null,
        creditos_incluidos: Number(editForm.creditos_incluidos) || 0,
        precio: Number(editForm.precio) || 0,
        stripe_price_id: (editForm.stripe_price_id ?? "") || null,
      })
      .eq("id", editId);
    if (error) {
      alert("Error guardando: " + error.message);
      return;
    }
    setEditId(null);
    setEditForm({});
    await load();
  };

  const toggleActivo = async (p: Plan) => {
    const { error } = await supabase
      .from("planes")
      .update({ activo: !p.activo })
      .eq("id", p.id);
    if (error) {
      alert("Error cambiando estado: " + error.message);
      return;
    }
    await load();
  };

  const remove = async (p: Plan) => {
    const ok = confirm(`¿Eliminar plan "${p.nombre}"?`);
    if (!ok) return;
    const { error } = await supabase.from("planes").delete().eq("id", p.id);
    if (error) {
      alert("No se pudo eliminar (¿referencias activas?): " + error.message);
      return;
    }
    await load();
  };

  return (
    <AdminRoute>
      <DashboardLayout>
        <BackButton backHref="/dashboard/admin" className="mb-6" />
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center gap-3 mb-8">
            <Layers className="text-blue-600" size={28} />
            <h1 className="text-3xl font-bold">Planes</h1>
          </div>

          {/* Crear */}
          <form className="bg-white rounded-2xl shadow p-5 mb-8" onSubmit={add}>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <input className="border rounded-lg px-3 py-2" placeholder="Nombre"
                     value={nombre} onChange={e => setNombre(e.target.value)} required />
              <input className="border rounded-lg px-3 py-2 md:col-span-2" placeholder="Descripción"
                     value={descripcion} onChange={e => setDescripcion(e.target.value)} />
              <input className="border rounded-lg px-3 py-2" type="number" min={0} placeholder="Créditos"
                     value={creditos} onChange={e => setCreditos(Number(e.target.value))} required />
              <input className="border rounded-lg px-3 py-2" type="number" min={0} step="0.01" placeholder="Precio"
                     value={precio} onChange={e => setPrecio(Number(e.target.value))} required />
              <input className="border rounded-lg px-3 py-2 md:col-span-2" placeholder="Stripe price id (opcional)"
                     value={stripePriceId} onChange={e => setStripePriceId(e.target.value)} />
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white font-semibold">
                <Plus size={18} /> Crear plan
              </button>
              <button type="button"
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                onClick={load} title="Refrescar">
                <RefreshCcw size={16} /> Refrescar
              </button>
            </div>
          </form>

          {/* Buscar */}
          <div className="bg-white rounded-2xl shadow p-4 mb-4">
            <div className="flex items-center gap-3">
              <Search size={18} className="text-gray-500" />
              <input className="flex-1 border rounded-lg px-3 py-2" placeholder="Buscar por nombre, descripción o Stripe price id…"
                     value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
          </div>

          {/* Lista */}
          <div className="bg-white rounded-2xl shadow overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-500 text-sm">
                  <th className="py-3 px-4">Nombre</th>
                  <th className="py-3 px-4">Créditos</th>
                  <th className="py-3 px-4">Precio</th>
                  <th className="py-3 px-4">Stripe</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td className="py-6 px-4" colSpan={6}>Cargando…</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td className="py-6 px-4 text-gray-500" colSpan={6}>Sin planes.</td></tr>
                ) : (
                  filtered.map((p) => (
                    <tr key={p.id} className="border-t last:border-b">
                      <td className="py-3 px-4">
                        {editId === p.id ? (
                          <div className="flex flex-col gap-2">
                            <input className="border rounded-lg px-2 py-1"
                                   value={editForm.nombre as any}
                                   onChange={e => setEditForm(f => ({ ...f, nombre: e.target.value }))} />
                            <input className="border rounded-lg px-2 py-1 text-sm"
                                   placeholder="Descripción"
                                   value={(editForm.descripcion as any) || ""}
                                   onChange={e => setEditForm(f => ({ ...f, descripcion: e.target.value }))} />
                          </div>
                        ) : (
                          <>
                            <div className="font-semibold">{p.nombre}</div>
                            <div className="text-sm text-gray-500">{p.descripcion || "—"}</div>
                          </>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {editId === p.id ? (
                          <input className="border rounded-lg px-2 py-1 w-24" type="number"
                                 value={editForm.creditos_incluidos as any}
                                 onChange={e => setEditForm(f => ({ ...f, creditos_incluidos: Number(e.target.value) }))} />
                        ) : p.creditos_incluidos}
                      </td>
                      <td className="py-3 px-4">
                        {editId === p.id ? (
                          <input className="border rounded-lg px-2 py-1 w-24" type="number" step="0.01"
                                 value={editForm.precio as any}
                                 onChange={e => setEditForm(f => ({ ...f, precio: Number(e.target.value) }))} />
                        ) : `€${p.precio.toFixed(2)}`}
                      </td>
                      <td className="py-3 px-4">
                        {editId === p.id ? (
                          <input className="border rounded-lg px-2 py-1"
                                 placeholder="price_xxx (opcional)"
                                 value={(editForm.stripe_price_id as any) || ""}
                                 onChange={e => setEditForm(f => ({ ...f, stripe_price_id: e.target.value }))} />
                        ) : (p.stripe_price_id || "—")}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          className={`px-3 py-1 rounded-lg text-sm flex items-center gap-2 ${p.activo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}
                          onClick={() => toggleActivo(p)}
                          title="Activar/Desactivar"
                        >
                          {p.activo ? <ToggleRight size={16} /> : <ToggleLeft size={16} />} {p.activo ? "Activo" : "Inactivo"}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 justify-end">
                          {editId === p.id ? (
                            <>
                              <button className="px-3 py-1 rounded-lg bg-black text-white text-sm flex items-center gap-2" onClick={saveEdit}>
                                <Save size={16} /> Guardar
                              </button>
                              <button className="px-3 py-1 rounded-lg bg-gray-200 text-sm flex items-center gap-2" onClick={cancelEdit}>
                                <X size={16} /> Cancelar
                              </button>
                            </>
                          ) : (
                            <>
                              <button className="px-3 py-1 rounded-lg bg-gray-100 text-sm flex items-center gap-2" onClick={() => startEdit(p)}>
                                <Pencil size={16} /> Editar
                              </button>
                              <button className="px-3 py-1 rounded-lg bg-red-600 text-white text-sm flex items-center gap-2" onClick={() => remove(p)}>
                                <Trash2 size={16} /> Eliminar
                              </button>
                            </>
                          )}
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
