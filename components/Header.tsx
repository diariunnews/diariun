// components/Header.tsx
import Image from "next/image";
import Link from "next/link";
import { useModal } from "../context/ModalContext";

export default function Header() {
  const { openModal } = useModal();

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
        <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <Image
            src="/Logo_Diariun.png"
            alt="Diariun"
            width={90}
            height={42}
            style={{ height: "42px", width: "auto", objectFit: "contain" }}
            priority
          />
        </Link>

        <nav
          style={{
            display: "flex",
            gap: "1.5rem",
            fontSize: "1rem",
            alignItems: "center",
          }}
        >
          <button
  onClick={() => openModal("login")}
  className="px-4 py-2 rounded-full bg-white border border-gray-300 shadow-sm text-sm font-semibold text-gray-800 hover:bg-gray-100 transition-all duration-200"
>
  Iniciar sesión
</button>

        </nav>
      </div>
    </header>
  );
}
