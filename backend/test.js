const http = require('http');
const server = http.createServer((req, res) => res.end('hello'));
server.listen(5000, () => console.log('Listening on 5000'));
