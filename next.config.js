const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: { providerImportSource: "@mdx-js/react" }
});
module.exports = withMDX({
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
});
