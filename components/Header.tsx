import Image from "next/image";
import Link from "next/link";

export default function Header() {
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
          <Link href="/authors" style={{ color: "#444" }}>
            Explorar Autores
          </Link>
          <Link
            href="/login"
            style={{
              color: "#222",
              fontWeight: 600,
              border: "1px solid #eee",
              borderRadius: "5px",
              padding: "0.3rem 1rem",
              background: "#f9f9f9",
              transition: "background 0.2s",
            }}
            onMouseOver={e => (e.currentTarget.style.background = "#efefef")}
            onMouseOut={e => (e.currentTarget.style.background = "#f9f9f9")}
          >
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}
