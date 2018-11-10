var http = require('http');

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World!\nCE boys are handsome\n');
}).listen(8000);

console.log("Server is running. Try to press ^A then ^D.");
