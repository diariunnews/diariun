import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import ProtectedRoute from "../../components/ProtectedRoute";
import { Tag, Search, BarChart2, X, Plus, Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { fetchUserKeywords, saveKeyword, deleteKeyword } from "../../utils/keywords";

export default function KeywordsDashboard() {
  const { user } = useAuth();
  const [keywords, setKeywords] = useState<any[]>([]);
  const [loadingKeywords, setLoadingKeywords] = useState(true);
  const [newKeyword, setNewKeyword] = useState("");
  const [analizando, setAnalizando] = useState<string | null>(null);
  const [mozData, setMozData] = useState<any | null>(null);
  const [loadingMoz, setLoadingMoz] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar keywords al inicio
  useEffect(() => {
    if (user) {
      setLoadingKeywords(true);
      fetchUserKeywords(user.id)
        .then(setKeywords)
        .finally(() => setLoadingKeywords(false));
    }
  }, [user]);

  const handleAddKeyword = async () => {
    if (!newKeyword.trim()) return;
    try {
      const kw = await saveKeyword(user.id, newKeyword.trim());
      setKeywords([kw, ...keywords]);
      setNewKeyword("");
    } catch (e: any) {
      alert("Error guardando keyword");
    }
  };

  const handleDeleteKeyword = async (id: string) => {
    await deleteKeyword(id);
    setKeywords(keywords.filter(kw => kw.id !== id));
  };

  const handleAnalizar = async (kw: string) => {
    setAnalizando(kw);
    setLoadingMoz(true);
    setError(null);
    setMozData(null);
    try {
      const res = await fetch("/api/moz-keyword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: kw }),
      });
      const data = await res.json();
      if (res.ok) {
        setMozData(data);
      } else {
        setError(
          data.error?.message ||
          data.error ||
          JSON.stringify(data) ||
          "Error consultando Moz API"
        );
      }
    } catch (err) {
      setError("Error consultando Moz API");
    }
    setLoadingMoz(false);
  };

  const closeModal = () => {
    setAnalizando(null);
    setMozData(null);
    setError(null);
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Tag size={24} /> Keywords
          </h2>
          <div className="flex gap-2">
            <input
              value={newKeyword}
              onChange={e => setNewKeyword(e.target.value)}
              placeholder="Añadir nueva keyword"
              className="p-2 border rounded-lg text-sm"
              onKeyDown={e => e.key === "Enter" && handleAddKeyword()}
            />
            <button
              className="bg-black text-white px-3 py-2 rounded-lg font-semibold flex items-center gap-1"
              onClick={handleAddKeyword}
            >
              <Plus size={16} /> Añadir
            </button>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
          {loadingKeywords ? (
            <div className="text-gray-500 text-center py-6">Cargando…</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-500 text-sm">
                  <th className="py-2 px-4">Keyword</th>
                  <th className="py-2 px-4"></th>
                  <th className="py-2 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {keywords.map((kw, i) => (
                  <tr key={kw.id} className="border-t last:border-b">
                    <td className="py-2 px-4">{kw.keyword}</td>
                    <td className="py-2 px-4">
                      <button
                        className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                        onClick={() => handleAnalizar(kw.keyword)}
                      >
                        <BarChart2 size={16} /> Analizar
                      </button>
                    </td>
                    <td className="py-2 px-4">
                      <button
                        className="text-red-600 hover:underline text-sm flex items-center gap-1"
                        onClick={() => handleDeleteKeyword(kw.id)}
                        title="Eliminar keyword"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {keywords.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center py-8 text-gray-400">
                      Todavía no tienes keywords guardadas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal de análisis Moz PRO */}
        {analizando && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl relative animate-fade-in">
              <button className="absolute top-4 right-4 text-gray-400 hover:text-black" onClick={closeModal}>
                <X size={28} />
              </button>
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Search size={22} /> Análisis de keyword: <span className="text-blue-600">{analizando}</span>
              </h3>

              {loadingMoz ? (
                <div className="text-gray-500 text-lg py-8 text-center">Analizando…</div>
              ) : error ? (
                <div className="text-red-500 py-8 text-center">{error}</div>
              ) : mozData?.result ? (
                <div className="space-y-8">

                  {/* BLOQUE INTENCIONES (mantenido si la API lo trae) */}
                  {mozData.result.keyword_intent && (
                    <div className="bg-slate-50 rounded-xl p-4 shadow-sm">
                      <div className="mb-2 flex items-center gap-2">
                        <span className="font-medium text-gray-600">Intención principal:</span>
                        {mozData.result.keyword_intent.primary_intents?.map((intent: string, i: number) => (
                          <span
                            key={intent}
                            className={`px-3 py-1 rounded-xl text-white text-sm font-semibold ${
                              intent === "informational"
                                ? "bg-blue-500"
                                : intent === "navigational"
                                ? "bg-emerald-500"
                                : intent === "commercial"
                                ? "bg-yellow-500"
                                : intent === "transactional"
                                ? "bg-purple-500"
                                : "bg-gray-400"
                            }`}
                          >
                            {intent}
                          </span>
                        ))}
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Intenciones (scores):</span>
                        <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {mozData.result.keyword_intent.all_intents?.map(
                            (intent: any, i: number) => (
                              <li key={i} className="flex items-center gap-2">
                                <span className="capitalize w-32">{intent.label}:</span>
                                <div className="flex-1 bg-gray-200 rounded-full h-3 relative">
                                  <div
                                    className={`absolute left-0 top-0 h-3 rounded-full
                                      ${
                                        intent.label === "informational"
                                          ? "bg-blue-400"
                                          : intent.label === "navigational"
                                          ? "bg-emerald-400"
                                          : intent.label === "commercial"
                                          ? "bg-yellow-400"
                                          : intent.label === "transactional"
                                          ? "bg-purple-400"
                                          : "bg-gray-400"
                                      }
                                    `}
                                    style={{ width: `${Math.round(intent.score * 100)}%` }}
                                  />
                                </div>
                                <span className="w-10 text-right font-bold">{Math.round(intent.score * 100)}%</span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* BLOQUE MÉTRICAS PRO */}
                  {mozData.result.keyword_metrics && (
                    <div className="bg-gradient-to-br from-blue-50 via-white to-emerald-50 rounded-xl p-4 shadow-md">
                      <div className="mb-4 flex items-center gap-2 text-lg font-semibold">
                        <BarChart2 className="text-blue-600" size={24} />
                        Métricas SEO principales
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        <MetricCard
                          label="Dificultad"
                          icon={<svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M12 3v18m6-6H6" /></svg>}
                          value={mozData.result.keyword_metrics.difficulty}
                          isPercent
                          color="blue"
                        />
                        <MetricCard
                          label="CTR orgánico"
                          icon={<svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M3 12h18M12 3v18"/></svg>}
                          value={mozData.result.keyword_metrics.organic_ctr}
                          isPercent
                          color="purple"
                        />
                        <MetricCard
                          label="Prioridad"
                          icon={<svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M12 2l2.09 6.26L20 9.27l-5 4.87L16.18 22 12 18.18 7.82 22 9 14.14l-5-4.87 5.91-.91z"/></svg>}
                          value={mozData.result.keyword_metrics.priority}
                          isPercent
                          color="yellow"
                        />
                        <MetricCard
                          label="Volumen mensual"
                          icon={<svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M4 17v-5a1 1 0 011-1h2a1 1 0 011 1v5M12 17V7a1 1 0 011-1h2a1 1 0 011 1v10M20 17v-3a1 1 0 00-1-1h-2a1 1 0 00-1 1v3"/></svg>}
                          value={mozData.result.keyword_metrics.volume}
                          color="pink"
                          isInt
                        />

                        {/* Si quieres añadir potenciales nuevos campos aquí, ponlos igual */}
                      </div>
                    </div>
                  )}

                  {/* Si no hay ni intents ni metrics */}
                  {!mozData.result.keyword_intent && !mozData.result.keyword_metrics && (
                    <div className="text-gray-400 py-8 text-center">Sin datos</div>
                  )}
                </div>
              ) : (
                <div className="text-gray-400 py-8 text-center">Sin datos</div>
              )}
            </div>
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}

/** --- COMPONENTE PRO PARA CADA MÉTRICA --- */
function MetricCard({
  label,
  icon,
  value,
  isPercent,
  isInt,
  color = "blue",
}: {
  label: string;
  icon: React.ReactNode;
  value: number | undefined;
  isPercent?: boolean;
  isInt?: boolean;
  color?: "blue" | "emerald" | "yellow" | "purple" | "pink";
}) {
  const colorClasses: any = {
    blue: "bg-blue-100 text-blue-700",
    emerald: "bg-emerald-100 text-emerald-700",
    yellow: "bg-yellow-100 text-yellow-700",
    purple: "bg-purple-100 text-purple-700",
    pink: "bg-pink-100 text-pink-700",
  };

  // Barra de progreso: para porcentajes solo de 0-100, para volumen la puedes tunear si quieres
  const percentBar =
    isPercent && typeof value === "number"
      ? `${Math.max(0, Math.min(value, 100))}%`
      : isInt && typeof value === "number"
      ? `${Math.min(value / 150, 1) * 100}%` // barra "simulada" para volumen, ajusta el divisor según tu caso
      : "0%";

  return (
    <div
      className={`flex flex-col gap-2 rounded-xl p-4 shadow transition border border-white hover:shadow-lg ${colorClasses[color]}`}
    >
      <div className="flex items-center gap-2">{icon}<span className="font-bold">{label}</span></div>
      <div className="text-2xl font-extrabold">
        {value === undefined || value === null
          ? "N/A"
          : isInt
          ? value.toLocaleString()
          : isPercent
          ? `${value}%`
          : value}
      </div>
      {/* Barra solo si tiene sentido */}
      {(isPercent || isInt) && value !== undefined && (
        <div className="w-full h-2 bg-white/70 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${color === "blue"
              ? "bg-blue-400"
              : color === "emerald"
                ? "bg-emerald-400"
                : color === "yellow"
                  ? "bg-yellow-400"
                  : color === "purple"
                    ? "bg-purple-400"
                    : "bg-pink-400"
              }`}
            style={{ width: percentBar }}
          ></div>
        </div>
      )}
    </div>
  );
}
