import { useRouter } from "next/router";
import articles from "../../data/articles/index.json";
import authors from "../../data/authors/index.json";

export default function ArticlePage() {
  const router = useRouter();
  const { slug } = router.query;

  if (!slug) return <p>Loading...</p>;

  const article = articles.find((a) => a.slug === slug);

  if (!article) return <p>Artículo no encontrado</p>;

  const author = authors.find((a) => a.id === article.authorId);

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: "800px", margin: "auto" }}>
      <h1>{article.title}</h1>
      <p style={{ fontStyle: "italic", color: "gray" }}>
        Por {author?.name || "Autor desconocido"} – {article.date}
      </p>
      <img src={author?.photo || "/default.jpg"} alt={author?.name} style={{ width: 100, borderRadius: "50%", marginTop: "1rem" }} />
      <div style={{ marginTop: "2rem", lineHeight: "1.6" }}>
        {article.content}
      </div>
    </main>
  );
}