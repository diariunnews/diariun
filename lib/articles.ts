import fs from "fs";
import path from "path";
import matter from "gray-matter";

const articlesDirectory = path.join(process.cwd(), "data/articles");

export function getAllArticles() {
  const fileNames = fs.readdirSync(articlesDirectory);
  const articles = fileNames
    .filter((file) => file.endsWith(".mdx"))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, "");
      const fullPath = path.join(articlesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);

      return {
        slug,
        ...(data as {
          title: string;
          date: string;
          excerpt?: string;
          cover?: string;
          author?: string;
          category?: string;
        }),
      };
    });

  // Ordena por fecha descendente
  articles.sort((a, b) => (a.date > b.date ? -1 : 1));
  return articles;
}

export function getArticleBySlug(slug: string) {
  const fullPath = path.join(articlesDirectory, `${slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  return {
    slug,
    meta: data,
    content,
  };
}
