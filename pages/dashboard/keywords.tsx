import { useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import ProtectedRoute from "../../components/ProtectedRoute";
import { Tag, Search, BarChart2, X } from "lucide-react";

const mockKeywords = [
  { keyword: "seo avanzado", volumen: 2900, dificultad: 32 },
  { keyword: "blog viral", volumen: 880, dificultad: 55 },
];

const fetchMozDataMock = (keyword: string) => ({
  keyword,
  volumen: 2900,
  dificultad: 32,
  oportunidad: 70,
  potencial: 65,
  cpc: 0.6,
  serp: [
    { dominio: "diariun.com", da: 54, pa: 42, enlaces: 26, spam: 3 },
    { dominio: "flexsirent.com", da: 44, pa: 39, enlaces: 10, spam: 2 },
    { dominio: "competencia.com", da: 80, pa: 60, enlaces: 77, spam: 9 }
  ]
});

export default function KeywordsDashboard() {
  const [analizando, setAnalizando] = useState<string | null>(null);
  const [mozData, setMozData] = useState<any | null>(null);

  const handleAnalizar = (kw: string) => {
    setAnalizando(kw);
    // Aquí harás la llamada real a Moz
    setMozData(fetchMozDataMock(kw));
  };

  const closeModal = () => {
    setAnalizando(null);
    setMozData(null);
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Tag size={24} /> Keywords
          </h2>
        </div>
        <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 text-sm">
                <th className="py-2 px-4">Keyword</th>
                <th className="py-2 px-4">Volumen</th>
                <th className="py-2 px-4">Dificultad</th>
                <th className="py-2 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {mockKeywords.map((kw, i) => (
                <tr key={i} className="border-t last:border-b">
                  <td className="py-2 px-4">{kw.keyword}</td>
                  <td className="py-2 px-4">{kw.volumen}</td>
                  <td className="py-2 px-4">
                    <span className={`font-bold ${kw.dificultad < 40 ? "text-green-600" : kw.dificultad < 60 ? "text-yellow-500" : "text-red-500"}`}>
                      {kw.dificultad}/100
                    </span>
                  </td>
                  <td className="py-2 px-4">
                    <button
                      className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                      onClick={() => handleAnalizar(kw.keyword)}
                    >
                      <BarChart2 size={16} /> Analizar
                    </button>
                  </td>
                </tr>
              ))}
              {mockKeywords.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-400">
                    Todavía no tienes keywords guardadas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal de análisis Moz */}
        {analizando && mozData && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl relative animate-fade-in">
              <button className="absolute top-4 right-4 text-gray-400 hover:text-black" onClick={closeModal}>
                <X size={28} />
              </button>
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Search size={22} /> Análisis de keyword: <span className="text-blue-600">{mozData.keyword}</span>
              </h3>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 rounded-lg p-5 flex flex-col items-start">
                  <div className="text-sm text-gray-500 font-medium mb-1">Volumen</div>
                  <div className="text-2xl font-bold">{mozData.volumen}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-5 flex flex-col items-start">
                  <div className="text-sm text-gray-500 font-medium mb-1">Dificultad</div>
                  <div className={`text-2xl font-bold ${mozData.dificultad < 40 ? "text-green-600" : mozData.dificultad < 60 ? "text-yellow-500" : "text-red-500"}`}>
                    {mozData.dificultad}/100
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-5 flex flex-col items-start">
                  <div className="text-sm text-gray-500 font-medium mb-1">Oportunidad</div>
                  <div className="text-2xl font-bold">{mozData.oportunidad}%</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-5 flex flex-col items-start">
                  <div className="text-sm text-gray-500 font-medium mb-1">Potencial</div>
                  <div className="text-2xl font-bold">{mozData.potencial}%</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-5 flex flex-col items-start">
                  <div className="text-sm text-gray-500 font-medium mb-1">CPC</div>
                  <div className="text-2xl font-bold">€{mozData.cpc}</div>
                </div>
              </div>
              <div>
                <div className="font-semibold text-base mb-2">SERP principal</div>
                <table className="w-full text-left text-sm bg-gray-50 rounded-lg overflow-hidden">
                  <thead>
                    <tr className="text-gray-500">
                      <th className="py-2 px-2">Dominio</th>
                      <th className="py-2 px-2">DA</th>
                      <th className="py-2 px-2">PA</th>
                      <th className="py-2 px-2">Enlaces</th>
                      <th className="py-2 px-2">Spam</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mozData.serp.map((item: any, idx: number) => (
                      <tr key={idx} className="border-t last:border-b">
                        <td className="py-2 px-2">{item.dominio}</td>
                        <td className="py-2 px-2">{item.da}</td>
                        <td className="py-2 px-2">{item.pa}</td>
                        <td className="py-2 px-2">{item.enlaces}</td>
                        <td className={`py-2 px-2 font-bold ${item.spam >= 10 ? "text-red-500" : item.spam >= 5 ? "text-yellow-500" : "text-green-600"}`}>{item.spam}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </DashboardLayout>
    </ProtectedRoute>
  );
}
