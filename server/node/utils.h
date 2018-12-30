#ifndef __utils_h
#define __utils_h

#include <Arduino.h>

typedef struct{
   uint8_t Pin, State, AutoMode, AutoBy, IfGreaterThan, Threshold;
}Thing_t;

typedef struct{
   uint8_t Temp, Humi;
}SensorData_t;

extern Thing_t Things[4];
extern SensorData_t SensorData;

String generateUID(String macAdd);
String makeJsonData(uint8_t temp, uint8_t humi);
uint16_t analogValueOfPwmDuty(uint8_t duty);
uint8_t mapPin(uint8_t pin);
void mapPins();

void controlThing(uint8_t thing);
void controlThing(uint8_t thing, uint8_t value);
#endif
