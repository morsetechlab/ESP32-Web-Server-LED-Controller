/**
 * LED Controller - Blue Purple Theme with Dark Mode
 * Modern ES6+ Implementation with Improved Orientation Lock
 */

class LEDController {
  constructor() {
    // State Management
    this.state = {
      isConnected: false,
      isOn: false,
      currentColor: "#FFFFFF",
      isDarkMode: false,
      reconnectAttempts: 0,
      maxReconnectAttempts: 5,
    };

    // WebSocket
    this.websocket = null;
    this.reconnectTimer = null;

    // DOM Elements
    this.elements = {};

    // Initialize
    this.init();
  }

  /**
   * Initialize the application
   */
  init() {
    this.cacheElements();
    this.initTheme();
    this.bindEvents();
    this.initWebSocket();
    this.updateUI();

    console.log("LED Controller initialized");
  }

  /**
   * Cache DOM elements for performance
   */
  cacheElements() {
    this.elements = {
      logo: document.getElementById("logo"),
      themeToggle: document.getElementById("themeToggle"),
      themeIcon: document.getElementById("themeIcon"),
      connectionStatus: document.getElementById("connectionStatus"),
      statusCard: document.getElementById("statusCard"),
      statusIcon: document.getElementById("statusIcon"),
      statusLabel: document.getElementById("statusLabel"),
      statusDescription: document.getElementById("statusDescription"),
      powerButton: document.getElementById("powerButton"),
      powerIcon: document.getElementById("powerIcon"),
      colorSection: document.getElementById("colorSection"),
      colorOptions: document.querySelectorAll(".color-option"),
      customColorPicker: document.getElementById("customColorPicker"),
      customColorPreview: document.getElementById("customColorPreview"),
    };
  }

  /**
   * Initialize theme system
   */
  initTheme() {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      this.state.isDarkMode = savedTheme === "dark";
    } else {
      // Use system preference
      this.state.isDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
    }

    this.applyTheme();

    // Listen for system theme changes
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        if (!localStorage.getItem("theme")) {
          this.state.isDarkMode = e.matches;
          this.applyTheme();
        }
      });
  }

  /**
   * Apply theme to document
   */
  applyTheme() {
    document.documentElement.setAttribute(
      "data-theme",
      this.state.isDarkMode ? "dark" : "light"
    );
    this.updateThemeIcon();
    // Save preference
    localStorage.setItem("theme", this.state.isDarkMode ? "dark" : "light");
  }

  /**
   * Update theme toggle icon
   */
  updateThemeIcon() {
    const sunIcon = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="4"/>
                <path d="M12 2v2"/>
                <path d="M12 20v2"/>
                <path d="m4.93 4.93 1.41 1.41"/>
                <path d="m17.66 17.66 1.41 1.41"/>
                <path d="M2 12h2"/>
                <path d="M20 12h2"/>
                <path d="m6.34 17.66-1.41 1.41"/>
                <path d="m19.07 4.93-1.41 1.41"/>
            </svg>
        `;

    const moonIcon = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 3a6.364 6.364 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
            </svg>
        `;

    this.elements.themeIcon.innerHTML = this.state.isDarkMode
      ? sunIcon
      : moonIcon;
  }

  /**
   * Toggle theme
   */
  toggleTheme() {
    this.state.isDarkMode = !this.state.isDarkMode;
    this.applyTheme();
    this.triggerHapticFeedback("light");
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Theme toggle
    this.elements.themeToggle.addEventListener("click", () => {
      this.toggleTheme();
    });

    // Power button
    this.elements.powerButton.addEventListener("click", () => {
      this.togglePower();
    });

    // Color options
    this.elements.colorOptions.forEach((option) => {
      option.addEventListener("click", (e) => {
        const color = e.currentTarget.dataset.color;
        this.selectColor(color);
      });
    });

    // Custom color picker
    this.elements.customColorPicker.addEventListener("input", (e) => {
      this.selectColor(e.target.value);
    });

    // Visibility change (tab switching)
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && !this.state.isConnected) {
        this.initWebSocket();
      }
    });
  }

  /**
   * Initialize WebSocket connection
   */
  initWebSocket() {
    try {
      const gateway = `ws://${window.location.hostname}/ws`;
      this.websocket = new WebSocket(gateway);

      this.websocket.onopen = () => this.handleWebSocketOpen();
      this.websocket.onclose = () => this.handleWebSocketClose();
      this.websocket.onerror = (error) => this.handleWebSocketError(error);
      this.websocket.onmessage = (event) => this.handleWebSocketMessage(event);
    } catch (error) {
      console.error("WebSocket initialization failed:", error);
      this.updateConnectionStatus(false);
    }
  }

  /**
   * Handle WebSocket open event
   */
  handleWebSocketOpen() {
    console.log("WebSocket connected");
    this.updateConnectionStatus(true);
    this.state.reconnectAttempts = 0;

    // Clear any existing reconnect timer
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  /**
   * Handle WebSocket close event
   */
  handleWebSocketClose() {
    console.log("WebSocket disconnected");
    this.updateConnectionStatus(false);
    this.attemptReconnect();
  }

  /**
   * Handle WebSocket error event
   */
  handleWebSocketError(error) {
    console.error("WebSocket error:", error);
    this.updateConnectionStatus(false);
  }

  /**
   * Handle incoming WebSocket messages
   */
  handleWebSocketMessage(event) {
    try {
      const data = event.data.trim();

      if (data === "on" || data === "off") {
        this.updatePowerState(data === "on");
      } else if (data.startsWith("color:")) {
        const color = data.substring(6);
        this.updateColorState(color);
      } else {
        console.log("Unknown message:", data);
      }
    } catch (error) {
      console.error("Error processing message:", error);
    }
  }

  /**
   * Attempt to reconnect WebSocket
   */
  attemptReconnect() {
    if (this.state.reconnectAttempts >= this.state.maxReconnectAttempts) {
      console.error("Max reconnection attempts reached");
      return;
    }

    this.state.reconnectAttempts++;
    const delay = Math.min(
      1000 * Math.pow(2, this.state.reconnectAttempts),
      10000
    );

    console.log(
      `Reconnecting in ${delay}ms (attempt ${this.state.reconnectAttempts})`
    );

    this.reconnectTimer = setTimeout(() => {
      this.initWebSocket();
    }, delay);
  }

  /**
   * Send message via WebSocket
   */
  sendMessage(message) {
    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      this.websocket.send(message);
      return true;
    } else {
      console.warn("WebSocket not connected");
      return false;
    }
  }

  /**
   * Toggle LED power state
   */
  togglePower() {
    if (this.sendMessage("toggle")) {
      // Optimistic update
      this.updatePowerState(!this.state.isOn);

      // Add haptic feedback if available
      this.triggerHapticFeedback();
    }
  }

  /**
   * Select color
   */
  selectColor(color) {
    if (!this.state.isOn) return;

    this.state.currentColor = color;
    this.updateColorSelection(color);

    if (this.sendMessage(`color:${color}`)) {
      // Add subtle haptic feedback
      this.triggerHapticFeedback("light");
    }
  }

  /**
   * Update connection status UI
   */
  updateConnectionStatus(isConnected) {
    this.state.isConnected = isConnected;

    const indicator = this.elements.connectionStatus;
    indicator.className = `connection-indicator ${
      isConnected ? "connected" : "disconnected"
    }`;

    // Update aria-label for accessibility
    indicator.setAttribute(
      "aria-label",
      isConnected ? "เชื่อมต่อแล้ว" : "ไม่ได้เชื่อมต่อ"
    );
  }

  /**
   * Update power state UI
   */
  updatePowerState(isOn) {
    this.state.isOn = isOn;

    // Update status card
    const statusCard = this.elements.statusCard;
    statusCard.className = `status-card ${isOn ? "active" : ""}`;

    // Update status text
    this.elements.statusLabel.textContent = "Bed Room";
    this.elements.statusDescription.textContent = isOn ? "เปิดอยู่" : "ปิดอยู่";

    // Update power button
    const powerButton = this.elements.powerButton;
    powerButton.className = `power-button ${isOn ? "active" : ""}`;
    powerButton.setAttribute("aria-label", isOn ? "ปิด LED" : "เปิด LED");

    // Update power icon
    this.updatePowerIcon(isOn);

    // Update color section visibility
    const colorSection = this.elements.colorSection;
    colorSection.className = `color-section ${isOn ? "active" : ""}`;
    colorSection.setAttribute("aria-hidden", !isOn);
  }

  /**
   * Update power icon based on state
   */
  updatePowerIcon(isOn) {
    const powerOnIcon = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="16"/>
            </svg>
        `;

    const powerOffIcon = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18.36 6.64a9 9 0 1 1-12.73 0"/>
                <line x1="12" y1="2" x2="12" y2="12"/>
            </svg>
        `;

    this.elements.powerIcon.innerHTML = isOn ? powerOnIcon : powerOffIcon;
  }

  /**
   * Update color state
   */
  updateColorState(color) {
    this.state.currentColor = color;
    this.updateColorSelection(color);
  }

  /**
   * Update color selection UI
   */
  updateColorSelection(color) {
    // Update custom color picker
    this.elements.customColorPicker.value = color;
    this.elements.customColorPreview.style.background = color;

    // Update color options selection
    this.elements.colorOptions.forEach((option) => {
      const isSelected = option.dataset.color === color;
      option.className = `color-option ${isSelected ? "selected" : ""}`;
      option.setAttribute("aria-pressed", isSelected);
    });
  }

  /**
   * Trigger haptic feedback if available
   */
  triggerHapticFeedback(type = "medium") {
    if ("vibrate" in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30],
      };
      navigator.vibrate(patterns[type] || patterns.medium);
    }
  }

  /**
   * Update all UI elements
   */
  updateUI() {
    this.updateConnectionStatus(this.state.isConnected);
    this.updatePowerState(this.state.isOn);
    this.updateColorSelection(this.state.currentColor);
    this.updateThemeIcon();
  }

  /**
   * Cleanup resources
   */
  destroy() {
    // Close WebSocket
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }

    // Clear timers
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    console.log("LED Controller destroyed");
  }
}

/**
 * Utility functions
 */
const Utils = {
  /**
   * Convert hex color to RGB
   */
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  },

  /**
   * Get color brightness (0-255)
   */
  getColorBrightness(hex) {
    const rgb = this.hexToRgb(hex);
    if (!rgb) return 0;

    // Calculate relative luminance
    return Math.round((rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000);
  },

  /**
   * Determine if color is light or dark
   */
  isLightColor(hex) {
    return this.getColorBrightness(hex) > 127;
  },

  /**
   * Debounce function calls
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Throttle function calls
   */
  throttle(func, limit) {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },
};

/**
 * Application initialization with Improved Orientation Lock
 */
class App {
  constructor() {
    this.ledController = null;
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.start());
    } else {
      this.start();
    }
  }

  start() {
    try {
      // Handle orientation lock with improved error handling
      this.handleOrientationLock();

      // Initialize LED Controller
      this.ledController = new LEDController();

      // Register service worker if available
      this.registerServiceWorker();

      // Setup performance monitoring
      this.setupPerformanceMonitoring();

      console.log("App started successfully");
    } catch (error) {
      console.error("App initialization failed:", error);
      this.showErrorMessage("เกิดข้อผิดพลาดในการเริ่มต้นแอป");
    }
  }

  /**
   * Improved Screen Orientation Lock with Better Error Handling
   */
  async handleOrientationLock() {
    // Skip orientation lock for desktop browsers
    if (!this.isMobileDevice()) {
      console.log("Desktop detected - skipping orientation lock");
      return;
    }

    try {
      // Check if Screen Orientation API is supported
      if (!screen.orientation || !screen.orientation.lock) {
        console.log("Screen Orientation API not supported");
        this.fallbackOrientationHandling();
        return;
      }

      // Try to lock orientation
      await screen.orientation.lock("portrait");
      console.log("Screen orientation locked to portrait");
    } catch (error) {
      console.log("Screen orientation lock failed:", error.message);

      // Handle specific error types
      if (error.name === "NotSupportedError") {
        console.log("Orientation lock not supported on this device/browser");
      } else if (error.name === "SecurityError") {
        console.log("Orientation lock requires fullscreen or secure context");
      } else if (error.name === "InvalidStateError") {
        console.log("Document not in valid state for orientation lock");
      }

      // Try fallback methods
      this.fallbackOrientationHandling();
    }
  }

  /**
   * Check if device is mobile
   */
  isMobileDevice() {
    return (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || window.innerWidth <= 768
    );
  }

  /**
   * Fallback orientation handling methods
   */
  fallbackOrientationHandling() {
    console.log("Using fallback orientation methods");

    // Try older deprecated methods (for compatibility)
    this.tryDeprecatedOrientationLock();

    // Add CSS-based orientation handling
    this.addOrientationCSS();

    // Add orientation change listener
    this.addOrientationChangeListener();
  }

  /**
   * Try deprecated orientation lock methods
   */
  tryDeprecatedOrientationLock() {
    try {
      // Try deprecated screen.lockOrientation
      if (screen.lockOrientation) {
        screen.lockOrientation("portrait");
        console.log("Used deprecated screen.lockOrientation");
        return;
      }

      // Try webkit version
      if (screen.webkitLockOrientation) {
        screen.webkitLockOrientation("portrait");
        console.log("Used webkit screen orientation lock");
        return;
      }

      // Try moz version
      if (screen.mozLockOrientation) {
        screen.mozLockOrientation("portrait");
        console.log("Used moz screen orientation lock");
        return;
      }

      // Try ms version
      if (screen.msLockOrientation) {
        screen.msLockOrientation("portrait");
        console.log("Used ms screen orientation lock");
        return;
      }

      console.log("No orientation lock methods available");
    } catch (error) {
      console.log(
        "Deprecated orientation lock methods also failed:",
        error.message
      );
    }
  }

  /**
   * Add CSS-based orientation handling
   */
  addOrientationCSS() {
    // This CSS is already in your stylesheet, but we can ensure it's applied
    const style = document.createElement("style");
    style.textContent = `
      /* Enhanced landscape warning for mobile */
      @media (max-width: 768px) and (orientation: landscape) {
        .container::before {
          content: "โปรดหมุนหน้าจอเป็นแนวตั้ง\\A\\A🔄";
          white-space: pre;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--background-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: var(--font-weight-semibold);
          color: var(--text-primary);
          z-index: 9999;
          text-align: center;
        }
        
        .container > *:not(::before) {
          visibility: hidden;
        }
      }
    `;
    document.head.appendChild(style);
    console.log("Added CSS-based orientation handling");
  }

  /**
   * Add orientation change listener
   */
  addOrientationChangeListener() {
    const handleOrientationChange = () => {
      const orientation = screen.orientation?.angle || window.orientation;
      console.log("Orientation changed:", orientation);

      // Try to re-lock if possible
      if (this.isMobileDevice() && Math.abs(orientation) !== 0) {
        setTimeout(() => {
          this.handleOrientationLock();
        }, 500); // Delay to ensure orientation change is complete
      }
    };

    // Listen for orientation changes
    if (screen.orientation) {
      screen.orientation.addEventListener("change", handleOrientationChange);
    } else {
      // Fallback for older browsers
      window.addEventListener("orientationchange", handleOrientationChange);
      window.addEventListener("resize", handleOrientationChange);
    }
  }

  /**
   * Register service worker for offline support
   */
  async registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js");
        console.log("Service Worker registered:", registration);
      } catch (error) {
        console.log("Service Worker registration failed:", error);
      }
    }
  }

  /**
   * Setup basic performance monitoring
   */
  setupPerformanceMonitoring() {
    // Monitor page load performance
    window.addEventListener("load", () => {
      if ("performance" in window) {
        const loadTime = performance.now();
        console.log(`Page loaded in ${Math.round(loadTime)}ms`);
      }
    });
  }

  /**
   * Show error message to user
   */
  showErrorMessage(message) {
    // Create a simple error notification
    const errorDiv = document.createElement("div");
    errorDiv.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #FF3B30;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 14px;
      z-index: 9999;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    errorDiv.textContent = message;

    document.body.appendChild(errorDiv);

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.parentNode.removeChild(errorDiv);
      }
    }, 5000);
  }

  /**
   * Cleanup app resources
   */
  destroy() {
    if (this.ledController) {
      this.ledController.destroy();
      this.ledController = null;
    }
  }
}

// Start the application
const app = new App();

// Cleanup on page unload
window.addEventListener("beforeunload", () => {
  app.destroy();
});
