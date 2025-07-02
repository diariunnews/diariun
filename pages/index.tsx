import Header from "../components/Header";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Head>
        <title>Diariun</title>
        <meta
          name="description"
          content="Publica artículos de calidad en Diariun, tu medio favorito para posicionamiento SEO."
        />
      </Head>

      <Header />

      <main style={{ textAlign: "center", padding: "2rem" }}>
        <Image
          src="/Foto_Portada_Diarium.jpg"
          alt="Foto de portada Diariun"
          width={800}
          height={400}
          style={{ borderRadius: "12px", maxWidth: "100%", height: "auto" }}
        />
        <h1 style={{ marginTop: "2rem", fontSize: "2rem" }}>Bienvenido a Diariun</h1>
        <p style={{ marginTop: "1rem", fontSize: "1.2rem" }}>
          Publica artículos, explora autores y accede a contenido de calidad para SEO.
        </p>
        <p style={{ marginTop: "1rem" }}>
          Haz clic en <strong>Autores</strong> arriba para ver a nuestros escritores.
        </p>
      </main>

      <footer
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "1.5rem",
          padding: "2rem",
          fontSize: "0.9rem",
          backgroundColor: "#f5f5f5",
          color: "#444",
          borderTop: "1px solid #ddd",
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
        <span style={{ width: "100%", textAlign: "center", marginTop: "1rem", color: "#aaa" }}>
          © {new Date().getFullYear()} Diariun. Todos los derechos reservados.
        </span>
      </footer>
    </>
  );
}