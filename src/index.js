const http = require('http');
const APPID = process.env.APPID;

const server = http.createServer((req, res) => {
	res.writeHead(200, { 'Content-Type': 'application/json' });
	res.end(JSON.stringify({ hello: `From ${APPID}` }));
});

server.listen(1111, () => console.log('server is listening'));
