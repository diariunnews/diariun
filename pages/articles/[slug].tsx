import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Image from "next/image";
import Head from "next/head";

const ARTICLES_PATH = path.join(process.cwd(), "data", "articles");

export async function getStaticPaths() {
  const files = fs.readdirSync(ARTICLES_PATH);
  const paths = files
    .filter((f) => f.endsWith(".mdx"))
    .map((filename) => ({
      params: { slug: filename.replace(/\.mdx$/, "") },
    }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const { slug } = params;
  const fullPath = path.join(ARTICLES_PATH, `${slug}.mdx`);
  const source = fs.readFileSync(fullPath, "utf-8");
  const { content, data } = matter(source);
  const mdxSource = await serialize(content);
  return {
    props: {
      source: mdxSource,
      frontmatter: data,
    },
  };
}

export default function ArticlePage({ source, frontmatter }) {
  return (
    <>
      <Head>
        <title>{frontmatter.title} | Diariun</title>
        <meta name="description" content={frontmatter.excerpt || "Artículo en Diariun"} />
        <meta property="og:title" content={frontmatter.title} />
        <meta property="og:image" content={frontmatter.cover} />
        <meta property="og:description" content={frontmatter.excerpt || ""} />
        <meta property="og:type" content="article" />
      </Head>

      <Header />

      <article className="max-w-2xl mx-auto px-4 py-12">
        {/* Título principal */}
        <h1 className="text-4xl font-extrabold mb-6 text-gray-900">{frontmatter.title}</h1>

        {/* Subtítulo opcional */}
        {frontmatter.excerpt && (
          <p className="text-lg text-gray-600 mb-8">{frontmatter.excerpt}</p>
        )}

        {/* Imagen destacada */}
        {frontmatter.cover && (
          <div className="relative w-full aspect-[16/9] mb-10 rounded-xl overflow-hidden shadow-lg">
            <Image
              src={frontmatter.cover}
              alt={frontmatter.title}
              layout="fill"
              objectFit="cover"
              priority
            />
          </div>
        )}

        {/* Línea superior */}
        <hr className="border-t border-gray-200 mb-4" />

        {/* Meta: autor, fecha, categoría */}
        <div className="flex items-center gap-3 mb-4">
          <Image
            src={frontmatter.authorAvatar}
            alt={frontmatter.authorName}
            width={40}
            height={40}
            className="rounded-full border border-gray-200 shadow"
          />
          <div>
            <div className="font-semibold text-gray-900">{frontmatter.authorName}</div>
            <div className="text-xs text-gray-500">
              {frontmatter.date} · {frontmatter.category}
            </div>
          </div>
        </div>

        {/* Línea inferior */}
        <hr className="border-t border-gray-200 mb-10" />

        {/* Contenido del artículo */}
        <div className="prose prose-lg max-w-none prose-headings:font-bold prose-img:rounded-xl prose-img:mx-auto dark:prose-invert">
          <MDXRemote {...source} />
        </div>

        {/* Backlink automático */}
        <div className="mt-12 pt-6 border-t text-sm text-gray-500">
          Este artículo fue publicado en{" "}
          <a href="https://diariun.com" className="underline text-gray-700 hover:text-black">Diariun</a>{" "}
          como parte de una estrategia de SEO que incluye un backlink dofollow hacia{" "}
          <a
            href="https://flexsirent.com"
            className="text-blue-600 underline"
            rel="dofollow"
            target="_blank"
          >
            FlexSiRent
          </a>.
        </div>
      </article>

      <Footer />
    </>
  );
}
