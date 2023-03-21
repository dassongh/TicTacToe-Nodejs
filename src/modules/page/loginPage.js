const path = require('path');
const fs = require('fs/promises');

module.exports = async function renderLoginPage(req, res) {
  const filePath = path.resolve(__dirname, '../../../dist/login.html');

  let page;
  try {
    page = await fs.readFile(filePath);
  } catch (err) {
    console.error(err);
  }

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(page, 'utf8');
};
