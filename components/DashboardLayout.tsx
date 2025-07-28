import { ReactNode, Fragment } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Home, FileText, Search, Image as ImageIcon, Settings, UserCircle, LogOut, User, ArrowLeft, Tag } from 'lucide-react';
import { Menu, Transition } from '@headlessui/react';
import { useAuth } from '../context/AuthContext';

const sidebarLinks = [
  { href: '/dashboard', label: 'Inicio', icon: Home },
  { href: '/dashboard/articulos', label: 'Artículos', icon: FileText },
  { href: '/dashboard/keywords', label: 'Keywords', icon: Tag },
  { href: '/dashboard/seo', label: 'SEO', icon: Search },
  { href: '/dashboard/imagenes', label: 'Imágenes', icon: ImageIcon },
  { href: '/dashboard/configuracion', label: 'Configuración', icon: Settings },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, supabase } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-16 flex items-center justify-center border-b">
  <Link href="/" className="flex items-center">
    <Image
      src="/Logo_Diariun.png"
      alt="Diariun"
      width={90}
      height={40}
      style={{ maxHeight: "40px", width: "auto", objectFit: "contain" }}
      priority
    />
  </Link>
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
          {/* Menú usuario */}
          <Menu as="div" className="relative">
            <Menu.Button>
              <UserCircle size={28} className="text-gray-700 hover:text-black transition" />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-52 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                <div className="px-1 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/"
                        className={`${
                          active ? "bg-gray-100" : ""
                        } group flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-800`}
                      >
                        <ArrowLeft size={16} />
                        Volver a la web principal
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/profile"
                        className={`${
                          active ? "bg-gray-100" : ""
                        } group flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-800`}
                      >
                        <User size={16} />
                        Mi perfil
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={`${
                          active ? "bg-gray-100" : ""
                        } group flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-800`}
                      >
                        <LogOut size={16} />
                        Cerrar sesión
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </header>

        {/* Contenido principal */}
        <main className="flex-1 p-8 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
