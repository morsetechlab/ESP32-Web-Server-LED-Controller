#include <Arduino.h>
#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include <SPIFFS.h>
#include <FastLED.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

// LED Configuration
#define DATA_PIN 48
#define NUM_LEDS 1

// OLED Configuration
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 32
#define OLED_RESET -1
#define SDA_PIN 13
#define SCL_PIN 14

// WiFi Configuration
const char *ssid = "ESP32S3-LED";
const char *password = "12345678";

// Objects
AsyncWebServer server(80);
AsyncWebSocket ws("/ws");
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

CRGB leds[NUM_LEDS];
bool ledState = false;
int connectedClients = 0;

// Function to draw light bulb icon
void drawLightBulb(bool isOn)
{
  display.drawCircle(20, 12, 8, SSD1306_WHITE);
  display.drawCircle(20, 12, 7, SSD1306_WHITE);
  display.fillRect(16, 20, 8, 4, SSD1306_WHITE);
  display.fillRect(17, 24, 6, 2, SSD1306_WHITE);
  display.drawLine(17, 10, 19, 14, SSD1306_WHITE);
  display.drawLine(21, 10, 23, 14, SSD1306_WHITE);
  display.drawLine(18, 8, 22, 12, SSD1306_WHITE);

  if (isOn)
  {
    display.drawLine(12, 6, 14, 8, SSD1306_WHITE);
    display.drawLine(20, 2, 20, 4, SSD1306_WHITE);
    display.drawLine(26, 8, 28, 6, SSD1306_WHITE);
    display.drawLine(28, 12, 30, 12, SSD1306_WHITE);
    display.drawLine(10, 12, 12, 12, SSD1306_WHITE);
  }
}

// Function to update OLED display
void updateDisplay()
{
  display.clearDisplay();

  // Draw Bulb Icon
  drawLightBulb(ledState);

  // OLED Display Text
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(42, 2);
  display.println("Bed Room");
  display.setCursor(42, 12);
  display.println(ledState ? "LED ON" : "LED OFF");
  display.setCursor(42, 22);
  if (connectedClients > 0)
  {
    display.println("Connected");
  }
  else
  {
    display.println("Disconnected");
  }

  display.display();
}

void updateLED()
{
  leds[0] = ledState ? CRGB::White : CRGB::Black;
  FastLED.show();
  updateDisplay(); // / update oled
  Serial.printf("LED is now: %s\n", ledState ? "ON" : "OFF");
}

void notifyClients()
{
  String state = ledState ? "on" : "off";
  ws.textAll(state);
  Serial.printf("Broadcast state to clients: %s\n", state.c_str());
}

CRGB parseColor(String hex)
{
  long number = strtol(hex.c_str() + 1, NULL, 16); // ข้าม '#' ด้วย +1
  int r = (number >> 16) & 0xFF;
  int g = (number >> 8) & 0xFF;
  int b = number & 0xFF;
  return CRGB(r, g, b);
}

void handleWebSocketMessage(void *arg, uint8_t *data, size_t len)
{
  AwsFrameInfo *info = (AwsFrameInfo *)arg;
  if (info->final && info->index == 0 && info->len == len && info->opcode == WS_TEXT)
  {
    String msg = (char *)data;
    Serial.printf("Received WebSocket message: %s\n", msg.c_str());

    if (msg == "toggle")
    {
      ledState = !ledState;
      updateLED(); // update led
      notifyClients();
    }
    if (msg.startsWith("color:"))
    {
      String hexColor = msg.substring(6); // split RGG (#RRGGBB)
      CRGB newColor = parseColor(hexColor);
      leds[0] = newColor;
      FastLED.show();
      Serial.printf("🎨 Set LED color: %s\n", hexColor.c_str());
    }
  }
}

void onEvent(AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type,
             void *arg, uint8_t *data, size_t len)
{
  if (type == WS_EVT_CONNECT)
  {
    Serial.printf("Client connected: #%u [%s]\n", client->id(), client->remoteIP().toString().c_str());
    client->text(ledState ? "on" : "off");
    connectedClients++;
    updateDisplay(); // update connection status
  }
  else if (type == WS_EVT_DISCONNECT)
  {
    Serial.printf("Client disconnected: #%u\n", client->id());
    connectedClients--;
    updateDisplay(); // update connection status
  }
  else if (type == WS_EVT_DATA)
  {
    handleWebSocketMessage(arg, data, len);
  }
}

void setup()
{
  Serial.begin(115200);

  // Initialize OLED
  Wire.begin(SDA_PIN, SCL_PIN);
  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C))
  {
    Serial.println(F("SSD1306 allocation failed"));
    for (;;)
      ;
  }

  // Set FastLED
  FastLED.addLeds<WS2812, DATA_PIN, GRB>(leds, NUM_LEDS);
  FastLED.setBrightness(50);
  updateLED(); // update led

  // Initialize WiFi
  WiFi.softAP(ssid, password);
  Serial.printf("Access Point: %s\n", ssid);
  Serial.printf("IP Address: %s\n", WiFi.softAPIP().toString().c_str());

  if (!SPIFFS.begin(true))
  {
    Serial.println("SPIFFS Mount Failed");
    return;
  }

  ws.onEvent(onEvent);
  server.addHandler(&ws);

  server.serveStatic("/", SPIFFS, "/").setDefaultFile("index.html");

  server.begin();
  Serial.println("WebServer started");

  // initial OLED
  updateDisplay();
}

void loop()
{
  // noting..
}