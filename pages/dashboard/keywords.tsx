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
        setError(  data.error?.message ||
    data.error ||
    JSON.stringify(data) ||
    "Error consultando Moz API");
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

        {/* Modal de análisis Moz */}
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
        <>
          {/* INTENTS */}
          <div className="mb-4">
            <div className="font-medium">Intención principal:</div>
            <div className="text-2xl text-blue-600 font-bold">
              {mozData.result.keyword_intent?.primary_intents?.join(", ") || "No disponible"}
            </div>
          </div>
          <div>
            <div className="font-medium">Intenciones (scores):</div>
            <ul>
              {mozData.result.keyword_intent?.all_intents?.map((intent: any, i: number) => (
                <li key={i}>
                  {intent.label}: <span className="font-semibold">{intent.score}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
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
