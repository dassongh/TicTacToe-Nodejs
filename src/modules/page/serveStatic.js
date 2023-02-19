const path = require('path');
const fs = require('fs/promises');
const httpError = require('../../utils/httpError');

module.exports = async function serveStatic(req, res) {
  const filePath = path.join(__dirname, '../../../dist', req.url);
  const extname = path.extname(filePath);

  const types = {
    '.js': 'text/javascript',
    '.css': 'text/css',
    '/jpg': 'image/jpg',
  };

  const contentType = types[extname];

  let file;
  try {
    file = await fs.readFile(filePath);
  } catch (err) {
    httpError(res, 404, 'Not found');
  }

  res.writeHead(200, { 'Content-Type': contentType });
  res.end(file, 'utf8');
};
