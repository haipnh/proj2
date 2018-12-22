#include <ESP8266WiFi.h>
#include <SocketIOClient.h>
#include <ArduinoJson.h>
//WIFI
#define ssid "E7250"
#define password "helloworld"

//socket.io
SocketIOClient client;
char host[] = "34.219.71.32";  // Địa chỉ IP dịch vụ, hãy thay đổi nó theo địa chỉ IP Socket server của bạn.
int port = 80;                // Cổng dịch vụ socket server do chúng ta tạo!

//từ khóa extern: dùng để #include các biến toàn cục ở một số thư viện khác. Trong thư viện SocketIOClient có hai biến toàn cục
// mà chúng ta cần quan tâm đó là
// RID: Tên hàm (tên sự kiện
// Rfull: Danh sách biến (được đóng gói lại là chuối JSON)
extern String RID;
extern String Rfull;

//Một số biến dùng cho việc tạo một task
unsigned long previousMillis = 0;
long interval = 2000;

String generateUID() {
  String UID = "{\"MacAddress\":\"" + WiFi.macAddress() + "\",\"LocalIP\":\"" + WiFi.localIP().toString() + "\"}";
  return UID;
}

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void setup_client() {
  if (!client.connect(host, port)) {
    Serial.println(F("Ket noi den socket server that bai!"));
    return;
  }
  //Khi đã kết nối thành công
  if (client.connected()) {
    //Thì gửi sự kiện ("connection") đến Socket server ahihi.
    // client.send("connection", "message", "Connected !!!!");
    client.sendJSON("connection", generateUID());
  }
}

void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  //connect WIFI
  setup_wifi();
  //Serial.print("Server IP : ");
  //while(!Serial.available());
  //String temp = Serial.readString();
  //temp.toCharArray(host,temp.length()-1);
  //Serial.println(host);
  setup_client();
  Serial.println("Setup done");
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  // put your main code here, to run repeatedly:
  //tạo một task cứ sau "interval" giây thì chạy lệnh:
  //if (millis() - previousMillis > interval) {
  //lệnh:
  //previousMillis = millis();
  //gửi sự kiện "atime" là một JSON chứa tham số message có nội dung là Time please?
  // client.send("atime", "message", "Time please?");
  // client.send("broadcast", "message", "Time please?");
  // client.send("chat", "message", "Hello world");
  //}
  //Khi bắt được bất kỳ sự kiện nào thì chúng ta có hai tham số:
  //  +RID: Tên sự kiện
  //  +RFull: Danh sách tham số được nén thành chuỗi JSON!
  if (client.monitor()) {
    Serial.println(RID);
    Serial.println(Rfull);
    StaticJsonBuffer<200> jsonBuffer;
    JsonObject& root = jsonBuffer.parseObject(Rfull);
    //if(RID=="cmd2node"){

    // uint8_t ledState = root["led"];
    //digitalWrite(LED_BUILTIN, ledState);
    //}
    //else if(RID=="chat"){
    //Serial.print("Server : ");
    //String temp = root["message"];
    //Serial.println(temp);
    //}
  }

  //Kết nối lại!
  if (!client.connected()) {
    client.reconnect(host, port);
  }
  // Chat App

  if (Serial.available()) {
    //String temp = Serial.readString();

    //client.send("chat", "message", temp);
    //Serial.println(temp);
    //Serial.flush();
    client.send("node", "message", "Hello world");
    delay(1000);
  }
}
