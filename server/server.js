var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mysql = require('mysql');

var mySqlHelper = require("./mySqlHelper.js");
var myUtils = require("./myUtils.js");

// Attaching SQL
mySqlHelper.mySqlInit();

const dataLength = 24;
const numberOfThings = 4;

var dataCycleInSecond = 10;
var dataCycleInMinute = 60;

var States = []; 
var Data = []; 

mySqlHelper.getLastestData(dataLength, function(callback){
   Data=callback;   
   New = Data[Data.length-1];
   // console.log(typeof New.DateTime);  
});

for(var i = 0; i < numberOfThings;i++){
   mySqlHelper.getLastestState(i, function(callback){
   if(callback!=null) States.push(callback);
});
}

// Starting HTTP
// Express HTTP-server that serves static files
app.use(express.static(__dirname + "/sites"));

// Serving specified request
app.get("/dump", function(req, res){
   res.sendFile(__dirname + "/sites/dump.html");
});

io.on("connection", function(socket){
   console.log("A client connected");
      
   socket.on("web2ser", function(msg){
      console.log("web2ser : " + JSON.stringify(msg));
      webHandler(msg);
   });
   
   socket.on("node2ser", function(msg){   
      console.log("node2ser : " + JSON.stringify(msg));   
      nodeHandler(msg);      
   });
   
   socket.on("disconnect", function(){
      console.log("Client disconnected");
   });
});

http.listen(80, function(err){
	if (err) throw err;
    console.log("[","\x1b[32m", "HTTP" , "\x1b[0m", "] ");
});

function webHandler(jsonData){
   var type = jsonData.Type;
   if(type !=null){
      if(type.localeCompare("Greeting")==0){ 
         //console.log(Data);
         io.emit("ser2web", {"Type":"State", "Payload": States});
         io.emit("ser2web", {"Type":"Data", "Payload": Data});
      }
   
      if(type.localeCompare("Command")==0){ 
         var obj2node = {type:"cmd", thing: jsonData.Thing, state: jsonData.State, automode: jsonData.AutoMode, autoby: jsonData.AutoBy, ifgreaterthan: jsonData.IfGreaterThan, threshold: jsonData.Threshold};      
         io.emit("ser2node", obj2node); // Chuyen tiep den node
         console.log("ser2node : " + JSON.stringify(obj2node));        
         jsonData.LastChange = new Date(); // Ghi nhan thoi gian      
         //console.log(JSON.stringify(States));
         //console.log(JSON.stringify(jsonData));
         myUtils.pushThing2Array(jsonData, States); // Cap nhat vao mang Things      
         // Cap nhat co so du lieu
         var sqlData = jsonData;            
         sqlData.LastChange = myUtils.convertToSqlDateTime(jsonData.LastChange);
         mySqlHelper.insertState(sqlData);   
      }   
   }
}

function nodeHandler(jsonData){
   if(jsonData.Type.localeCompare("Greeting")==0){
      console.log("Connected node : " + jsonData.MacAddress);
   }   
   if(jsonData.Type.localeCompare("Data")==0){
      if(typeof jsonData.DateTime == "undefined")
            jsonData.DateTime = new Date();
      if(myUtils.calcElapsedSeconds(new Date(Data[Data.length-1].DateTime), jsonData.DateTime)>=dataCycleInSecond){   
         delete jsonData.Type;  
         myUtils.pushData2Array(jsonData, Data, dataLength, function(){
            var newData = Data[Data.length-1];
            newData.DateTime = new Date(newData.DateTime);
            io.emit("ser2web", {"Type":"New", "Payload": newData});
            console.log("ser2web : "+ JSON.stringify(newData));
            jsonData.DateTime = myUtils.convertToSqlDateTime(jsonData.DateTime);     
            mySqlHelper.insertData(jsonData);
         });         
      }else console.log("Ignored data due to not reaching time limit"); 
   }
}

function clone(from, to, callback){
   to = from.constructor();
   for (var attr in from) {
     if (from.hasOwnProperty(attr)) to[attr] = from[attr];
   }
   if(typeof callback == "function"){
      callback();
   }
}
