const fs = require("fs");
const path = require("path");

const articlesDir = path.join(__dirname, "data", "articles");
const files = fs.readdirSync(articlesDir).filter(f => f.endsWith(".mdx"));

files.forEach(filename => {
  const filePath = path.join(articlesDir, filename);
  let content = fs.readFileSync(filePath, "utf-8");

  // Encuentra el primer bloque de frontmatter (lo deja intacto)
  const frontmatterMatch = content.match(/^---\s[\s\S]+?---/);
  let mainFrontmatter = "";
  let body = content;
  if (frontmatterMatch) {
    mainFrontmatter = frontmatterMatch[0];
    body = content.slice(mainFrontmatter.length);
  }

  // Elimina todos los bloques secundarios de --- ... ---
  // (cuidado: no queremos tocar el frontmatter principal)
  body = body.replace(/---\s*[\s\S]+?---/g, "");

  // Opcional: limpia líneas vacías repetidas
  body = body.replace(/\n{3,}/g, "\n\n");

  // Junta el frontmatter principal con el body limpio
  const finalContent = mainFrontmatter + body;

  // Sobrescribe el archivo
  fs.writeFileSync(filePath, finalContent, "utf-8");
  console.log(`Cleaned: ${filename}`);
});

console.log("¡Limpieza completada!");
