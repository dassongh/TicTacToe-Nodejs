const path = require('path');
const fs = require('fs/promises');

async function renderStartPage(req, res) {
  const filePath = path.resolve(__dirname, '../../frontend/index.html');

  let page;
  try {
    page = await fs.readFile(filePath);
  } catch (err) {
    console.error(err);
  }

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(page, 'utf8');
}

module.exports = renderStartPage;
