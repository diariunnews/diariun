import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Head from "next/head";
import Header from "../components/Header";
import Image from "next/image";
import Link from "next/link";
import StickySidebar from "../components/StickySidebar";
import { categories } from "../lib/categories";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

export async function getStaticProps() {
  const articlesDir = path.join(process.cwd(), "data", "articles");
  const files = fs.readdirSync(articlesDir);

  const articles = files
    .filter((f) => f.endsWith(".mdx"))
    .map((filename) => {
      const filePath = path.join(articlesDir, filename);
      const mdxContent = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(mdxContent);
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

  const [featured, ...rest] = articles;

  return {
    props: {
      featured: featured || null,
      articles: rest,
    },
  };
}

export default function Home({ featured, articles }) {
  const scrollRef = useRef(null);
  const scroll = (offset) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <>
      <Head>
        <title>Diariun | Inicio</title>
      </Head>

      <Header />

      {/* Categorías con flechas y sin scroll visible */}
      <nav className="border-b border-gray-100 bg-white sticky top-0 z-40 py-2">
        <div className="relative max-w-6xl mx-auto flex items-center px-4 gap-2">
          <button
            onClick={() => scroll(-200)}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          <div
            ref={scrollRef}
            className="flex overflow-x-auto no-scrollbar gap-3 px-1 flex-1"
          >
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="px-4 py-1 rounded-full border border-gray-200 bg-gray-50 text-gray-700 hover:bg-black hover:text-white transition text-sm font-medium whitespace-nowrap"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <button
            onClick={() => scroll(200)}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </nav>

      {/* Artículo destacado */}
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

      {/* Main con artículos + sidebar */}
      <main className="flex items-start max-w-7xl mx-auto px-4 gap-8 mt-10">
        {/* Artículos */}
        <section className="flex-1 flex flex-col gap-8">
          {articles.map((art) => (
            <Link
              key={art.slug}
              href={`/articles/${art.slug}`}
              className="flex items-center gap-6 group bg-gray-50 p-6 rounded-xl shadow-sm hover:bg-gray-100 transition"
            >
              <div className="flex-1">
                <span className="block text-xs font-medium text-gray-400 uppercase mb-1">{art.category}</span>
                <h2 className="text-2xl font-bold text-gray-900 group-hover:underline">
                  {art.title}
                </h2>
                <p className="text-gray-600 text-base mt-2 line-clamp-2">{art.excerpt}</p>
                <div className="flex items-center gap-2 mt-4">
                  <Image src={art.avatar} alt={art.author} width={28} height={28} className="rounded-full" />
                  <span className="text-sm text-gray-800 font-medium">{art.author}</span>
                  <span className="text-sm text-gray-400">· {art.date}</span>
                </div>
              </div>
              <div className="w-40 h-28 relative rounded-md overflow-hidden flex-shrink-0">
                <Image src={art.cover} alt={art.title} fill className="object-cover" />
              </div>
            </Link>
          ))}
        </section>

        {/* Sidebar estilo Medium */}
        <aside className="w-80 flex-shrink-0">
          <StickySidebar top={112}>
            <div className="flex flex-col gap-10 pl-2">
              {/* Staff Picks */}
              <div>
                <h3 className="text-lg font-semibold mb-4">⭐ Staff Picks</h3>
                <ul className="flex flex-col gap-6">
                  {[featured, ...articles.slice(0, 2)].map((art) => (
                    art && (
                      <li key={art.slug}>
                        <Link href={`/articles/${art.slug}`} className="group">
                          <span className="text-sm text-gray-500">Recomendado</span>
                          <h4 className="text-md font-bold text-gray-800 group-hover:underline">
                            {art.title}
                          </h4>
                          <p className="text-sm text-gray-600">{art.excerpt}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Image src={art.avatar} alt={art.author} width={24} height={24} className="rounded-full" />
                            <span className="text-sm text-gray-700">{art.author}</span>
                            <span className="text-sm text-gray-400">· {art.date}</span>
                          </div>
                        </Link>
                      </li>
                    )
                  ))}
                </ul>
              </div>

              {/* Tendencias */}
              <div>
                <h4 className="text-md font-semibold mb-2">Tendencias</h4>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <span key={cat.slug} className="bg-gray-200 px-3 py-1 rounded-full text-sm text-gray-700">
                      {cat.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div>
                <h4 className="text-md font-semibold mb-2">¡Recibe lo mejor de Diariun!</h4>
                <form className="flex flex-col gap-2">
                  <input
                    type="email"
                    placeholder="Tu email..."
                    className="px-3 py-2 rounded-md border border-gray-300"
                  />
                  <button className="bg-black text-white px-3 py-2 rounded-md hover:bg-gray-800 text-sm font-semibold">
                    Suscribirme
                  </button>
                </form>
              </div>

              {/* Footer del sidebar */}
              <footer className="border-t border-gray-200 pt-4 text-sm text-gray-500 mt-4">
                <ul className="flex flex-col gap-1">
                  <li><Link href="/sobre-nosotros">Sobre nosotros</Link></li>
                  <li><Link href="/privacidad">Privacidad</Link></li>
                  <li><Link href="/terminos">Términos</Link></li>
                  <li><Link href="/contacto">Contacto</Link></li>
                  <li><Link href="/cookies">Cookies</Link></li>
                </ul>
                <p className="mt-4 text-xs">&copy; 2025 Diariun. Todos los derechos reservados.</p>
              </footer>
            </div>
          </StickySidebar>
        </aside>
      </main>
    </>
  );
}
