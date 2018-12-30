module.exports = {
   convertFromSqlDateTime: function(sqlDateTime){
      var dt = sqlDateTime.split(/[- :]/);
      var jsDateTime = new Date(dt[0], dt[1] - 1, dt[2], dt[3], dt[4], dt[5]);
      return jsDateTime;
   },
   
   convertToSqlDateTime: function(jsDateTime){
      var year = jsDateTime.getFullYear();
      var month = jsDateTime.getMonth() + 1;
      var date = jsDateTime.getDate();
      var hour = jsDateTime.getHours();
      var minute = jsDateTime.getMinutes();
      var second = jsDateTime.getSeconds();
      var sqlDateTime = year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
      return sqlDateTime;
   },
   
   calcElapsedMinutes: function(fromDateTime, toDateTime){
      // result of (toDateTime-fromDateTime) is in milliseconds
      // so we divide it by (1000*60) to get elapsed minutes
      return parseInt((toDateTime-fromDateTime)/(1000*60));   
   },
   
   calcElapsedSeconds: function(fromDateTime, toDateTime){
      // result of (toDateTime-fromDateTime) is in milliseconds
      // so we divide it by (1000*60) to get elapsed minutes
      return parseInt((toDateTime-fromDateTime)/(1000));   
   },
   
   pushData2Array: function(data, datas, length, callback){
      if(datas.length == length){
         datas.shift();
      }
      datas.push(data);
      if(typeof callback=="function") callback();
   },
   
   pushThing2Array: function(thing, things){
      for(var i = 0; i< things.length ;i++){
         if(thing.Thing == things[i].Thing){
            things[i] = thing; 
         }             
      }         
   }
}