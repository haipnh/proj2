#include <ESP8266WiFi.h>
#include <DNSServer.h> 
#include <ESP8266WebServer.h> 
#include <WiFiManager.h>  

void configModeCallback (WiFiManager *myWiFiManager) {   
  Serial.println("Entered config mode");   
  Serial.println(WiFi.softAPIP());   
  Serial.println(myWiFiManager->getConfigPortalSSID());  }
 
void setup() {
  // put your setup code here, to run once:
   Serial.begin(115200);
   WiFiManager wifiManager;
   wifiManager.setAPCallback(configModeCallback);
   if (!wifiManager.autoConnect()){
      Serial.println("failed to connect and hit timeout"); 
      ESP.reset();
      delay(1000);
   }
    Serial.println("connected...yeey :)");  
}

void loop() {
  // put your main code here, to run repeatedly:

}
