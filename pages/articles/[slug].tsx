import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Image from "next/image";

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
      <Header />
      <article className="max-w-2xl mx-auto px-4 py-12">
        {/* Portada */}
        {frontmatter.cover && (
          <div className="relative w-full aspect-[16/9] mb-8 rounded-xl overflow-hidden shadow-lg">
            <Image
              src={frontmatter.cover}
              alt={frontmatter.title}
              layout="fill"
              objectFit="cover"
              priority
            />
          </div>
        )}
        {/* Título y meta */}
        <h1 className="text-4xl font-extrabold mb-2 text-gray-900">{frontmatter.title}</h1>
        <div className="flex items-center gap-3 mb-8">
          <Image
            src={frontmatter.authorAvatar}
            alt={frontmatter.authorName}
            width={40}
            height={40}
            className="rounded-full border border-gray-200 shadow"
          />
          <div>
            <div className="font-semibold text-gray-900">{frontmatter.authorName}</div>
            <div className="text-xs text-gray-500">{frontmatter.date}</div>
          </div>
        </div>
        {/* Artículo en sí */}
        <div className="prose prose-lg max-w-none prose-headings:font-bold prose-img:rounded-xl prose-img:mx-auto dark:prose-invert">
          <MDXRemote {...source} />
        </div>
      </article>
      <Footer />
    </>
  );
}
