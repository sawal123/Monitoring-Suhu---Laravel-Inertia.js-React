
#include <SPI.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClientSecure.h>
#include <Wire.h>

#include <DHT.h>

int dustPin = A0; // dust sensor - Wemos A0 pin
int ledPin = 5;  //PinD1

float voltsMeasured = 0;
float calcVoltage = 0;
float dustDensity = 0;

const char* host = "192.168.7.137";
const char* ssid = "rfid";
const char* pass = "12345566";
WiFiClient client;
//#define DHTPIN 0
int DHTPIN = 2; //Pin D4
int humidity;
int suhu;

int ledPower = 4; //D2
int speaker = 14; //D5

// Uncomment whatever type you're using!
#define DHTTYPE DHT11     // DHT 11
//#define DHTTYPE DHT22   // DHT 22, AM2302, AM2321
//#define DHTTYPE DHT21   // DHT 21, AM2301

DHT dht(DHTPIN, DHTTYPE);



unsigned long previousMillis = 0;  // variabel untuk menyimpan waktu terakhir program pertama dieksekusi
const long interval = 3000;        // interval waktu (dalam milidetik) untuk menunda program pertama


void setup()
{
  Serial.begin(9600);
  dht.begin();

  pinMode(ledPower, OUTPUT);
  pinMode(speaker, OUTPUT);
  WiFi.begin(ssid, pass);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Connecting to WiFi...");
    digitalWrite(ledPower, HIGH);
    digitalWrite(speaker, HIGH);
    delay(500);
    digitalWrite(ledPower, LOW);
    digitalWrite(speaker, LOW);
    delay(500);
  }

  Serial.println("Connected to WiFi");

  //  digitalWrite(ledPower, HIGH);
  //  delay(2000);
  Serial.print("Start Sensor Debu");
  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, HIGH);
  digitalWrite(speaker, HIGH);
  delay(1000);
  digitalWrite(speaker, LOW);

}


void loop()
{

  unsigned long currentMillis = millis();

  digitalWrite(ledPower, HIGH);
  humidity = dht.readHumidity();
  suhu = dht.readTemperature(); // or dht.readTemperature(true) for Fahrenheit

  if (isnan(humidity) || isnan(suhu)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }

  digitalWrite(ledPin, LOW); // power on the LED
  delayMicroseconds(280);
  digitalWrite(ledPower, HIGH);

  voltsMeasured = analogRead(dustPin); // read the dust value

  delayMicroseconds(40);
  digitalWrite(ledPin, HIGH); // turn the LED off
  delayMicroseconds(9680);

  //measure your 5v and change below
  calcVoltage = voltsMeasured * (5.0 / 1024.0);
  dustDensity = 0.166 * calcVoltage;
  int debu = dustDensity * 100;

  if (suhu < 25) {
    Serial.println("Suhu Terlalu Dingin");
    digitalWrite(speaker, HIGH);
    delay(500);
    digitalWrite(speaker, LOW);
  }
  else if (suhu > 25) {
    Serial.println("Suhu Terlalu Panas");
    digitalWrite(speaker, HIGH);
    delay(500);
    digitalWrite(speaker, LOW);
  }
  else {
    Serial.println("Suhu Normal");
  }

  if (debu < 20) {
    Serial.println("Rungan Bersih");

  }
  else if (debu > 50) {
    Serial.println("Ruangan Tidak Layak");
    digitalWrite(speaker, HIGH);
    delay(100);
    digitalWrite(speaker, LOW);
    delay(100);
    digitalWrite(speaker, HIGH);
    delay(100);
    digitalWrite(speaker, LOW);
  }
  else {
    Serial.println("Bersihakan Ruangan");
    digitalWrite(speaker, HIGH);
    delay(50);
    digitalWrite(speaker, LOW);
  }

  Serial.print("Suhu: ");
  Serial.println(suhu);
  Serial.print("humadity: ");
  Serial.println(humidity);

  Serial.print("Debu: ");
  Serial.println(debu);
  Serial.println("");





  if (currentMillis - previousMillis >= interval) {
      koneksi_database();
    String Link;
    HTTPClient http;
    Link = "http://" + String(host) + ":8000" + "/addData/" + String(suhu) + "/" + String(humidity) + "/" + String(debu);
    //  Serial.println("Link: " + Link);
    http.begin(client, Link);
    int httpCode = http.GET();

    if (httpCode > 0) {
      String responWeb = http.getString();
      //    Serial.println("Respon Web: " + responWeb);
    } else {
      Serial.println("Gagal mendapatkan respon. Kode HTTP: " + String(httpCode));
    }
    delay(1000);
    http.end();
    previousMillis = currentMillis;
  }


}

void koneksi_database()
{
  if (!client.connect(host, 8000)) {
    Serial.println("Gagal Konek");
    return;
  }
  else {
    Serial.println("Berhasil Konek");
    digitalWrite(ledPower, HIGH);
    return;
  }
}