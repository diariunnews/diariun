import { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useAuth } from "../../context/AuthContext";
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

  // 1. Listar tickets
  useEffect(() => {
    if (!user?.email) return;
    setLoading(true);
    fetch("/api/zammad-tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email }),
    })
      .then(r => r.json())
      .then(data => setTickets(data.tickets || []))
      .finally(() => setLoading(false));
  }, [user]);

  // 2. Ver detalle de ticket
  const openDetalle = async (ticket: any) => {
    setDetalle(ticket);
    setCargandoMsgs(true);
    fetch(`/api/zammad-ticket-detail?id=${ticket.id}`)
      .then(r => r.json())
      .then(data => setMensajes(data.articles || []))
      .finally(() => setCargandoMsgs(false));
  };

  // 3. Enviar respuesta
  const handleResponder = async (e: any) => {
    e.preventDefault();
    if (!respuesta.trim() || !detalle) return;
    setEnviandoResp(true);
    const res = await fetch(`/api/zammad-ticket-detail?id=${detalle.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        body: respuesta,
        subject: detalle.title,
        email: user.email,
      }),
    });
    setEnviandoResp(false);
    if (res.ok) {
      setRespuesta("");
      toast.success("¡Respuesta enviada!");
      // Recargar mensajes
      fetch(`/api/zammad-ticket-detail?id=${detalle.id}`)
        .then(r => r.json())
        .then(data => setMensajes(data.articles || []));
    } else {
      toast.error("Error enviando la respuesta.");
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="flex justify-center">
          <div className="w-full max-w-3xl mt-14 mb-14 bg-white rounded-2xl shadow px-10 py-10">
            <h2 className="text-3xl font-bold mb-8">Soporte</h2>
            {!detalle ? (
              <>
                <div className="flex justify-between mb-5">
                  <span className="font-semibold text-lg">Tus tickets</span>
                  <Link href="/dashboard/soporte/nuevo" className="bg-black text-white px-4 py-2 rounded-lg font-semibold">+ Nuevo ticket</Link>
                </div>
                {loading ? (
                  <div className="text-gray-500 py-12 text-center">Cargando…</div>
                ) : tickets.length === 0 ? (
                  <div className="text-gray-500 py-12 text-center">No tienes tickets abiertos.</div>
                ) : (
                  <table className="w-full text-left mb-4">
                    <thead>
                      <tr className="text-gray-500 text-base">
                        <th className="py-3 px-4 font-semibold">Asunto</th>
                        <th className="py-3 px-4 font-semibold">Estado</th>
                        <th className="py-3 px-4 font-semibold">Creado</th>
                        <th className="py-3 px-4"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {tickets.map(ticket => (
                        <tr key={ticket.id} className="border-t last:border-b">
                          <td className="py-3 px-4">{ticket.title}</td>
                          <td className="py-3 px-4 capitalize">{ticket.state}</td>
                          <td className="py-3 px-4">{ticket.created_at?.split("T")[0]}</td>
                          <td className="py-3 px-4">
                            <button
                              className="text-blue-600 hover:underline text-sm"
                              onClick={() => openDetalle(ticket)}
                            >
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
                <button
                  className="mb-5 text-blue-600 hover:underline text-sm"
                  onClick={() => setDetalle(null)}
                >
                  ← Volver al listado
                </button>
                <h3 className="text-2xl font-bold mb-3">Ticket: {detalle.title}</h3>
                <div className="mb-7">
                  {cargandoMsgs ? (
                    <div className="text-gray-500 py-6">Cargando mensajes…</div>
                  ) : (
                    <div className="space-y-6">
                      {mensajes.map((msg, i) => (
                        <div key={msg.id} className={`p-4 rounded-xl ${msg.from === "Customer" ? "bg-gray-100" : "bg-blue-50"}`}>
                          <div className="text-xs text-gray-500 mb-2">
                            {msg.created_at?.replace("T", " ").substring(0, 16)} • {msg.from}
                          </div>
                          <div className="whitespace-pre-line">{msg.body}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {/* Responder */}
                <form onSubmit={handleResponder} className="mt-8 border-t pt-6">
                  <label className="block font-semibold mb-2">Tu respuesta</label>
                  <textarea
                    className="w-full border rounded-lg p-2 mb-3"
                    value={respuesta}
                    onChange={e => setRespuesta(e.target.value)}
                    rows={4}
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
