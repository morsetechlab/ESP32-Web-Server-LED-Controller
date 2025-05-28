# [📘 เวอร์ชั่นภาษาไทยที่นี่](README.md)

[![PlatformIO](https://img.shields.io/badge/PlatformIO-ESP32--S3-orange?style=flat)](https://platformio.org/)
[![WebSocket](https://img.shields.io/badge/Protocol-WebSocket-lightgrey?style=flat)]()
[![OLED Display](https://img.shields.io/badge/Display-OLED--0.91in-informational?style=flat)]()
[![RGB LED](https://img.shields.io/badge/LED-RGB--WS2812-yellow?style=flat)]()
[![IoT Platform](https://img.shields.io/badge/IoT-SmartHome-blueviolet?style=flat)]()

# ESP32 Web LED Controller

This project is a real-time RGB LED control system built on ESP32-S3 using an integrated Web User Interface (Web UI). It runs as a self-contained WebServer on the ESP32-S3, without relying on external servers.

The system displays LED status on a 0.91-inch OLED display and allows real-time control of LED power and color using WebSocket for ultra-low-latency interactions.

---

## Features

- Toggle LED on/off via web interface
- Select LED color via presets or custom color picker
- OLED (0.91-inch) status display directly on the device
- Connect over Wi-Fi in SoftAP mode
- Real-time WebSocket communication
- Responsive design with Dark Mode support

## Demo

<p align="center">
  <img src="images/selected-color.gif" alt="ESP32 Web LED Controller" width="100%" />
</p>

[Full Video](https://youtu.be/n1ZsdyztKbw)

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

1. Install [PlatformIO](https://platformio.org/install) for VS Code.

2. Download source code from GitHub:
   - Click `Code > Download ZIP` and extract the files
   - Or use Git command:
     ```bash
     git clone https://github.com/morsetechlab/ESP32-Web-Server-LED-Controller
     ```

3. Open the project in PlatformIO and connect ESP32-S3 to your computer.

4. Upload the firmware and web files:
   ```bash
   platformio run --target upload     # Upload firmware
   platformio run --target uploadfs   # Upload Web UI to SPIFFS
   ```

5. Enable Wi-Fi Access Point on ESP32-S3:
   - SSID: `ESP32S3-LED`
   - Password: `12345678`

6. Connect your phone or computer to the Wi-Fi.

7. Open a browser and go to:
   ```
   http://192.168.4.1
   ```

   The Web UI should load, allowing LED control and OLED feedback.

---

## Equipment Used

- ESP32-S3 DevKit (WROOM-1 N16R8)
- 0.91" OLED Display (128x32, I2C)
- WS2812 RGB LED
- Jumper Wires / Breadboard

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

This project is licensed under the **MIT License**. You are free to use, copy, modify, and distribute this software for both commercial and non-commercial purposes, as stated in the [LICENSE](LICENSE) file.