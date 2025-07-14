// pages/categories/[category].tsx
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Head from "next/head";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const PAGE_SIZE = 10;

// Slugify: categoría -> URL
function slugify(str) {
  return str
    .toString()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-");
}

export async function getStaticPaths() {
  const articlesDir = path.join(process.cwd(), "data", "articles");
  const files = fs.readdirSync(articlesDir);

  const categories = new Set(
    files
      .filter(f => f.endsWith(".mdx"))
      .map(filename => {
        const filePath = path.join(articlesDir, filename);
        const mdxContent = fs.readFileSync(filePath, "utf-8");
        const { data } = matter(mdxContent);
        return data.category ? slugify(data.category) : null;
      })
      .filter(Boolean)
  );

  const paths = Array.from(categories).map(cat => ({
    params: { category: cat }
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const { category } = params;
  const articlesDir = path.join(process.cwd(), "data", "articles");
  const files = fs.readdirSync(articlesDir);

  // Saca todos los artículos de la categoría actual
  const allArticles = files
    .filter(f => f.endsWith(".mdx"))
    .map(filename => {
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
    .filter(a => slugify(a.category) === category)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Saca todas las categorías reales para el sidebar
  const allCategoriesSet = new Set(
    files
      .filter(f => f.endsWith(".mdx"))
      .map(filename => {
        const filePath = path.join(articlesDir, filename);
        const mdxContent = fs.readFileSync(filePath, "utf-8");
        const { data } = matter(mdxContent);
        return data.category || "";
      })
      .filter(Boolean)
  );
  const allCategories = Array.from(allCategoriesSet);

  // Solo los primeros PAGE_SIZE, el resto lo cargará el cliente
  const initialArticles = allArticles.slice(0, PAGE_SIZE);

  return {
    props: {
      initialArticles,
      allArticles,
      category,
      allCategories,
    }
  };
}

export default function CategoryPage({ initialArticles, allArticles, category, allCategories }) {
  const prettyCategory = category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, " ");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // ¿Hay más artículos?
  const hasMore = visibleCount < allArticles.length;

  // Artículos a mostrar (10, 20, 30...)
  const articles = allArticles.slice(0, visibleCount);

  return (
    <>
      <Head>
        <title>Artículos de {prettyCategory} | Diariun</title>
        <meta name="description" content={`Explora los mejores artículos de ${prettyCategory} en Diariun.`} />
      </Head>
      <Header />
      <main className="max-w-5xl mx-auto px-4 mt-10 flex flex-col md:flex-row gap-12 min-h-[calc(100vh-180px)] pb-14">
        {/* ARTÍCULOS */}
        <section className="flex-1 min-w-0 pb-16">
          <h1 className="text-2xl sm:text-3xl font-bold mb-8">
            Artículos de <span className="capitalize">{prettyCategory}</span>
          </h1>
          <div className="flex flex-col gap-8">
            {articles.length === 0 && (
              <p className="text-gray-500">No hay artículos en esta categoría.</p>
            )}
            {articles.map(art => (
              <Link key={art.slug} href={`/articles/${art.slug}`} className="group flex gap-6 items-center hover:bg-gray-50 p-4 rounded-xl transition">
                <div className="relative w-36 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                  <Image src={art.cover} alt={art.title} layout="fill" objectFit="cover" />
                </div>
                <div className="flex-1">
                  <span className="text-xs text-gray-500 font-medium">{art.category}</span>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:underline mb-1 line-clamp-2">{art.title}</h3>
                  <p className="text-gray-600 mb-2 text-sm line-clamp-2">{art.excerpt}</p>
                  <div className="flex items-center gap-2">
                    <Image src={art.avatar} alt={art.author} width={32} height={32} className="rounded-full" />
                    <span className="text-xs text-gray-700">{art.author}</span>
                    <span className="text-xs text-gray-400">· {art.date}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {/* Botón Ver más */}
          {hasMore && (
            <div className="flex justify-center mt-10">
              <button
                onClick={() => setVisibleCount(visibleCount + PAGE_SIZE)}
                className="rounded-lg bg-black text-white px-5 py-2 font-semibold text-base hover:bg-gray-800 transition"
              >
                Ver más
              </button>
            </div>
          )}
        </section>
        {/* SIDEBAR DERECHO */}
        <aside className="w-full md:w-64 flex-shrink-0 md:block hidden sticky top-28 self-start">
          <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 shadow-sm pb-12 min-h-[420px]">
            {/* Todas las categorías */}
            <h4 className="text-md font-semibold mb-4">Categorías</h4>
            <div className="flex flex-wrap gap-2 mb-8">
              {allCategories.map(cat => (
                <Link
                  key={cat}
                  href={`/categories/${slugify(cat)}`}
                  className={`px-3 py-1 rounded-full border text-xs font-medium whitespace-nowrap transition ${
                    slugify(cat) === category
                      ? "bg-black text-white border-black"
                      : "border-gray-200 bg-white text-gray-600 hover:bg-black hover:text-white"
                  }`}
                >
                  {cat}
                </Link>
              ))}
            </div>
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
            {/* Newsletter */}
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
