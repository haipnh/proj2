var express = require('express');
var app = express();
var http = require('http').Server(app);
var ip = require('ip');
var io = require('socket.io');
var fs = require('fs');

app.get('/', function (req, res){
   fs.readFile('./' + req.url, function(err, data) {
        if (!err) {
            var dotoffset = req.url.lastIndexOf('.');
            var mimetype = dotoffset == -1
                            ? 'text/plain'
                            : {
                                '.html' : 'text/html',
                                '.ico' : 'image/x-icon',
                                '.jpg' : 'image/jpeg',
                                '.png' : 'image/png',
                                '.gif' : 'image/gif',
                                '.css' : 'text/css',
                                '.js' : 'text/javascript'
                                }[ req.url.substr(dotoffset) ];
            res.setHeader('Content-type' , mimetype);
            res.end(data);
            console.log( req.url, mimetype );
        } else {
            console.log ('file not found: ' + req.url);
            res.writeHead(404, "Not Found");
            res.end();
        }
    });
});

http.listen(80, function(){
   console.log('Server starts at ' + ip.address() + ':80');
});
