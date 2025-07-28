import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useModal } from "../context/ModalContext";
import { Menu, Transition } from "@headlessui/react";
import { UserCircle, LogOut, User, LayoutDashboard } from "lucide-react";
import { Fragment } from "react";

export default function Header() {
  const { user, supabase } = useAuth();
  const { openModal } = useModal();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <header
      style={{
        borderBottom: "1px solid #eee",
        padding: "0.4rem 0",
        fontFamily: "Libre Baskerville, serif",
        width: "100%",
        background: "#fff",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "0 1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center" }}>
          <Image
            src="/Logo_Diariun.png"
            alt="Diariun"
            width={90}
            height={42}
            style={{ height: "42px", width: "auto", objectFit: "contain" }}
            priority
          />
        </Link>

        <nav className="flex items-center gap-4">
          {!user ? (
            <button
              onClick={() => openModal("login")}
              className="px-4 py-2 rounded-full bg-white border border-gray-300 shadow-sm text-sm font-semibold text-gray-800 hover:bg-gray-100 transition-all duration-200"
            >
              Iniciar sesión
            </button>
          ) : (
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
                <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <div className="px-1 py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href="/dashboard"
                          className={`${
                            active ? "bg-gray-100" : ""
                          } group flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-800`}
                        >
                          <LayoutDashboard size={16} />
                          Panel de control
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
          )}
        </nav>
      </div>
    </header>
  );
}
