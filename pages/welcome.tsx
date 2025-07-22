import Head from "next/head";
import Header from "../components/Header";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";

export default function Welcome() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.replace("/");
    }
  }, [user]);

  return (
    <>
      <Head>
        <title>Bienvenido a Diariun</title>
        <meta
          name="description"
          content="Publica artículos, explora autores y mejora tu SEO con contenido de calidad."
        />
      </Head>

      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header />

        <main
          style={{
            flex: 1,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            gap: "2rem",
          }}
        >
          <div style={{ flex: "1 1 400px", maxWidth: "600px" }}>
            <h1 style={{ fontSize: "3.5rem" }}>Bienvenido a Diariun</h1>
            <p style={{ marginTop: "0.5rem", fontSize: "1.5rem" }}>
              Publica artículos, explora autores y mejora tu SEO con contenido de calidad.
            </p>

            <Link
              href="/"
              style={{
                marginTop: "2rem",
                display: "inline-block",
                padding: "0.75rem 1.5rem",
                background: "#111",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "1rem",
                borderRadius: "6px",
                textDecoration: "none",
              }}
            >
              Empieza a leer
            </Link>
          </div>

          <div style={{ flex: "1 1 400px", maxWidth: "600px", textAlign: "center" }}>
            <Image
              src="/Foto_Portada_Diarium.jpg"
              alt="Foto de portada Diariun"
              width={600}
              height={400}
              style={{ borderRadius: "12px", maxWidth: "100%", height: "auto" }}
              priority
            />
          </div>
        </main>

        <footer
          style={{
            padding: "1.5rem 1rem",
            backgroundColor: "#f5f5f5",
            color: "#444",
            borderTop: "1px solid #ddd",
            textAlign: "center",
            fontSize: "0.9rem",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "1.5rem",
              marginBottom: "1rem",
            }}
          >
            <Link href="#">Sobre nosotros</Link>
            <Link href="#">Ayuda</Link>
            <Link href="#">Negocios</Link>
            <Link href="#">Términos</Link>
            <Link href="#">Privacidad</Link>
            <Link href="#">Contacto</Link>
            <Link href="#">Política de Cookies</Link>
            <Link href="#">Trabaja con nosotros</Link>
          </div>
          <span style={{ color: "#aaa" }}>
            © {new Date().getFullYear()} Diariun. Todos los derechos reservados.
          </span>
        </footer>
      </div>
    </>
  );
}
