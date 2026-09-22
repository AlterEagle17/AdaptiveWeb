# AdaptiveWeb — "One Web App. Every Network. Every Device."

AdaptiveWeb is an intelligent, network- and device-adaptive web architecture designed for real-world resilience. It dynamically detects client hardware capabilities and live network conditions, applies a strict **Weakest-Link Decision Rule**, and adapts content density, image resolution, 3D animations, JavaScript execution, and prefetching in real time.

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [The Problem](#the-problem)
3. [The Solution: DETECT → DECIDE → ADAPT → MEASURE](#the-solution-detect--decide--adapt--measure)
4. [Adaptive Modes & Resource Strategy Matrix](#adaptive-modes--resource-strategy-matrix)
5. [Architecture & Technology Stack](#architecture--technology-stack)
6. [Project Structure](#project-structure)
7. [Frontend Setup & Quickstart](#frontend-setup--quickstart)
8. [Backend Setup (Spring Boot & Java 21)](#backend-setup-spring-boot--java-21)
9. [Database Configuration (H2 & MySQL)](#database-configuration-h2--mysql)
10. [REST API Documentation](#rest-api-documentation)
11. [Judge & Evaluation Demo Walkthrough](#judge--evaluation-demo-walkthrough)
12. [Testing with Chrome DevTools Throttling](#testing-with-chrome-devtools-throttling)
13. [Known Browser API Behaviors & Safe Fallbacks](#known-browser-api-behaviors--safe-fallbacks)

---

## Project Overview

Modern web applications are typically built for high-end laptops running on gigabit fiber. When accessed by users on budget devices or constrained mobile networks, these applications suffer from massive layout shifts, frozen main threads, battery drain, and failed requests.

**AdaptiveWeb** fundamentally changes this paradigm. Instead of delivering a one-size-fits-all bundle and relying solely on CSS media queries for visual responsiveness, AdaptiveWeb scales the entire computing and delivery footprint:

- **High-tier environments** receive a rich, interactive commerce store with 3D card tilt, 60fps ambient visual effects, uncompressed media, and asset prefetching.
- **Constrained environments** automatically drop down to an ultra-fast, lightweight footprint with compressed images (320px, q40), no expensive 3D/canvas loops, zero prefetch, and only essential JavaScript. The full product catalog remains available in every tier.

---

## The Problem

- **Responsive Design is NOT Adaptive Delivery**: CSS media queries adapt screen geometry, but mobile devices still download 2MB desktop hero images and execute heavy animation loops in the background.
- **Network Instability**: Cellular connections fluctuate between fast 5G and sluggish 2G/3G without warning.
- **Device Disparity**: A $90 budget smartphone has a fraction of the single-core CPU throughput and memory of a flagship computer, yet receives the same JavaScript execution cost.
- **Artificial Data Waste**: Browsers on metered or roaming connections frequently exhaust data caps downloading assets the user never requested.

---

## The Solution: DETECT → DECIDE → ADAPT → MEASURE

```
                       CLIENT BROWSER / DEVICE
                                 │
                                 ▼
                     ┌───────────────────────┐
                     │ 1. DETECT ENVIRONMENT │
                     │                       │
                     │ • Network Info API    │
                     │ • Hardware Concurrency│
                     │ • Device Memory       │
                     │ • WebGL GPU Query     │
                     │ • Real Bandwidth Test │
                     └───────────┬───────────┘
                                 │
                                 ▼
                     ┌───────────────────────┐
                     │   2. DECIDE (CENTRAL) │
                     │                       │
                     │   Weakest Link Rule:  │
                     │   min(Network, Device)│
                     └───────────┬───────────┘
                                 │
          ┌──────────────────────┼──────────────────────┐
          ▼                      ▼                      ▼
     [HIGH TIER]           [MEDIUM TIER]           [LOW TIER]
  Dual-High Only          Balanced Pairings      Any Low Input
          │                      │                      │
          ▼                      ▼                      ▼
┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐
│ 3. ADAPT         │   │ 3. ADAPT         │   │ 3. ADAPT         │
│ • Full Catalog   │   │ • Full Catalog   │   │ • Full Catalog   │
│ • 1000px, q85 Img│   │ • 600px, q65 Img │   │ • 320px, q40 Img │
│ • 3D Tilt & Glow │   │ • Subtle UI Hover│   │ • Static, No 3D  │
│ • Dynamic JS Impt│   │ • Standard JS    │   │ • Essential Only │
│ • Asset Prefetch │   │ • No Prefetch    │   │ • Zero Prefetch  │
└─────────┬────────┘   └─────────┬────────┘   └─────────┬────────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                                 ▼
                     ┌───────────────────────┐
                     │ 4. MEASURE TELEMETRY  │
                     │                       │
                     │ • Real LCP Observer   │
                     │ • CLS Cumulative Sum  │
                     │ • INP Responsiveness  │
                     │ • Page Load & DOM     │
                     │ • Transfer KB & Counts│
                     └───────────────────────┘
```

---

## Adaptive Modes & Resource Strategy Matrix

| Metric / Dimension | HIGH Tier (Full Experience) | MEDIUM Tier (Balanced) | LOW Tier (Lightweight) |
| :--- | :--- | :--- | :--- |
| **Trigger Rule** | Network = HIGH **AND** Device = HIGH | Moderate speed / concurrency pairings | **ANY** condition is LOW (`LOW` dominates) |
| **Catalog Count** | **Full catalog** | **Full catalog** | **Full catalog** |
| **Image Resolution** | **1000px**, Quality: 85% | **600px**, Quality: 65% | **320px**, Quality: 40% |
| **Image Delivery** | `loading="lazy"`, high-res WebP | `loading="lazy"`, medium WebP | `loading="lazy"`, compressed WebP |
| **Animations** | **Full (60fps)** ambient mesh & hero | **Reduced** transitions | **Disabled (0ms)**, flat static layout |
| **3D Interactions** | **Enabled** (Perspective 3D tilt) | **Disabled** | **Disabled** |
| **Dynamic JS** | **`rich-features.js` loaded via `import()`** | Module unhooked | **Zero dynamic JS loaded** |
| **Recommendations**| **ON** (3 curated flagship picks) | **LIMITED** (1 pick) | **OFF (Completely removed from DOM)** |
| **Asset Prefetch** | **ON** (`<link rel="prefetch">` active) | **OFF** | **OFF** |
| **Target Network** | 5G, Fiber, Broadband (>= 5 Mbps) | Standard 4G / Wi-Fi (1.5–5 Mbps) | 2G, Slow 3G, Constrained (< 1.5 Mbps) |
| **Target Device** | 8+ CPU cores, >= 8GB RAM | 4–7 CPU cores, >= 4GB RAM | < 4 CPU cores, budget low-memory silicon |

> **Important Resource Principle:** In LOW mode, AdaptiveWeb keeps every product available while reducing image dimensions and disabling expensive animation work. Images remain lazy-loaded, so off-screen products do not immediately consume the full network budget.

---

## Architecture & Technology Stack

### Frontend
- **Vanilla Modern JavaScript (ES2022+)**: Zero heavy framework dependencies, dynamic ES modules via `import()`.
- **CSS3 Design System**: CSS custom variables, glassmorphism, hardware-accelerated transforms, dark aesthetic with cyan/purple accents.
- **Web APIs**:
  - `navigator.connection` (Network Information API: downlink, rtt, effectiveType, saveData)
  - `navigator.hardwareConcurrency` & `navigator.deviceMemory`
  - WebGL `WEBGL_debug_renderer_info` (GPU accelerator inspection)
  - `PerformanceObserver` (LCP, CLS, INP Web Vitals)
  - Navigation Timing & Resource Timing APIs
  - Web Audio API (Synthesized auditory micro-interactions)

### Backend
- **Java 21 (LTS)**: High-performance modern Java runtime.
- **Spring Boot 3.3.x**: Modern enterprise REST architecture.
- **Spring Data JPA & Hibernate**: Object-relational mapping and entity persistence.
- **In-Memory H2 Database**: Instant plug-and-play local development and demonstration with zero setup friction.
- **MySQL Driver**: Production-ready configuration included.
- **Maven & Maven Wrapper**: Cross-platform reproducible builds.

---

## Project Structure

```
AdaptiveWeb/
│
├── frontend/
│   ├── index.html               # Semantic e-commerce storefront with Config & Cart modals
│   ├── style.css                # Polished design system covering HIGH, MEDIUM, and LOW tiers
│   ├── adaptive.js              # Central engine: DETECT, DECIDE, ADAPT, MEASURE Web Vitals
│   ├── script.js                # E-commerce store coordinator: search, cart drawer, catalog
│   │
│   └── assets/
│       ├── network-test.bin     # 64 KB test asset for real bandwidth measurement
│       ├── images/              # Local image cache & fallback directory
│       └── js/
│           └── rich-features.js # Dynamically imported module for HIGH tier 3D tilt & canvas
│
├── backend/
│   └── adaptiveweb/
│       ├── pom.xml              # Maven dependencies: Web, Data JPA, H2, MySQL, Validation
│       ├── mvnw / mvnw.cmd      # Maven Wrapper scripts
│       │
│       └── src/
│           ├── main/
│           │   ├── java/com/adaptiveweb/adaptiveweb/
│           │   │   ├── AdaptivewebApplication.java   # Spring Boot entry point
│           │   │   ├── controller/
│           │   │   │   ├── ProductController.java    # GET /api/products, /api/categories
│           │   │   │   ├── OrderController.java      # POST /api/orders, GET /api/orders
│           │   │   │   ├── AdaptiveRuleController.java # GET /api/adaptive-rules
│           │   │   │   └── PerformanceController.java# POST /api/performance
│           │   │   ├── service/                      # Business logic layer
│           │   │   ├── repository/                   # Spring Data JPA repositories
│           │   │   ├── entity/                       # Product, Category, Order, Rule, Metric
│           │   │   ├── dto/                          # OrderRequest, PerformanceMetricDTO
│           │   │   └── config/
│           │   │       ├── CorsConfig.java           # Cross-Origin Resource Sharing
│           │   │       └── DataInitializer.java     # Database seeder on startup
│           │   └── resources/
│           │       └── application.properties        # H2 & MySQL configuration profiles
│           └── test/
│
└── README.md                    # Complete technical and architectural documentation
```

---

## Frontend Setup & Quickstart

The frontend runs with any local static HTTP server (required for ES module `import()` and `fetch()` calls).

### Option 1: Python HTTP Server (Recommended)
From the root of the repository:
```powershell
cd C:\Users\sabar\.gemini\antigravity\scratch\AdaptiveWeb\frontend
python -m http.server 3000
```
Open **[http://localhost:3000](http://localhost:3000)** in Google Chrome, Edge, or Firefox.

### Option 2: Node.js `npx serve` or `http-server`
```powershell
cd frontend
npx serve -l 3000
```

### Option 3: VS Code Live Server
Right-click `frontend/index.html` and select **"Open with Live Server"**.

---

## Backend Setup (Spring Boot & Java 21)

### Prerequisites
- **Java 21 JDK** installed (`java -version`).
- **Apache Maven** or the provided Maven Wrapper.

### Running the Backend
From the `backend/adaptiveweb` directory:
```powershell
cd C:\Users\sabar\.gemini\antigravity\scratch\AdaptiveWeb\backend\adaptiveweb
mvn spring-boot:run
```
*(Or on Windows with Maven in PATH: `mvn clean spring-boot:run`)*

The backend will start at **`http://localhost:8080`**.
On startup, `DataInitializer` automatically seeds:
- 4 Categories (Smartphones, Laptops, Audio, Accessories)
- 10 Realistic tech products matching the catalog
- 9 Central adaptive rules

### Verifying Backend Health
```powershell
curl http://localhost:8080/api/products
```

---

## Database Configuration (H2 & MySQL)

### Development Default: In-Memory H2
Out-of-the-box, the backend uses an embedded H2 database. No external database server installation is needed for demonstration.
- **H2 Web Console**: Accessible at **[http://localhost:8080/h2-console](http://localhost:8080/h2-console)**
- **JDBC URL**: `jdbc:h2:mem:adaptivewebdb`
- **Username**: `sa`
- **Password**: *(leave blank)*

### Production Option: MySQL
To point to a MySQL database:
1. Open `backend/adaptiveweb/src/main/resources/application.properties`.
2. Comment out the H2 settings and uncomment the MySQL block:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/adaptiveweb?useSSL=false&serverTimezone=UTC
   spring.datasource.username=root
   spring.datasource.password=your_mysql_password
   spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
   spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
   ```
3. Create the database in MySQL: `CREATE DATABASE adaptiveweb;`
4. Restart the Spring Boot application. Hibernate will automatically generate all tables.

---

## REST API Documentation

### 1. Catalog & Products
- **`GET /api/products`**
  - Query parameters:
    - `category` (optional, e.g. `SMARTPHONES`, `LAPTOPS`, `AUDIO`, `ACCESSORIES`)
    - `limit` (optional, integer limit, e.g. `?limit=3` for LOW tier)
  - Returns: Array of `Product` JSON objects.
- **`GET /api/products/{id}`**
  - Returns: Single `Product` object or 404.
- **`GET /api/categories`**
  - Returns: Array of all product categories.

### 2. E-Commerce Orders
- **`POST /api/orders`**
  - Body:
    ```json
    {
      "customerName": "Demo Judge",
      "customerEmail": "judge@hackathon.io",
      "items": [
        { "productId": 1, "quantity": 1, "unitPrice": 69999 },
        { "productId": 3, "quantity": 2, "unitPrice": 18999 }
      ]
    }
    ```
  - Returns: 201 Created with order ID and confirmed total.

### 3. Adaptive Decision Matrix
- **`GET /api/adaptive-rules`**
  - Query parameters: `?network=HIGH&device=MEDIUM` (optional filter).
  - Returns: Rule configuration for client tiers.

### 4. Client Telemetry Ingestion
- **`POST /api/performance`**
  - Ingests real browser performance telemetry (LCP, CLS, INP, page load time, transfer bytes).

---

## Judge & Evaluation Demo Walkthrough

Judges can demonstrate all three tiers seamlessly on a single laptop:

### Step 1: Open AdaptiveShop
1. Open the application at `http://localhost:3000`.
2. Notice the live status bar at the top:
   `HIGH (Live) · HIGH (Live) → HIGH TIER (FULL EXPERIENCE)`
3. Open your browser console (`F12` → **Console**) to observe the structured runtime log.

### Step 2: High Tier Demonstration (Rich Commerce)
1. In the default **HIGH** mode:
   - Notice the animated mesh background and the glowing floating device in the hero section.
   - Scroll down to **Featured Products**: the full catalog is visible.
   - Hover over a product card: note the **interactive 3D perspective tilt** that follows your mouse cursor with specular highlights.
   - Note the **Recommended For You** section rendering 3 curated flagship devices.
   - Click **Add to Cart**: an auditory chime plays, the cart badge updates to `1`, and a toast appears.
   - Click **🛒 Cart** in the navbar: inspect the slide-out cart drawer, modify quantities, and test simulated checkout.
   - Type in the **Search** bar: search for `"laptop"` or `"titanium"` to see real-time catalog filtering.

### Step 3: Switch to Medium Tier (Balanced Experience)
1. Click the floating **⚙ Config** button in the top-right corner.
2. In the modal:
   - Change **Network Simulation** to `MEDIUM`.
   - Change **Device Simulation** to `MEDIUM`.
3. Notice the **Adaptive Decision** card instantly updates:
   - Final Mode: `MEDIUM (BALANCED)`
   - Delivery Strategy: Images `600px, q65`, Products `All catalog items`, Animations `REDUCED`, 3D Effects `OFF`.
4. Close the modal:
   - The hero background animation is subdued.
   - All catalog products remain rendered.
   - 3D card tilt is deactivated; standard hover elevation is used.
   - Recommendations are trimmed down to 1 item.

### Step 4: Switch to Low Tier (Ultra-Lightweight Speed First)
1. Click **⚙ Config**.
2. Change **Network Simulation** to `LOW` (or **Device** to `LOW`).
3. Observe the **Weakest Link Rule**:
   - Setting either Network or Device to `LOW` immediately demotes the final mode to `LOW`.
4. Close the modal:
   - Visual orbs and hero animations are completely disabled (`animation: none !important`).
   - All catalog products remain available using small 320px compressed images.
   - Zero heavy dynamic JavaScript loops are executing.
   - The **Recommendations** section is completely removed from the DOM.
   - Prefetching is disabled.

### Step 5: Test Weakest-Link Combinations
Open **⚙ Config** and verify each pairing in the test matrix:
- `Network: HIGH` + `Device: LOW` ➔ **Final: LOW**
- `Network: LOW` + `Device: HIGH` ➔ **Final: LOW**
- `Network: HIGH` + `Device: MEDIUM` ➔ **Final: MEDIUM**
- `Network: MEDIUM` + `Device: HIGH` ➔ **Final: MEDIUM**

### Step 6: Inspect Real Browser Telemetry
1. In the **⚙ Config** modal, scroll to **Real Browser Performance Telemetry**:
   - **LCP (Largest Contentful Paint)**: Real value captured via `PerformanceObserver`.
   - **CLS (Cumulative Layout Shift)**: Real layout shift measurement.
   - **INP (Input Responsiveness)**: Live input latency metric.
   - **Page Load Time**: From Navigation Timing API (`loadEventEnd - startTime`).
   - **DOMContentLoaded**: Exact duration until DOM ready.
   - **Transferred Resources**: Actual total HTTP items and transfer sizes (KB) segmented by image and script payloads.
2. Click **⚡ Run Speed Test**: Observe the real download of `network-test.bin` to compute actual measured Mbps throughput.

---

## Testing with Chrome DevTools Throttling

To observe real browser throttling without manual simulation:
1. Open Chrome DevTools (`F12` or `Ctrl+Shift+I`).
2. Go to the **Network** tab:
   - Set Throttling dropdown to **Slow 3G** or **Fast 3G**.
3. Go to the **Performance** tab:
   - Click the gear icon (⚙) in the top-right.
   - Set **CPU** to **4x slowdown** or **6x slowdown**.
4. In the **⚙ Config** panel, keep both Network and Device on **AUTO**.
5. Reload the page: the engine automatically detects the constrained downlink and CPU throughput, adapting dynamically to **LOW** or **MEDIUM** tier.

---

## Known Browser API Behaviors & Safe Fallbacks

| Browser / API | Supported Signals | Known Limitations | Safe Fallback Behavior |
| :--- | :--- | :--- | :--- |
| **Google Chrome / Edge** | `downlink`, `rtt`, `effectiveType`, `saveData`, `deviceMemory`, `hardwareConcurrency` | Downlink capped at 10 Mbps by Chrome for privacy | Bandwidth speed test measures actual throughput beyond 10 Mbps estimate |
| **Mozilla Firefox** | `hardwareConcurrency`, `navigator.onLine` | Network Information API (`navigator.connection`) is disabled by default | Displays `"Unavailable"` for estimate; relies on active bandwidth test + safe fallback |
| **Apple Safari (macOS / iOS)** | `hardwareConcurrency`, `navigator.onLine` | Does not expose `deviceMemory` or `connection` API | Detects cores and platform; defaults to balanced baseline without crashing |
| **Data Saver Mode** | `navigator.connection.saveData` | Supported when user toggles "Lite mode" or "Save Data" in mobile browser | Immediately triggers `LOW` tier to respect user's data-saving preference |

---

## Hackathon Credits

- **Project**: AdaptiveWeb
- **Tagline**: *"One Web App. Every Network. Every Device."*
- **Architecture**: DETECT → DECIDE → ADAPT → MEASURE
- **License**: MIT
