import { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Home, FileText, Search, Image, Settings } from 'lucide-react';

const sidebarLinks = [
  { href: '/dashboard', label: 'Inicio', icon: Home },
  { href: '/dashboard/articulos', label: 'Artículos', icon: FileText },
  { href: '/dashboard/seo', label: 'SEO', icon: Search },
  { href: '/dashboard/imagenes', label: 'Imágenes', icon: Image },
  { href: '/dashboard/configuracion', label: 'Configuración', icon: Settings },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b font-bold text-xl tracking-wide">
          Diariun
        </div>
        <nav className="flex-1 py-4 px-2 space-y-2">
          {sidebarLinks.map((link) => {
            const active = router.asPath === link.href || router.asPath.startsWith(link.href + '/');
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition font-medium
                  ${active ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'}
                `}
              >
                <Icon size={20} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 text-xs text-gray-400">© {new Date().getFullYear()} Diariun</div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-8">
          <div className="text-lg font-semibold">Panel de usuario</div>
          {/* Aquí puedes poner usuario, avatar, notificaciones, etc */}
        </header>

        {/* Contenido principal */}
        <main className="flex-1 p-8 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
