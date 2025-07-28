import DashboardLayout from '../../components/DashboardLayout';
import ProtectedRoute from '../../components/ProtectedRoute';
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
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Artículos</h2>
          <Link
            href="/dashboard/articulos/nuevo"
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-900 transition"
          >
            <Plus size={18} /> Nuevo artículo
          </Link>
        </div>
        <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 text-sm">
                <th className="py-2 px-4">Título</th>
                <th className="py-2 px-4">Fecha</th>
                <th className="py-2 px-4">Estado</th>
                <th className="py-2 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {mockArticles.map((article) => (
                <tr key={article.id} className="border-t last:border-b">
                  <td className="py-2 px-4">{article.title}</td>
                  <td className="py-2 px-4">{article.date}</td>
                  <td className="py-2 px-4">{article.status}</td>
                  <td className="py-2 px-4">
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
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
