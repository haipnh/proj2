#include "utils.h"

Thing_t Things[4];
SensorData_t SensorData;

String generateUID(String macAdd) {
  // {"type" : "id", "macaddress" : [mac-address]}
  String UID = "{\"Type\":\"Greeting\",\"MacAddress\":\"" + macAdd + "\"}";
  return UID;
}

String makeJsonData(uint8_t temp, uint8_t humi){
  // {"type" : "data", "temp" : 30, "humi" : 70}
  String jsonData = "{\"Type\" : \"Data\", \"Temperature\" : " + String(temp) + ", \"Humidity\" : " + String(humi) + "}";
  return jsonData;
}

uint16_t analogValueOfPwmDuty(uint8_t duty){
  if(duty > 0 || duty <= 100){
    return (uint16_t)(duty*10.23);
  }
  return 0;
}

uint8_t mapPin(uint8_t pin){
   switch(pin){
      case 0: return D1;
      case 1: return D2;
      case 2: return D5;
      case 3: return D6; 
   }
   return 100;
}

void mapPins(){
   for(int i = 0; i < 4; i++){
      Things[i].Pin = mapPin(i);
   }
}

void controlThing(uint8_t thing){
   digitalWrite(Things[thing].Pin, Things[thing].State);
}

void controlThing(uint8_t thing, uint8_t value){
   digitalWrite(Things[thing].Pin, value);
}
