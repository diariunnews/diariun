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
        author: data.authorName || "",
        avatar: data.authorAvatar || "/authors/default.jpg",
        date: data.date || "",
        category: data.category || "",
        cover: data.cover || "/Foto_Portada_Diarium.jpg"
      };
    })
    .filter(a => a.date)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

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
                <Image src={featured.avatar} alt={featured.author} width={44} height={44} className="rounded-full border-2 border-white shadow" />
                <span className="text-base text-gray-800 font-semibold">{featured.author}</span>
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
                    <Image src={art.avatar} alt={art.author} width={32} height={32} className="rounded-full" />
                    <span className="text-xs text-gray-700">{art.author}</span>
                    <span className="text-xs text-gray-400">· {art.date}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
        {/* Sidebar PRO: Artículos destacados + autores destacados + tendencias + newsletter */}
        <aside className="w-full md:w-64 flex-shrink-0 md:block hidden sticky top-28">
          <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 shadow-sm">

            {/* Artículos destacados */}
            <h4 className="text-md font-semibold mb-4">Artículos destacados</h4>
            <ul className="space-y-5 mb-8">
              {[featured, ...articles.slice(0, 2)].map((art) => (
                art && (
                  <li key={art.slug}>
                    <Link href={`/articles/${art.slug}`} className="flex gap-3 items-center group">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        <Image src={art.cover} alt={art.title} layout="fill" objectFit="cover" />
                      </div>
                      <div className="flex-1">
                        <span className="block text-xs text-gray-500">{art.category}</span>
                        <span className="font-semibold text-gray-800 group-hover:underline leading-tight text-sm line-clamp-2">
                          {art.title}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <Image
                            src={art.avatar}
                            alt={art.author}
                            width={24}
                            height={24}
                            className="rounded-full border border-white shadow"
                          />
                          <span className="text-xs text-gray-700">{art.author}</span>
                        </div>
                      </div>
                    </Link>
                  </li>
                )
              ))}
            </ul>

            {/* Autores destacados */}
            <h4 className="text-md font-semibold mb-4">Autores destacados</h4>
            <ul className="space-y-4 mb-8">
              {[
                {
                  name: "Ana Torres",
                  avatar: "/authors/female-114.jpg",
                  bio: "Tecnología y sociedad"
                },
                {
                  name: "Daniel Reyes",
                  avatar: "/authors/male-001.jpg",
                  bio: "Negocios y empresas"
                },
                {
                  name: "Emily Zhang",
                  avatar: "/authors/female-116.jpg",
                  bio: "Cultura y comunicación"
                },
              ].map((a) => (
                <li key={a.name} className="flex items-center gap-3">
                  <Image src={a.avatar} alt={a.name} width={36} height={36} className="rounded-full" />
                  <div>
                    <span className="font-medium text-gray-800">{a.name}</span>
                    <p className="text-xs text-gray-500">{a.bio}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* Tendencias */}
            <div className="mt-8 mb-6">
              <h5 className="text-sm font-bold mb-2 text-gray-700">Tendencias</h5>
              <div className="flex flex-wrap gap-2">
                {["Tecnología", "Negocios", "Cultura", "Sociedad"].map((cat) => (
                  <span
                    key={cat}
                    className="px-2 py-1 text-xs bg-gray-200 rounded-full text-gray-600"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            {/* Newsletter Widget */}
            <div className="mb-1">
              <h5 className="text-sm font-bold mb-2 text-gray-700">¡Recibe lo mejor de Diariun!</h5>
              <form className="flex flex-col gap-2">
                <input type="email" className="rounded-lg px-3 py-2 border border-gray-200" placeholder="Tu email..." />
                <button className="rounded-lg bg-black text-white px-3 py-2 font-semibold text-sm hover:bg-gray-800 transition">Suscribirme</button>
              </form>
            </div>
          </div>
        </aside>
      </main>

      <Footer />
    </>
  );
}
