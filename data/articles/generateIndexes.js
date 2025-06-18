const fs = require('fs');
const path = require('path');

const articlesDir = path.join(__dirname, 'data/articles');
const indexPath = path.join(articlesDir, 'index.json');

function getArticleData(fileName) {
  const [author, article] = fileName.replace('.mdx', '').split('_article_');
  return {
    authorId: author.replace('author_', ''),
    articleNumber: article,
    fileName,
  };
}

function generateIndex() {
  const files = fs.readdirSync(articlesDir).filter(file => file.endsWith('.mdx'));
  const indexData = files.map(getArticleData);

  fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 2));
  console.log(`✅ Archivo index.json generado con ${indexData.length} entradas`);
}

generateIndex();