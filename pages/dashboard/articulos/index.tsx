import DashboardLayout from '../../../components/DashboardLayout';
import ProtectedRoute from '../../../components/ProtectedRoute';
import Link from 'next/link';
import { Plus } from 'lucide-react';

const mockArticles = [
  { id: 1, title: "¿Cómo mejorar tu SEO?", date: "2024-07-28", status: "Publicado" },
  { id: 2, title: "Estrategias de contenido viral", date: "2024-07-26", status: "Borrador" },
];

export default function ArticulosDashboard() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="flex justify-center">
          <div className="w-full max-w-2xl mt-10 mb-14 bg-white rounded-2xl shadow-lg px-10 py-10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Artículos</h2>
              <Link
                href="/dashboard/articulos/nuevo"
                className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-gray-900 transition"
              >
                <Plus size={20} /> Nuevo artículo
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-500 text-base">
                    <th className="py-3 px-4 font-semibold">Título</th>
                    <th className="py-3 px-4 font-semibold">Fecha</th>
                    <th className="py-3 px-4 font-semibold">Estado</th>
                    <th className="py-3 px-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {mockArticles.map((article) => (
                    <tr key={article.id} className="border-t last:border-b">
                      <td className="py-3 px-4">{article.title}</td>
                      <td className="py-3 px-4">{article.date}</td>
                      <td className="py-3 px-4">{article.status}</td>
                      <td className="py-3 px-4">
                        <Link
                          href={`/dashboard/articulos/${article.id}`}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          Editar
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {mockArticles.length === 0 && (
                <div className="text-gray-500 text-center py-12 text-lg">No hay artículos aún.</div>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
