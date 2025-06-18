import Link from "next/link";
import Image from "next/image";
import articles from "../data/articles/index.json";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 border-b">
        <div className="text-xl font-bold">
          <Link href="/">Diariun</Link>
        </div>
        <nav className="flex gap-4 text-sm">
          <Link href="/our-story">Our story</Link>
          <Link href="/membership">Membership</Link>
          <Link href="/write">Write</Link>
          <Link href="/signin">Sign in</Link>
          <Link href="/get-started" className="font-semibold">Get started</Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="flex flex-col md:flex-row items-center justify-between px-6 py-12">
        <div className="max-w-xl">
          <h1 className="text-4xl font-bold mb-4">Where stories begin.</h1>
          <p className="text-lg mb-6">
            Welcome to <strong>Diariun</strong> – the multilingual publishing platform for professionals, agencies and businesses.
          </p>
          <p className="text-base">
            Sign up, write, and grow your audience. All in one place.
          </p>
        </div>
        <div className="mt-6 md:mt-0">
          <Image
            src="/hero-image.jpg"
            alt="Hero"
            width={500}
            height={400}
            className="rounded-lg shadow"
          />
        </div>
      </section>

      {/* Articles */}
      <section className="px-6 py-8">
        <h2 className="text-2xl font-semibold mb-4">Latest articles</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {articles.slice(0, 12).map((article) => (
            <Link key={article.slug} href={`/articles/${article.slug}`}>
              <div className="border rounded-lg p-4 hover:shadow-md transition">
                <h3 className="text-lg font-bold">{article.title}</h3>
                <p className="text-sm text-gray-600 mt-2">{article.excerpt}</p>
                <p className="text-xs text-gray-500 mt-1">
                  By {article.author} · {article.date}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-6 border-t text-sm text-gray-600 flex flex-wrap gap-4 justify-center">
        <Link href="/help">Help</Link>
        <Link href="/status">Status</Link>
        <Link href="/about">About</Link>
        <Link href="/careers">Careers</Link>
        <Link href="/press">Press</Link>
        <Link href="/blog">Blog</Link>
        <Link href="/privacy">Privacy</Link>
        <Link href="/rules">Rules</Link>
        <Link href="/terms">Terms</Link>
      </footer>
    </main>
  );
}