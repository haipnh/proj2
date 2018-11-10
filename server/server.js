var http = require('http');

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World!\nCE boys are handsome\n');
}).listen(8000);

console.log("Server is running. Try to press ^A then ^D.");

var express = require('express');
var app = express();
var http = require('http').Server(app);
var ip = require('ip');
var mysql = require('mysql');
var url = require('url');

app.use(express.static('public'));

app.get('/index.html', function(req, res){
  app.use(express.static(__dirname));
  res.sendFile(__dirname + '/index.html');  
});

http.listen(80, function(){
   console.log('Server starts at ' + ip.address() + ':80');
});

var temp, humi;

app.get('/', function(req, res){
    res.writeHead(200, {'Content-Type': 'text/plain'});    
	// console.log(req.url);
	var q = url.parse(req.url, true).query;	
	var txt = "Temp : " + q.temp + q.degree + " Humi : " + q.humi;
	console.log(txt);
	res.write(txt);
    res.end();
	// var con = mysql.createConnection({
		// host: "localhost",
		// user: "root",
		// password: "root",
		// database: "mydb"		
	// });
	// con.connect(function(err) {
		// if (err) throw err;
		// process.stdout.write("Connected database ! Inserting...");
		// temp = parseFloat(q.temp);
		// humi = parseFloat(q.humi);
		// var sql = "INSERT INTO datas (temp, humi) VALUES (" + temp + "," + humi + ")";
		// con.query(sql, function (err, result) {
			// if (err) throw err;
			// console.log("Done ! 1 record inserted");
		// }); 
	// });
});