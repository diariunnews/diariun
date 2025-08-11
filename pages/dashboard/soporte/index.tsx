// pages/dashboard/soporte/index.tsx

import { useState, useEffect } from "react";
import DashboardLayout from "../../../components/DashboardLayout";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-hot-toast";
import Link from "next/link";



export default function SoportePanel() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [detalle, setDetalle] = useState<any | null>(null);
  const [mensajes, setMensajes] = useState<any[]>([]);
  const [cargandoMsgs, setCargandoMsgs] = useState(false);
  const [respuesta, setRespuesta] = useState("");
  const [enviandoResp, setEnviandoResp] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!user?.email) return;
      setLoading(true);
      try {
        const r = await fetch("/api/zammad-tickets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email }),
        });
        const text = await r.text();
        const data = JSON.parse(text);
        setTickets(data.tickets || []);
      } catch {
        toast.error("No se pueden cargar los tickets (API no disponible)");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const openDetalle = async (ticket: any) => {
    setDetalle(ticket);
    setCargandoMsgs(true);
    try {
      const r = await fetch(`/api/zammad-ticket-detail?id=${ticket.id}`);
      const text = await r.text();
      const data = JSON.parse(text);
      setMensajes(data.articles || []);
    } catch {
      toast.error("No se puede cargar el historial.");
    } finally {
      setCargandoMsgs(false);
    }
  };

  const handleResponder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!respuesta.trim() || !detalle) return;
    setEnviandoResp(true);
    try {
      const r = await fetch(`/api/zammad-ticket-detail?id=${detalle.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: respuesta, subject: detalle.title, email: user?.email }),
      });
      const text = await r.text();
      if (!r.ok) throw new Error(text);
      setRespuesta("");
      toast.success("¡Respuesta enviada!");
      // recargar mensajes
      const r2 = await fetch(`/api/zammad-ticket-detail?id=${detalle.id}`);
      const text2 = await r2.text();
      const data2 = JSON.parse(text2);
      setMensajes(data2.articles || []);
    } catch {
      toast.error("Error enviando la respuesta.");
    } finally {
      setEnviandoResp(false);
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="flex justify-center">
          <div className="w-full max-w-3xl mt-12 mb-16 bg-white rounded-2xl shadow px-8 py-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">Soporte</h2>
              {!detalle && (
                <Link href="/dashboard/soporte/nuevo" className="bg-black text-white px-4 py-2 rounded-lg font-semibold">
                  + Nuevo ticket
                </Link>
              )}
            </div>

            {!detalle ? (
              <>
                {loading ? (
                  <div className="text-gray-500 py-12 text-center">Cargando…</div>
                ) : tickets.length === 0 ? (
                  <div className="text-gray-500 py-12 text-center">No tienes tickets.</div>
                ) : (
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-gray-500 text-base">
                        <th className="py-3 px-4 font-semibold">Asunto</th>
                        <th className="py-3 px-4 font-semibold">Estado</th>
                        <th className="py-3 px-4 font-semibold">Creado</th>
                        <th className="py-3 px-4"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {tickets.map((t) => (
                        <tr key={t.id} className="border-t last:border-b">
                          <td className="py-3 px-4">{t.title}</td>
                          <td className="py-3 px-4 capitalize">{t.state}</td>
                          <td className="py-3 px-4">{(t.created_at || "").split("T")[0]}</td>
                          <td className="py-3 px-4">
                            <button className="text-blue-600 hover:underline text-sm" onClick={() => openDetalle(t)}>
                              Ver
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </>
            ) : (
              <>
                <button className="mb-5 text-blue-600 hover:underline text-sm" onClick={() => setDetalle(null)}>
                  ← Volver al listado
                </button>
                <h3 className="text-2xl font-bold mb-3">Ticket: {detalle.title}</h3>

                <div className="mb-7">
                  {cargandoMsgs ? (
                    <div className="text-gray-500 py-6">Cargando mensajes…</div>
                  ) : (
                    <div className="space-y-5">
                      {mensajes.map((m: any) => (
                        <div key={m.id} className={`p-4 rounded-xl ${m.from === "agent" ? "bg-blue-50" : "bg-gray-100"}`}>
                          <div className="text-xs text-gray-500 mb-2">
                            {(m.created_at || "").replace("T", " ").slice(0,16)} • {m.from === "agent" ? "Soporte" : "Tú"}
                          </div>
                          <div className="whitespace-pre-line">{m.body}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <form onSubmit={handleResponder} className="mt-8 border-t pt-6">
                  <label className="block font-semibold mb-2">Tu respuesta</label>
                  <textarea
                    className="w-full border rounded-lg p-2 mb-3"
                    rows={4}
                    value={respuesta}
                    onChange={(e) => setRespuesta(e.target.value)}
                    required
                    disabled={enviandoResp}
                  />
                  <button
                    type="submit"
                    className="bg-black text-white px-5 py-2 rounded-lg font-semibold"
                    disabled={enviandoResp || !respuesta.trim()}
                  >
                    {enviandoResp ? "Enviando…" : "Enviar respuesta"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
