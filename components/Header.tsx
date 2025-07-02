import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header
      style={{
        borderBottom: "1px solid #ddd",
        padding: "0.5rem 0",
        fontFamily: "'Georgia', serif",
        width: "100%",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <Image
            src="/Logo_Diariun.png"
            alt="Diariun"
            width={240}
            height={60}
            style={{ height: "60px", width: "auto" }}
            priority
          />
        </Link>
        <nav style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", fontSize: "1rem" }}>
          <Link href="/authors">Explorar Autores</Link>
          <Link href="/signup">Signup</Link>
          <Link href="/login">Login</Link>
        </nav>
      </div>
    </header>
  );
}