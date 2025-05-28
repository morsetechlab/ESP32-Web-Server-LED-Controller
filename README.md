# [📘 English version available here](README.en.md)

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
  <img src="images/selected-color.gif" alt="ESP32 Web LED Controller" width="100%" />
</p>

Watch here: [YouTube - ESP32 Web LED Controller Demo](https://youtu.be/n1ZsdyztKbw)

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

1. ติดตั้ง [PlatformIO](https://platformio.org/install) ใน VS Code

2. ดาวน์โหลดโค้ดจาก GitHub:
   - กดปุ่ม `Code > Download ZIP` แล้วแตกไฟล์
   - หรือใช้คำสั่ง Git:
     ```bash
     git clone https://github.com/morsetechlab/ESP32-Web-Server-LED-Controller
     ```

3. เปิดโปรเจกต์ด้วย PlatformIO และเชื่อมต่อบอร์ด ESP32-S3 กับคอมพิวเตอร์

4. อัปโหลดโค้ดและไฟล์เว็บไปยังบอร์ด:
   ```bash
   platformio run --target upload     # อัปโหลดเฟิร์มแวร์
   platformio run --target uploadfs   # อัปโหลดไฟล์ Web UI ไปยัง SPIFFS
   ```

5. เปิดใช้งาน Wi-Fi บน ESP32-S3:
   - SSID: `ESP32S3-LED`
   - Password: `12345678`

6. เชื่อมต่อ Wi-Fi จากอุปกรณ์ของคุณ (มือถือหรือคอม)

7. เปิดเว็บเบราว์เซอร์แล้วไปที่:
   ```
   http://192.168.4.1
   ```

   ระบบจะแสดง Web UI สำหรับควบคุม LED และแสดงสถานะบนจอ OLED

---

## Equipment used

- ESP32-S3 DevKit (WROOM-1 N16R8)
- จอ OLED ขนาด 0.91 นิ้ว (128x32) แบบ I2C
- WS2812 RGB LED
- สาย Jumper / Breadboard

---

## Libraries Used

| Library | Description |
|--------|-------------|
| [FastLED](https://github.com/FastLED/FastLED) | RGB LED control |
| [ESPAsyncWebServer](https://github.com/me-no-dev/ESPAsyncWebServer) | Async HTTP + WebSocket server |
| [Adafruit_SSD1306](https://github.com/adafruit/Adafruit_SSD1306) | OLED I2C Display Driver |

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