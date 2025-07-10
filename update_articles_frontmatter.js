const fs = require('fs');
const path = require('path');

const articlesDir = path.join(__dirname, 'data', 'articles');
const authorsDir = path.join(__dirname, 'data', 'authors');

const NUM_ARTICLES = 225;

for (let i = 1; i <= NUM_ARTICLES; i++) {
  const numStr = String(i).padStart(3, '0');
  const articleFile = path.join(articlesDir, `author_${numStr}_article_1.mdx`);
  const authorFile = path.join(authorsDir, `author_${numStr}.json`);

  if (!fs.existsSync(articleFile) || !fs.existsSync(authorFile)) {
    console.log(`❌ Skipping: ${articleFile} or ${authorFile} not found`);
    continue;
  }

  // Carga datos del autor
  const authorData = JSON.parse(fs.readFileSync(authorFile, 'utf-8'));
  const authorId = `author_${numStr}`;
  const authorName = authorData.name || `Autor ${numStr}`;
  const authorAvatar = authorData.avatar || `/authors/${authorId}.jpg`;

  // Lee el artículo y separa frontmatter/body (si ya existe frontmatter)
  const content = fs.readFileSync(articleFile, 'utf-8');
  let body = content;
  let title = `Título del artículo de ${authorName}`;
  let excerpt = "Resumen del artículo...";
  let date = "2025-07-10";
  let cover = "/Foto_Portada_Diarium.jpg";
  let category = "General";

  // Intenta extraer el frontmatter si ya existe
  if (content.startsWith('---')) {
    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (match) {
      // Si quieres conservar el body antiguo
      body = match[2];
      // Puedes también parsear antiguos valores si lo necesitas...
    }
  }

  // Crea el nuevo frontmatter
  const newFrontmatter = [
    "---",
    `title: "${title}"`,
    `author: "${authorId}"`,
    `authorName: "${authorName}"`,
    `authorAvatar: "${authorAvatar}"`,
    `date: "${date}"`,
    `excerpt: "${excerpt}"`,
    `cover: "${cover}"`,
    `category: "${category}"`,
    "---",
  ].join('\n');

  const newContent = `${newFrontmatter}\n\n${body.trim()}\n`;

  // Sobrescribe el archivo
  fs.writeFileSync(articleFile, newContent, 'utf-8');
  console.log(`✅ Actualizado: ${articleFile}`);
}

console.log("✅ TODOS LOS ARTÍCULOS ACTUALIZADOS.");
