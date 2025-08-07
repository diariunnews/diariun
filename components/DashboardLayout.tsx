import React, { ReactNode, Fragment } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Home, FileText, Search, Image as ImageIcon, Settings, LogOut, User, ArrowLeft, Tag, Shield, Coins, PlusCircle, HelpCircle } from 'lucide-react';
import { Menu, Transition } from '@headlessui/react';
import { useAuth } from '../context/AuthContext';

const sidebarLinks = [
  { href: '/dashboard', label: 'Inicio', icon: Home },
  { href: '/dashboard/articulos', label: 'Artículos', icon: FileText },
  { href: '/dashboard/keywords', label: 'Keywords', icon: Tag },
  { href: '/dashboard/seo', label: 'SEO', icon: Search },
  { href: '/dashboard/imagenes', label: 'Imágenes', icon: ImageIcon },
  { href: '/dashboard/configuracion', label: 'Configuración', icon: Settings },
  { href: '/dashboard/admin', label: 'Admin', icon: Shield, admin: true },
  { href: '/dashboard/soporte', label: 'Soporte', icon: HelpCircle }

];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, userProfile, logout } = useAuth();
  const [creditos, setCreditos] = React.useState<number | null>(null);

  // Créditos
  const refreshCreditos = async () => {
    if (user) {
      const { getCreditosUsuario } = await import('../utils/creditos');
      const saldo = await getCreditosUsuario(user.id);
      setCreditos(saldo);
    }
  };

  React.useEffect(() => {
    refreshCreditos();
    // eslint-disable-next-line
  }, [user]);

  const childrenWithCreditos =
    user && children && React.isValidElement(children)
      ? React.cloneElement(children as React.ReactElement<any>, { onCreditosChange: refreshCreditos })
      : children;

  // Inicial para el avatar fallback
  const getInicial = () => {
    if (userProfile?.full_name) return userProfile.full_name[0].toUpperCase();
    if (user?.email) return user.email[0].toUpperCase();
    return "U";
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
            const isInicio = link.href === '/dashboard';
            const active = isInicio
              ? router.asPath === '/dashboard'
              : router.asPath === link.href || router.asPath.startsWith(link.href + '/');
            const Icon = link.icon;
            if (link.admin && userProfile?.role !== 'admin') return null;
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
        <header className="h-16 bg-white border-b flex items-center justify-end px-8">
          {/* Créditos */}
          {user && (
            <div className="flex items-center gap-2 mr-6">
              <Coins size={22} className="text-yellow-500" />
              <span className={`font-bold px-2 py-1 rounded text-base
                ${creditos !== null && creditos < 2
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-gray-100 text-gray-700"}
              `}>
                {creditos === null ? "…" : creditos}
              </span>
              <Link
                href="/comprar-creditos"
                className="ml-2 flex items-center gap-1 px-3 py-1 rounded-lg bg-black text-white text-sm font-semibold hover:bg-gray-800 transition"
              >
                <PlusCircle size={17} />
                Comprar
              </Link>
            </div>
          )}

          {/* Menú usuario con AVATAR y nombre */}
          <Menu as="div" className="relative">
            <Menu.Button>
              {userProfile?.avatar_url ? (
                <img
                  src={userProfile.avatar_url}
                  alt="Avatar"
                  className="w-9 h-9 rounded-full object-cover border border-gray-300"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold text-xl uppercase">
                  {getInicial()}
                </div>
              )}
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
                        onClick={logout}
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
        <main className="flex-1 p-8 bg-gray-50">
          {childrenWithCreditos}
        </main>
      </div>
    </div>
  );
}
