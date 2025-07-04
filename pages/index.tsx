import Header from "../components/Header";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import Footer from "../components/Footer";
import { getDefaultAutoSelectFamily } from "net";

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

      <main
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          minHeight: "70vh",
          gap: "2rem",
        }}
      >
        <div style={{ flex: "1 1 400px", maxWidth: "600px" }}>
          <h1 style={{ fontSize: "3.5rem" }}>Welcome to Diariun</h1>
          <p style={{ marginTop: "0.5rem", fontSize: "1.5rem" }}>
            Publish articles, explore authors, and access quality content for SEO.
          </p>
         
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
        <Link className="no-underline text-inherit" href="#">Sobre nosotros</Link>
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
