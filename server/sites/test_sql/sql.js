var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "MyDB"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con.query("CREATE TABLE IF NOT EXISTS Data (Id SMALLINT NOT NULL AUTO_INCREMENT, DateTime DATETIME, Temperature FLOAT(5, 2), Humidity FLOAT(5, 2), PRIMARY KEY(Id))", function (err, result) {
    if (err) throw err;
    console.log("Table \"Data\" created");
  });
  con.query("CREATE TABLE IF NOT EXISTS Thing (Id SMALLINT NOT NULL AUTO_INCREMENT, LastChange DATETIME, State TINYINT, PRIMARY KEY(Id))", function (err, result) {
    if (err) throw err;
    console.log("Table \"Thing\" created");
  });
});

