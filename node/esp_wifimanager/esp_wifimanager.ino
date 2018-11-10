#include <ESP8266WiFi.h>
#include <DNSServer.h> 
#include <ESP8266WebServer.h> 
#include <WiFiManager.h>  

void setup() {
    Serial.begin(115200);
    WiFiManager wifiManager;
    //set-static-ip
    //IPAddress _ip = IPAddress(10, 0, 1, 78);
    //IPAddress _gw = IPAddress(10, 0, 1, 1);
    //IPAddress _sn = IPAddress(255, 255, 255, 0);
    //wifiManager.setSTAStaticIPConfig(_ip, _gw, _sn);
    wifiManager.autoConnect("ESP_AutoConnect","helloworld");
    Serial.println("connected...");
}

void loop() {
    // put your main code here, to run repeatedly:
    
}
