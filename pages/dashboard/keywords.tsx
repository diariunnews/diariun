import DashboardLayout from '../../components/DashboardLayout';
import ProtectedRoute from '../../components/ProtectedRoute';
import { Tag } from 'lucide-react';

const mockKeywords = [
  { keyword: "seo avanzado", volumen: 2900, dificultad: 32 },
  { keyword: "blog viral", volumen: 880, dificultad: 28 },
];

export default function KeywordsDashboard() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="flex justify-center">
          <div className="w-full max-w-2xl mt-10 mb-14 bg-white rounded-2xl shadow-lg px-10 py-10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold flex items-center gap-2">
                Keywords
              </h2>
              {/* Aquí puedes poner el botón "Importar keywords" o "Analizar todas" si quieres */}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-500 text-base">
                    <th className="py-3 px-4 font-semibold">Keyword</th>
                    <th className="py-3 px-4 font-semibold">Volumen</th>
                    <th className="py-3 px-4 font-semibold">Dificultad</th>
                    <th className="py-3 px-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {mockKeywords.map((kw, i) => (
                    <tr key={i} className="border-t last:border-b">
                      <td className="py-3 px-4">{kw.keyword}</td>
                      <td className="py-3 px-4">{kw.volumen}</td>
                      <td className="py-3 px-4">{kw.dificultad}</td>
                      <td className="py-3 px-4">
                        <button className="text-blue-600 hover:underline text-sm font-medium">
                          Analizar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {mockKeywords.length === 0 && (
                <div className="text-gray-500 text-center py-12 text-lg">No hay keywords aún.</div>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
