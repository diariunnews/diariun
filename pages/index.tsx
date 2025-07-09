import Header from "../components/Header";
import Footer from "../components/Footer";
import Image from "next/image";
import Link from "next/link";

// Ejemplo de datos (sustituye por los tuyos)
const categories = [
  "Tecnología", "Negocios", "Cultura", "Ciencia", "Sociedad", "Deportes", "Salud", "Viajes"
];

const featured = {
  id: "post1",
  title: "El futuro de la IA: ¿Oportunidad o amenaza?",
  excerpt: "La inteligencia artificial está cambiando la manera en la que vivimos, trabajamos y aprendemos. Pero ¿estamos preparados para su impacto?",
  author: {
    name: "Ana Torres",
    avatar: "/authors/female-114.jpg",
  },
  cover: "/hero-image.jpg",
  date: "9 Jul 2025",
  category: "Tecnología"
};

const articles = [
  {
    id: "post2",
    title: "5 claves para invertir en tiempos de incertidumbre",
    excerpt: "Las finanzas personales pueden ser un reto, pero con estos consejos estarás mejor preparado.",
    author: { name: "Daniel Reyes", avatar: "/authors/male-001.jpg" },
    cover: "/Foto_Portada_Diarium.jpg",
    date: "8 Jul 2025",
    category: "Negocios"
  },
  {
    id: "post3",
    title: "Cómo escribir artículos que sí lee Google (y las personas)",
    excerpt: "SEO para 2025 explicado simple, sin humo y sin trucos.",
    author: { name: "Emily Zhang", avatar: "/authors/female-116.jpg" },
    cover: "/Foto_Portada_Diarium.jpg",
    date: "8 Jul 2025",
    category: "Cultura"
  },
  {
    id: "post4",
    title: "¿Cuánto deporte necesitas para ser feliz?",
    excerpt: "Un estudio revela el número de minutos clave para mejorar tu bienestar.",
    author: { name: "Javier López", avatar: "/authors/male-002.jpg" },
    cover: "/Foto_Portada_Diarium.jpg",
    date: "7 Jul 2025",
    category: "Salud"
  },
  // ...agrega más artículos aquí
];

// Sidebar: autores destacados
const authors = [
  { name: "Ana Torres", avatar: "/authors/female-114.jpg", bio: "Tecnología y sociedad" },
  { name: "Daniel Reyes", avatar: "/authors/male-001.jpg", bio: "Economía y empresas" },
  { name: "Emily Zhang", avatar: "/authors/female-116.jpg", bio: "Cultura y comunicación" },
];

export default function Home() {
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
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 px-4 py-10 items-center">
          <div>
            <span className="text-xs uppercase text-gray-500 font-medium">{featured.category}</span>
            <h1 className="text-4xl font-extrabold mt-2 mb-4 leading-tight text-gray-900">{featured.title}</h1>
            <p className="text-lg text-gray-600 mb-6">{featured.excerpt}</p>
            <div className="flex items-center gap-3">
              <Image src={featured.author.avatar} alt={featured.author.name} width={36} height={36} className="rounded-full" />
              <span className="text-sm text-gray-800 font-semibold">{featured.author.name}</span>
              <span className="text-xs text-gray-400">· {featured.date}</span>
            </div>
          </div>
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl shadow-lg">
            <Image src={featured.cover} alt="Imagen destacada" layout="fill" objectFit="cover" />
          </div>
        </div>
      </section>

      {/* Grid de artículos y Sidebar */}
      <main className="max-w-5xl mx-auto px-4 mt-10 flex flex-col md:flex-row gap-12">
        {/* Listado de artículos */}
        <section className="flex-1 min-w-0">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Últimos artículos</h2>
          <div className="flex flex-col gap-8">
            {articles.map((art) => (
              <Link key={art.id} href={`/articles/${art.id}`} className="group flex gap-6 items-center hover:bg-gray-50 p-4 rounded-xl transition">
                <div className="relative w-36 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                  <Image src={art.cover} alt={art.title} layout="fill" objectFit="cover" />
                </div>
                <div className="flex-1">
                  <span className="text-xs text-gray-500 font-medium">{art.category}</span>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:underline mb-1">{art.title}</h3>
                  <p className="text-gray-600 mb-2 text-sm">{art.excerpt}</p>
                  <div className="flex items-center gap-2">
                    <Image src={art.author.avatar} alt={art.author.name} width={28} height={28} className="rounded-full" />
                    <span className="text-xs text-gray-700">{art.author.name}</span>
                    <span className="text-xs text-gray-400">· {art.date}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Sidebar de autores */}
        <aside className="w-full md:w-64 flex-shrink-0 md:block hidden">
          <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 shadow-sm">
            <h4 className="text-md font-semibold mb-4">Autores destacados</h4>
            <ul className="space-y-4">
              {authors.map((a) => (
                <li key={a.name} className="flex items-center gap-3">
                  <Image src={a.avatar} alt={a.name} width={36} height={36} className="rounded-full" />
                  <div>
                    <span className="font-medium text-gray-800">{a.name}</span>
                    <p className="text-xs text-gray-500">{a.bio}</p>
                  </div>
                </li>
              ))}
            </ul>
            <Link href="/authors" className="block text-blue-600 text-sm mt-5 font-medium hover:underline">
              Ver todos los autores →
            </Link>
          </div>
        </aside>
      </main>

      <Footer />
    </>
  );
}
