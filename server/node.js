module.exports = {
   handler: function (jsonData){
      if(jsonData.type.localeCompare("data")==0){
         var datetime = jsonData.datetime;
         var temp = jsonData.temp;
         var humi = jsonData.humi;
         if(datetime==null){
            insertTempHumiRecord(createDateTimeInsertToSQL(), temp, humi);
         }
         else
            insertTempHumiRecord(datetime, temp, humi);
      }
   }
}