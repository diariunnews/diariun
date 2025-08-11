import { useState } from "react";
import DashboardLayout from "../../../components/DashboardLayout";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-hot-toast";
import Link from "next/link";

const CATEGORIAS = [
  { value: "soporte", label: "Soporte técnico" },
  { value: "incidencia", label: "Incidencia" },
  { value: "duda", label: "Duda" },
  { value: "sugerencia", label: "Sugerencia" },
];

export default function NuevoTicket() {
  const { user } = useAuth();
  const [category, setCategory] = useState(CATEGORIAS[0].value);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) return;
    setSending(true);
    try {
      const r = await fetch("/api/zammad-ticket-create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user?.email,
          nombre: user?.user_metadata?.full_name || "",
          subject,
          body,
          category,
        }),
      });
      const text = await r.text();
      if (!r.ok) throw new Error(text);
      toast.success("¡Ticket creado!");
      setSubject("");
      setBody("");
    } catch {
      toast.error("No se ha podido crear el ticket.");
    } finally {
      setSending(false);
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="flex justify-center">
          <div className="w-full max-w-lg mt-12 mb-16 bg-white rounded-2xl shadow px-8 py-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">Nuevo ticket</h2>
              <Link href="/dashboard/soporte" className="text-blue-600 hover:underline text-sm">
                ← Volver a soporte
              </Link>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block mb-2 font-medium">Categoría</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border rounded-lg p-2"
                  disabled={sending}
                >
                  {CATEGORIAS.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 font-medium">Asunto</label>
                <input
                  type="text"
                  className="w-full border rounded-lg p-2"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  disabled={sending}
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Mensaje</label>
                <textarea
                  className="w-full border rounded-lg p-2"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={5}
                  required
                  disabled={sending}
                />
              </div>

              <button
                type="submit"
                className="bg-black text-white px-5 py-2 rounded-lg font-semibold w-full"
                disabled={sending}
              >
                {sending ? "Enviando..." : "Crear ticket"}
              </button>
            </form>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
