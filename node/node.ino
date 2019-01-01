#include <ESP8266WiFi.h>
#include <SocketIOClient.h>
#include <ArduinoJson.h>

#include "DHT.h"
#define DHTPIN  D7
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

#include "utils.h"

#define DEBUG 1

#define ssid "HatoLabs"
#define password "helloworld"

int8_t thing=-1;

SocketIOClient client;
//char host[] = "34.219.71.32";  // AWS EC2 Instance's Public IP Address
char host[] = "52.38.245.177";  // AWS EC2 Instance's Elastic IP Address
//char host[] = "192.168.1.11";
int port = 80;

extern String RID;
extern String Rfull;

// Variables for ledTask
uint32_t ledPreviousMillis = 0;
uint8_t ledInterval = 10, ledDuty=0, ledDirection=0;
void ledTask(uint32_t currentMillis);

// Variables for dataTask
uint32_t dataPreviousMillis = 0;
uint32_t dataInterval = 5000;
void dataTask(uint32_t currentMillis);

// Variables for pseudoDataTask
uint32_t pseudoDataPreviousMillis = 0;
uint32_t pseudoDataInterval = 10000;
void pseudoDataTask(uint32_t currentMillis);

// Variables for thingTask
uint32_t thingPreviousMillis = 0;
uint32_t thingInterval = 1;
void thingTask(uint32_t currentMillis);

void setupGPIO(){
  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(D1, OUTPUT);  
  pinMode(D2, OUTPUT);  
  pinMode(D5, OUTPUT);  
  pinMode(D6, OUTPUT);  
}

void setupWifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(250);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void setupClient() {
  if (!client.connect(host, port)) {
    Serial.println(F("Ket noi den socket server that bai!"));
    return;
  }
  if (client.connected()) {
    client.sendJSON("node2ser", generateUID(String(WiFi.macAddress())));
    uint8_t h = SensorData.Humi, t = SensorData.Temp;
    if(!((isnan(h) || isnan(t)) || (h == 0 && t == 0) || (h == 255 && t == 255))){
      client.sendJSON("node2ser", makeJsonData(t, h));
    }
  }
}

void setup() {
  Serial.begin(115200);
  // Connect WIFI
  setupWifi();
  setupClient();
  setupGPIO();
  mapPins();
  randomSeed(A0);

  Serial.println("Setup done. Now wait 2 seconds for DHT11.");
  delay(2000);  
}

void loop() {
  if (!client.connected()) {
    client.reconnect(host, port);
  }
  
  uint32_t currentMillis = millis();
  
  ledTask(currentMillis);
  dataTask(currentMillis);
  //pseudoDataTask(currentMillis);
   
  thingTask(currentMillis);
  
  if (client.monitor()) {
    StaticJsonBuffer<300> jsonBuffer;
    JsonObject& root = jsonBuffer.parseObject(Rfull);
//    if(DEBUG){
//      Serial.println("RID : " + RID);
//      Serial.println("Rfull : " + Rfull);
//    }
    if(RID.equals("ser2node")){
       const char* type = root["type"];
//       if(DEBUG) Serial.println("Type : " + String(type));
       if(strcmp(type, "cmd")==0){
          thing = root["thing"];
          if(DEBUG) Serial.println("thing : " + thing);
          if(isnan(thing)) thing=-1;
          else
          {
            Things[thing].State = root["state"];
            Things[thing].AutoMode = root["automode"];
            Things[thing].AutoBy = root["autoby"];
            Things[thing].IfGreaterThan = root["ifgreaterthan"];
            Things[thing].Threshold = root["threshold"]; 
          } 
       }       
    }
  }  
}

void ledTask(uint32_t currentMillis){
  uint32_t elapsedTime = currentMillis - ledPreviousMillis;
  if(elapsedTime > ledInterval) {
    ledPreviousMillis = currentMillis;   
    if(!ledDirection)  ledDuty++; else ledDuty--;
    if(ledDuty==0 || ledDuty==100) ledDirection=!ledDirection;
    analogWrite(LED_BUILTIN, analogValueOfPwmDuty(ledDuty)); 
  }
}

void dataTask(uint32_t currentMillis){
  uint32_t elapsedTime = currentMillis - dataPreviousMillis;
  if(elapsedTime > dataInterval) {
    dataPreviousMillis = currentMillis;   
    uint8_t t = dht.readTemperature();
    uint8_t h = dht.readHumidity();    
    if ((isnan(h) || isnan(t)) || (h == 0 && t == 0) || (h == 255 && t == 255)) {
      if(DEBUG){
        Serial.print("Failed to read from DHT sensor! Temp : "); Serial.print(String(t));
        Serial.println("   Humi : " + String(h));
      }
    }else
    { 
      SensorData.Temp = t;
      SensorData.Humi = h;
      if(client.connected()){
        client.sendJSON("node2ser", makeJsonData(t, h));
        if(DEBUG) Serial.println("DHT Sent : " + String(t) + "#" +String(h));
      }
    }      
  }
}

void pseudoDataTask(uint32_t currentMillis){
  uint32_t elapsedTime = currentMillis - pseudoDataPreviousMillis;
  if(elapsedTime > pseudoDataInterval) {
    pseudoDataPreviousMillis = currentMillis;
    uint8_t t = random(29,31);
    uint8_t h = random(75,85);
    SensorData.Temp = t;
    SensorData.Humi = h;
    if(client.connected()){
      client.sendJSON("node2ser", makeJsonData(t, h));
      if(DEBUG) Serial.println("Sent : " + String(t) + "#" +String(h));
    }
  }
}

void thingTask(uint32_t currentMillis){
   uint32_t elapsedTime = currentMillis - thingPreviousMillis;
   if(elapsedTime > thingInterval) {
      thingPreviousMillis = currentMillis;
      //if((thing!=-1)&&(Things[thing].AutoMode==0)){     
      if(thing!=-1){
         controlThing(thing);
         thing=-1;
      }
    
      for(uint8_t i = 0; i<4; i++){
         if(Things[i].State==1){
            if(Things[i].AutoMode==1 && Things[i].AutoBy==0){
               if(Things[i].IfGreaterThan==0){
                  if(SensorData.Temp < Things[i].Threshold){
                     Things[i].State=1;
                     controlThing(i);      
                  }
                  else{
                     Things[i].State=0;
                     controlThing(i);
                  }
               }else{
                  if(SensorData.Temp > Things[i].Threshold){
                     Things[i].State=1;
                     controlThing(i);      
                  }
                  else{
                     Things[i].State=0;
                     controlThing(i);
                  }
               }
            } else if (Things[i].AutoMode==1 && Things[i].AutoBy==1){
               if(Things[i].IfGreaterThan==0){
                  if(SensorData.Humi < Things[i].Threshold){
                     Things[i].State=1;
                     controlThing(i);      
                  } else{
                     Things[i].State=0;
                     controlThing(i);
                  }
               }else{
                  if(SensorData.Humi > Things[i].Threshold){
                     Things[i].State=1;
                     controlThing(i);      
                  }else{
                     Things[i].State=0;
                     controlThing(i);
                  }
               }
            }       
         }
      }
   }
}
