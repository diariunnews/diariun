import DashboardLayout from '../../components/DashboardLayout';
import ProtectedRoute from '../../components/ProtectedRoute';
import { FileText, Image, Search } from 'lucide-react';

export default function DashboardHome() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <h1 className="text-2xl font-bold mb-6">Panel de control</h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
            <FileText size={36} className="text-blue-500" />
            <div>
              <div className="text-2xl font-bold">12</div>
              <div className="text-gray-500">Artículos publicados</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
            <Image size={36} className="text-green-500" />
            <div>
              <div className="text-2xl font-bold">35</div>
              <div className="text-gray-500">Imágenes subidas</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
            <Search size={36} className="text-purple-500" />
            <div>
              <div className="text-2xl font-bold">20</div>
              <div className="text-gray-500">Auditorías SEO</div>
            </div>
          </div>
        </div>
        <p className="text-gray-600">Aquí podrás gestionar tus artículos, imágenes, SEO, y mucho más.</p>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
