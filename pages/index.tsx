// pages/index.tsx
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Image from "next/image";
import Link from "next/link";

const categories = [
  "Tecnología", "Negocios", "Cultura", "Ciencia", "Sociedad", "Deportes", "Salud", "Viajes"
];

// Lee los 10 últimos artículos, ordenados por fecha
export async function getStaticProps() {
  const articlesDir = path.join(process.cwd(), "data", "articles");
  const files = fs.readdirSync(articlesDir);

  // Filtra solo archivos .mdx y extrae datos
  const articles = files
    .filter((f) => f.endsWith(".mdx"))
    .map((filename) => {
      const filePath = path.join(articlesDir, filename);
      const mdxContent = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(mdxContent);
      // Aquí usa los campos correctos del frontmatter!
      return {
        slug: filename.replace(/\.mdx$/, ""),
        title: data.title || "",
        excerpt: data.excerpt || "",
        author: data.authorName || "", // <- IMPORTANTE: authorName
        avatar: data.authorAvatar || "/authors/default.jpg", // <- IMPORTANTE: authorAvatar
        date: data.date || "",
        category: data.category || "",
        cover: data.cover || "/Foto_Portada_Diarium.jpg"
      };
    })
    .filter(a => a.date) // Solo los que tengan fecha
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10); // Los 10 más recientes

  // El primero es el destacado (featured)
  const [featured, ...rest] = articles;

  return {
    props: {
      featured: featured || null,
      articles: rest,
    },
  };
}

export default function Home({ featured, articles }) {
  return (
    <>
      <Header />

      {/* Barra de categorías */}
      <nav className="border-b border-gray-100 bg-white sticky top-0 z-40">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 flex overflow-x-auto gap-4 py-3">
          {categories.map((cat) => (
            <button
              key={cat}
              className="px-4 py-1 rounded-full border border-gray-200 bg-gray-50 text-gray-700 hover:bg-black hover:text-white transition text-sm font-medium whitespace-nowrap"
            >
              {cat}
            </button>
          ))}
        </div>
      </nav>

      {/* HERO destacado */}
      {featured && (
        <section className="bg-gray-50 border-b border-gray-100">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 px-4 py-10 items-center">
            <div>
              <span className="text-xs uppercase text-gray-500 font-medium">{featured.category}</span>
              <h1 className="text-4xl font-extrabold mt-2 mb-4 leading-tight text-gray-900">{featured.title}</h1>
              <p className="text-lg text-gray-600 mb-6">{featured.excerpt}</p>
              <div className="flex items-center gap-3">
                <Image src={featured.avatar} alt={featured.author} width={36} height={36} className="rounded-full" />
                <span className="text-sm text-gray-800 font-semibold">{featured.author}</span>
                <span className="text-xs text-gray-400">· {featured.date}</span>
              </div>
            </div>
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl shadow-lg">
              <Image src={featured.cover} alt="Imagen destacada" layout="fill" objectFit="cover" />
            </div>
          </div>
        </section>
      )}

      {/* Grid de artículos */}
      <main className="max-w-5xl mx-auto px-4 mt-10 flex flex-col md:flex-row gap-12">
        <section className="flex-1 min-w-0">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Últimos artículos</h2>
          <div className="flex flex-col gap-8">
            {articles.map((art) => (
              <Link key={art.slug} href={`/articles/${art.slug}`} className="group flex gap-6 items-center hover:bg-gray-50 p-4 rounded-xl transition">
                <div className="relative w-36 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                  <Image src={art.cover} alt={art.title} layout="fill" objectFit="cover" />
                </div>
                <div className="flex-1">
                  <span className="text-xs text-gray-500 font-medium">{art.category}</span>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:underline mb-1">{art.title}</h3>
                  <p className="text-gray-600 mb-2 text-sm">{art.excerpt}</p>
                  <div className="flex items-center gap-2">
                    <Image src={art.avatar} alt={art.author} width={28} height={28} className="rounded-full" />
                    <span className="text-xs text-gray-700">{art.author}</span>
                    <span className="text-xs text-gray-400">· {art.date}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
        <aside className="w-full md:w-64 flex-shrink-0 md:block hidden"></aside>
      </main>

      <Footer />
    </>
  );
}
