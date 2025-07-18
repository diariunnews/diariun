import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Header from "../components/Header";
import Image from "next/image";
import Link from "next/link";
import { categories } from "../lib/categories";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <Header />

      {/* Categorías */}
      <nav className="border-b border-gray-100 bg-white sticky top-0 z-40">
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 shadow-sm rounded-full p-1 hover:bg-gray-100"
          >
            <ChevronLeft size={18} />
          </button>
          <div
            ref={scrollRef}
            className="flex overflow-x-auto no-scrollbar gap-4 py-3 px-6"
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
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 shadow-sm rounded-full p-1 hover:bg-gray-100"
          >
            <ChevronRight size={18} />
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
      <main className="max-w-7xl mx-auto px-4 mt-12 flex gap-12 items-start relative">
        {/* Artículos */}
        <section className="flex-1 flex flex-col gap-8">
          {articles.map((art) => (
            <Link key={art.slug} href={`/articles/${art.slug}`} className="group flex items-center gap-6 border-b pb-6">
              <div className="flex-1">
                <span className="text-xs uppercase text-gray-500 font-medium">{art.category}</span>
                <h2 className="text-xl font-bold text-gray-900 group-hover:underline">{art.title}</h2>
                <p className="text-gray-600 text-sm mt-1">{art.excerpt}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Image src={art.avatar} alt={art.author} width={28} height={28} className="rounded-full" />
                  <span className="text-sm text-gray-800">{art.author}</span>
                  <span className="text-sm text-gray-400">· {art.date}</span>
                </div>
              </div>
              <div className="w-32 h-24 relative rounded-md overflow-hidden flex-shrink-0">
                <Image src={art.cover} alt={art.title} layout="fill" objectFit="cover" />
              </div>
            </Link>
          ))}
        </section>

        {/* Separador vertical */}
        <div
          className="hidden md:block absolute top-0 bottom-0 w-px bg-gray-200"
          style={{ left: "calc(100% - 20rem - 48px)" }}
          aria-hidden="true"
        />

        {/* Sidebar */}
        <aside className="w-80 hidden md:block">
          <div className="sticky top-32 flex flex-col gap-10 pl-4">
            <div>
              <h4 className="text-md font-semibold mb-4 flex items-center gap-2"><span className="text-yellow-500">⭐</span> Staff Picks</h4>
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
                            <Image src={art.avatar} alt={art.author} width={24} height={24} className="rounded-full border border-white shadow" />
                            <span className="text-xs text-gray-700">{art.author}</span>
                          </div>
                        </div>
                      </Link>
                    </li>
                  )
                ))}
              </ul>
            </div>

            <div>
              <h5 className="text-sm font-bold mb-2 text-gray-700">Tendencias</h5>
              <div className="flex flex-wrap gap-2">
                {categories.slice(0, 8).map((cat) => (
                  <span
                    key={cat.slug}
                    className="px-2 py-1 text-xs bg-gray-200 rounded-full text-gray-600"
                  >
                    {cat.name}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h5 className="text-sm font-bold mb-2 text-gray-700">¡Recibe lo mejor de Diariun!</h5>
              <form className="flex flex-col gap-2">
                <input type="email" className="rounded-lg px-3 py-2 border border-gray-200" placeholder="Tu email..." />
                <button className="rounded-lg bg-black text-white px-3 py-2 font-semibold text-sm hover:bg-gray-800 transition">Suscribirme</button>
              </form>
            </div>

            <footer className="border-t border-gray-200 pt-4 text-sm text-gray-500 mt-4">
              <ul className="flex flex-col gap-1 mb-2">
                <li><Link href="/privacidad">Política de privacidad</Link></li>
                <li><Link href="/terminos">Términos y condiciones</Link></li>
                <li><Link href="/contacto">Contacto</Link></li>
              </ul>
              <p className="mt-2 text-xs">&copy; 2025 Diariun</p>
            </footer>
          </div>
        </aside>
      </main>
    </>
  );
}
