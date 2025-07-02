import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header style={{ borderBottom: "1px solid #ddd", padding: "1.5rem 0", fontFamily: "'Georgia', serif" }}>
      <div
        style={{
          maxWidth: "1024px",
          margin: "0 auto",
          padding: "0 1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "1rem", textDecoration: "none" }}>
          <Image
            src="/Logo_Diariun.png"
            alt="Diariun Logo"
            width={360}
            height={100}
            style={{ objectFit: "contain", height: "auto" }}
            priority
          />
        </Link>

        <nav style={{ display: "flex", gap: "2rem", fontSize: "1rem", marginTop: "0.5rem" }}>
          <Link href="/authors" style={{ color: "#000", textDecoration: "none" }}>Explorar Autores</Link>
          <Link href="/signup" style={{ color: "#000", textDecoration: "none" }}>Signup</Link>
          <Link href="/login" style={{ color: "#000", textDecoration: "none" }}>Login</Link>
        </nav>
      </div>
    </header>
  );
}