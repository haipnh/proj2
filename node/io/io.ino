#include <ESP8266WiFi.h>


// Variables for multitasking

#define LED D1

unsigned long previousMillisLed = 0;
long intervalLed = 500;
void TaskLED(unsigned long currentMillis);

unsigned long previousMillisData = 0;
long intervalData = 1000;
void TaskData(unsigned long currentMillis);

uint16_t analogValueOfPwmDuty(uint8_t duty){
  if(duty > 0 || duty <= 100){
    return (uint16_t)(duty*10.23);
  }
  return 0;
}

//uint8_t pwmWrite(uint8_t pin, uint8_t duty)
//{
//  if(duty > 0 || duty <= 100){
//     return 
//  }
//  return 0;
//}
void setup() {
  Serial.begin(115200);
  pinMode(D0, OUTPUT);  digitalWrite(D1, LOW);
  pinMode(D1, OUTPUT);  digitalWrite(D1, LOW);
  pinMode(D2, OUTPUT);  digitalWrite(D2, LOW);
  pinMode(D3, OUTPUT);  digitalWrite(D3, LOW);
  pinMode(D4, OUTPUT);  digitalWrite(D4, LOW);
  pinMode(-1, OUTPUT);  digitalWrite(-1, LOW);
  Serial.println("...");
  Serial.println("Thing1");
  Serial.println(LED_BUILTIN);
  Serial.println(D1);
  for(int i=0;i<101; i++){
    Serial.println(pwmVal(i));
  }
  // Connect WIFI
}

uint8_t ledState=0;

void loop() {
  unsigned long currentMillis = millis();
  for(int i = 0; i<1024; i++){
     analogWrite(D4, i);
     delay(2);
  }
  for(int i = 1023; i>=0; i--){
     analogWrite(D4, i);
     delay(2);
  }
  //TaskLED(currentMillis);
  //TaskData(currentMillis);  
}
uint8_t ledIndex=1;
void TaskLED(unsigned long currentMillis){
  if(currentMillis - previousMillisLed > intervalLed) {
    previousMillisLed = currentMillis; 
    digitalWrite(PinMapping(ledIndex), ledState);      
    ledIndex++;
    if(ledIndex==5) {
      ledState=!ledState;
      ledIndex=1;
    }
  }
}

void TaskData(unsigned long currentMillis){
  if(currentMillis - previousMillisData > intervalData) {     
    previousMillisData = currentMillis;       
  }
}

uint8_t PinMapping(uint8_t pin){
   switch(pin){
      case 1: return D0;
      case 2: return D1;
      case 3: return D2;
      case 4: return D3; 
   }
   return 100;
}
