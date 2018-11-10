#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include "DHT.h"  ///
#define DHTPIN D1 ///
#define DHTPIN D2 ///
#define DHTPIN D3 ///
#define DHTPIN D4 ///
#define DHTPIN D5 ///
#define DHTTYPE DHT11 ///
float temp, humi;
DHT dht(DHTPIN, DHTTYPE); 
void setup() { 
  Serial.begin(921600); //Serial connection
  WiFi.begin("N200RE", "helloworld");   //WiFi connection
 
  while (WiFi.status() != WL_CONNECTED) {  //Wait for the WiFI connection completion 
    delay(500);
    Serial.println("Waiting for connection"); 
  }
  Serial.println("Connected"); 
  randomSeed(analogRead(0)); // Start random generators 
  dht.begin();
}
 
void loop() { 
  delay(2000);///
  humi = dht.readHumidity();///
  temp = dht.readTemperature();///
  float f = dht.readTemperature(true);///
  if (isnan(humi) || isnan(temp) || isnan(f)) {///
    Serial.println("Failed to read from DHT sensor!");///
    return;///
  }///
 if(WiFi.status()== WL_CONNECTED){   //Check WiFi connection status 
   HTTPClient http;    //Declare object of class HTTPClient 
   String url = "http://192.168.1.12/?"; 
   url += ("temp=" + String(temp,2) + "&");
   url += "degree=C&";
   url += ("humi=" + String(humi,2));
   http.begin(url); //Specify request destination
   int httpCode = http.GET();
   Serial.println("sent");
   Serial.println("CODE : " + httpCode);
   Serial.println("Payload : " + http.getString());
   http.end();  //Close connection    
 }else{ 
    Serial.println("Error in WiFi connection");   
 } 
  delay(1000);  //Send a request every 1 seconds 
  }