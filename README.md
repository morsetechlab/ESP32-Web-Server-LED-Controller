[![PlatformIO](https://img.shields.io/badge/PlatformIO-ESP32--S3-orange?style=flat)](https://platformio.org/)
[![WebSocket](https://img.shields.io/badge/Protocol-WebSocket-lightgrey?style=flat)]()
[![OLED Display](https://img.shields.io/badge/Display-OLED--0.91in-informational?style=flat)]()
[![RGB LED](https://img.shields.io/badge/LED-RGB--WS2812-yellow?style=flat)]()
[![IoT Platform](https://img.shields.io/badge/IoT-SmartHome-blueviolet?style=flat)]()



# ESP32 Web LED Controller

โปรเจกต์นี้เป็นระบบควบคุมหลอดไฟ LED ด้วย ESP32-S3 ผ่าน Web User Interface (Web UI) โดยทำงานในรูปแบบ WebServer ที่ฝังอยู่ภายในตัว ESP32-S3 เอง ซึ่งไม่ต้องพึ่งพาเซิร์ฟเวอร์ภายนอก

ระบบนี้แสดงสถานะของหลอดไฟผ่านทาง จอ OLED 0.91 นิ้ว และสามารถสั่งเปิด/ปิดหรือเลือกสีของหลอดไฟได้แบบ เรียลไทม์ ด้วยเทคโนโลยี WebSocket เพื่อให้การควบคุมและอัปเดตสถานะมีความลื่นไหลและทันที (low latency)

---

## Features

- ควบคุมเปิด/ปิด LED ผ่านปุ่มในหน้าเว็บ
- ปรับเปลี่ยนสีหลอดไฟได้ทั้งแบบกำหนดเองและพรีเซ็ต
- แสดงสถานะ LED และการเชื่อมต่อผ่านจอ OLED ขนาด 0.91 นิ้ว ที่ Device
- เชื่อมต่อผ่าน Wi-Fi แบบ Access Point (SoftAP)
- รองรับ WebSocket สำหรับควบคุมแบบเรียลไทม์
- รองรับ Dark Mode และ UI แบบ Responsive สำหรับมือถือ

## Demo

<p align="center">
  <img src="selected-color.gif" alt="ESP32 Web LED Controller" width="100%" />
</p>

---

## Project Structure

```
esp32-web-led-controller/
├── src/
│   └── main.cpp
├── data/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── .gitignore
├── platformio.ini
└── README.md
```

---

## Usage

1. ติดตั้ง PlatformIO
2. ดาวน์โหลดโค้ด:
   - Download ZIP หรือใช้คำสั่ง  
     git clone https://github.com/morsetechlab/esp32-web-led-controller.git
3. เชื่อมต่อ ESP32-S3 เข้ากับคอมพิวเตอร์
4. อัปโหลดโค้ด:
   platformio run --target upload
   platformio run --target uploadfs
5. เปิด Wi-Fi:
   SSID: ESP32S3-LED
   Password: 12345678
6. เข้าหน้าเว็บ:
   http://192.168.4.1

---

## Equipment used

- ESP32-S3 DevKit (WROOM-1 N16R8)
- จอ OLED ขนาด 0.91 นิ้ว (128x32) แบบ I2C
- WS2812 RGB LED
- สาย Jumper / Breadboard

---

## Libraries Used

| Library | Description | License |
|--------|-------------|---------|
| [FastLED](https://github.com/FastLED/FastLED) | RGB LED control | MIT |
| [ESPAsyncWebServer](https://github.com/me-no-dev/ESPAsyncWebServer) | Async HTTP + WebSocket server | MIT |
| [Adafruit_SSD1306](https://github.com/adafruit/Adafruit_SSD1306) | OLED I2C Display Driver | BSD |


---

## Supported Boards

- ESP32-S3 DevKitC-1 WROOM-1 (N8/N16, PSRAM Optional)
- Any ESP32-S3 board with GPIO and I2C support

---

## Attribution

- [FastLED](https://github.com/FastLED/FastLED)
- [ESPAsyncWebServer](https://github.com/me-no-dev/ESPAsyncWebServer)
- [Adafruit_SSD1306](https://github.com/adafruit/Adafruit_SSD1306) 
- **Developed by** [MorseTech Lab](https://www.morsetechlab.com)

---

## 🛡️ License

โปรเจกต์นี้เผยแพร่ภายใต้เงื่อนไขของ **MIT License** คุณสามารถใช้งาน คัดลอก ปรับปรุง หรือแจกจ่ายซอฟต์แวร์นี้ได้ทั้งในเชิงพาณิชย์และไม่แสวงหากำไร ตามที่ระบุไว้ในไฟล์ [LICENSE](LICENSE)