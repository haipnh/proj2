var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('sites'));

app.get('/', function(req, res){
  app.use(express.static(__dirname));
  res.sendFile(__dirname + '/sites/index.html');
});

app.get('/dump', function(req, res){
  res.sendFile(__dirname + '/sites/dump.html');
});

io.on("connection", function(socket){
   console.log("A user connected");
   socket.on("disconnect", function(){
      console.log("User disconnected");
   });
   socket.on("cmd", function(msg){
      console.log("cmd : " + JSON.stringify(msg));
	  io.emit("cmd2node", msg);
   });
   socket.on("node", function(msg){      
      console.log("node : " + JSON.stringify(msg));
   });
   socket.on("dump", function(msg){      
      console.log("Rx : " + msg);
	   io.emit("dumpback", "Echo : " + msg);
   });
});

http.listen(80, function(){
   console.log('Listening on port 80');
});