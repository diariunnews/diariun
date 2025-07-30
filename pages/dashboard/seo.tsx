// pages/dashboard/seo.tsx
import DashboardLayout from '../../components/DashboardLayout';
import ProtectedRoute from '../../components/ProtectedRoute';
import { Search, Plus } from 'lucide-react';

const mockAuditorias = [
  {
    id: 1,
    titulo: "Home Diariun",
    fecha: "2024-07-29",
    keyword: "blog seo",
    puntaje: 78,
    estado: "Completado"
  },
  {
    id: 2,
    titulo: "Artículo viral 2025",
    fecha: "2024-07-22",
    keyword: "viralización",
    puntaje: 82,
    estado: "Completado"
  }
];

export default function SeoDashboard() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Search size={24} /> Auditorías SEO
          </h2>
          <button
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-900 transition opacity-60 cursor-not-allowed"
            disabled
          >
            <Plus size={18} /> Nueva auditoría (próximamente)
          </button>
        </div>
        <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 text-sm">
                <th className="py-2 px-4">Título</th>
                <th className="py-2 px-4">Fecha</th>
                <th className="py-2 px-4">Keyword</th>
                <th className="py-2 px-4">Puntaje</th>
                <th className="py-2 px-4">Estado</th>
                <th className="py-2 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {mockAuditorias.map((audit) => (
                <tr key={audit.id} className="border-t last:border-b">
                  <td className="py-2 px-4">{audit.titulo}</td>
                  <td className="py-2 px-4">{audit.fecha}</td>
                  <td className="py-2 px-4">{audit.keyword}</td>
                  <td className="py-2 px-4 font-bold text-green-600">{audit.puntaje}/100</td>
                  <td className="py-2 px-4">{audit.estado}</td>
                  <td className="py-2 px-4">
                    <button
                      className="text-blue-600 hover:underline text-sm opacity-50 cursor-not-allowed"
                      disabled
                    >
                      Ver detalle
                    </button>
                  </td>
                </tr>
              ))}
              {mockAuditorias.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400">
                    Todavía no has realizado auditorías SEO.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
