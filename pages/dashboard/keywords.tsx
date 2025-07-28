import DashboardLayout from '../../components/DashboardLayout';
import ProtectedRoute from '../../components/ProtectedRoute';
import { Search, Tag } from 'lucide-react';

const mockKeywords = [
  { keyword: "seo avanzado", volumen: 2900, dificultad: 32 },
  { keyword: "blog viral", volumen: 880, dificultad: 28 },
];

export default function KeywordsDashboard() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Tag size={24} /> Keywords
          </h2>
          {/* Puedes poner aquí un botón para importar o analizar keywords */}
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
                  <td className="py-2 px-4">{kw.dificultad}</td>
                  <td className="py-2 px-4">
                    {/* Aquí pondremos botón para analizar con API de Moz */}
                    <button className="text-blue-600 hover:underline text-sm">
                      Analizar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
