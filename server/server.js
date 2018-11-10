var app = require('express')();
var http = require('http').Server(app);
var ip = require('ip');
var io = require('socket.io')(http);
var fs = require('fs');

app.get('/', function(req, res){
   console.log("Request : " + req.toString());
   fs.readFile('./sites' + req.url, function(err, data){
      console.log('./sites' + req.url);
      if (!err) {
         var dotoffset = req.url.lastIndexOf('.');
         console.log("Dot Offset " + dotoffset);
         var mimetype = dotoffset == -1
                        ? 'text/plain'
                        : {
                           '.html': 'text/html',
                           '.ico' : 'image/x-icon',
                           '.jpg' : 'image/jpeg',
                           '.png' : 'image/png',
                           '.gif' : 'image/gif',
                           '.css' : 'text/css',
                           '.js' : 'text/javascript'
                        }[ req.url.substr(dotoffset) ];
         res.setHeader('Content-type' , mimetype);
         res.end(data);
         console.log( requ.url, mimetype );
      } else {
         console.log ('File Not Found: ' + req.url);
         res.writeHead(404, "Not Found");
         res.end();
      }
   });
});

http.listen(8000, function(){
   console.log("Server is running at " + ip.address() + ':8000. ' + "Try to press ^A then ^D.");
});

io.on('connection', function(socket){
  console.log('A user connected');
});