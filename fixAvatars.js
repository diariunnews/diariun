const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const dir = path.join(process.cwd(), "data", "articles");

const files = fs.readdirSync(dir).filter(f => f.endsWith(".mdx"));

files.forEach(filename => {
  const filePath = path.join(dir, filename);
  const content = fs.readFileSync(filePath, "utf-8");
  const parsed = matter(content);

  // REGLA: Calcula el nombre correcto del avatar según el author
  // Ejemplo: author_001 → male-001.jpg, author_114 → female-114.jpg
  let avatarFile = "";
  if (parsed.data.author) {
    const num = Number(parsed.data.author.replace("author_", ""));
    if (num >= 1 && num <= 113) avatarFile = `male-${String(num).padStart(3, "0")}.jpg`;
    else if (num >= 114 && num <= 200) avatarFile = `female-${String(num).padStart(3, "0")}.jpg`;
    else avatarFile = "default.jpg";
  } else {
    avatarFile = "default.jpg";
  }

  // CORRIGE el campo authorAvatar
  parsed.data.authorAvatar = `/authors/${avatarFile}`;

  // ELIMINA el campo avatar si existe
  if (parsed.data.avatar) {
    delete parsed.data.avatar;
  }

  // Vuelve a escribir el archivo .mdx con el frontmatter actualizado
  const newContent = matter.stringify(parsed.content, parsed.data);
  fs.writeFileSync(filePath, newContent);
  console.log(`Corregido: ${filename}`);
});

console.log("¡Todos los artículos actualizados!");
