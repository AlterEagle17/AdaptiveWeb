// ============================================================================
// AdaptiveWeb — Core Adaptive Engine (DETECT → DECIDE → ADAPT → MEASURE)
// ============================================================================
// File: adaptive.js
// Responsibilities:
// 1. DETECT: Browser network telemetry & device hardware capabilities
// 2. DECIDE: Central Weakest-Link decision algorithm
// 3. ADAPT:  Apply visual tiers, image strategies, JS loading, & prefetch
// 4. MEASURE: Real browser Web Vitals & Resource Timing (LCP, INP, CLS, Load)
// ============================================================================

(function (window) {
    "use strict";

    // Engine State
    const state = {
        measuredBandwidth: null,
        isMeasuringSpeed: false,
        lastLoggedKey: null,
        dynamicRichModule: null,
        activeConfig: null,
        telemetry: {
            lcp: null,
            cls: 0,
            inp: null,
            pageLoad: null,
            domContentLoaded: null,
            resourceCount: 0,
            totalTransferBytes: 0,
            imgCount: 0,
            imgTransferBytes: 0,
            jsCount: 0,
            jsTransferBytes: 0
        }
    };

    // ------------------------------------------------------------------------
    // 1. DETECT — NETWORK DETECTION
    // ------------------------------------------------------------------------

    function getConnection() {
        return (
            navigator.connection ||
            navigator.mozConnection ||
            navigator.webkitConnection ||
            null
        );
    }

    /**
     * Interrogates Network Information API and client connectivity.
     * Accurately distinguishes Browser Estimates from Real Bandwidth Measurements.
     */
    function detectNetwork() {
        const conn = getConnection();
        const onLine = typeof navigator.onLine === "boolean" ? navigator.onLine : true;

        let browserEstimate = null;
        let rtt = null;
        let effectiveType = "Unavailable";
        let saveData = false;

        if (conn) {
            browserEstimate = typeof conn.downlink === "number" ? conn.downlink : null;
            rtt = typeof conn.rtt === "number" ? conn.rtt : null;
            effectiveType = conn.effectiveType || "4g";
            saveData = Boolean(conn.saveData);
        }

        // Active speed: prioritize measured test if executed, else browser downlink estimate
        const activeSpeed = state.measuredBandwidth ?? browserEstimate;

        // Classification Logic (Reasonable scientific thresholds):
        // LOW:
        // - Client is offline
        // - User enabled saveData
        // - Effective type is 2g or slow-2g
        // - Known bandwidth < 1.5 Mbps
        // - Known high round-trip latency >= 400ms
        // HIGH:
        // - Effective type is 4g/fast
        // - Bandwidth >= 5.0 Mbps
        // - Latency RTT < 150ms (or unavailable)
        // - saveData is false
        // MEDIUM:
        // - Standard balanced conditions between 1.5 and 5.0 Mbps
        let level = "MEDIUM";

        if (!onLine || saveData || effectiveType === "slow-2g" || effectiveType === "2g" || (activeSpeed !== null && activeSpeed < 1.5) || (rtt !== null && rtt >= 400)) {
            level = "LOW";
        } else if (activeSpeed !== null && activeSpeed >= 5.0 && (rtt === null || rtt < 150)) {
            level = "HIGH";
        } else {
            level = "MEDIUM";
        }

        return {
            level,
            onLine,
            browserEstimate,
            measuredBandwidth: state.measuredBandwidth,
            rtt,
            effectiveType,
            saveData
        };
    }

    /**
     * Real non-blocking Bandwidth Measurement
     * Downloads assets/network-test.bin (64 KB) with cache-busting to compute actual throughput.
     */
    async function measureBandwidth(onProgress) {
        if (state.isMeasuringSpeed) return state.measuredBandwidth;
        state.isMeasuringSpeed = true;

        if (typeof onProgress === "function") {
            onProgress({ status: "measuring" });
        }

        const testUrl = "assets/network-test.bin?t=" + Date.now();
        const start = performance.now();

        try {
            const res = await fetch(testUrl, { cache: "no-store" });
            if (!res.ok) throw new Error("HTTP " + res.status);

            const buffer = await res.arrayBuffer();
            const durationSec = (performance.now() - start) / 1000;

            if (durationSec > 0 && buffer.byteLength > 0) {
                const mbps = (buffer.byteLength * 8) / durationSec / 1_000_000;
                state.measuredBandwidth = Number(mbps.toFixed(2));
            }
        } catch (err) {
            console.warn("[AdaptiveWeb] Local speed test fallback to browser estimate:", err.message);
            const net = detectNetwork();
            if (net.browserEstimate !== null) {
                state.measuredBandwidth = Number(net.browserEstimate.toFixed(2));
            }
        } finally {
            state.isMeasuringSpeed = false;
        }

        if (typeof onProgress === "function") {
            onProgress({ status: "done", speed: state.measuredBandwidth });
        }

        return state.measuredBandwidth;
    }

    // ------------------------------------------------------------------------
    // 2. DETECT — DEVICE DETECTION
    // ------------------------------------------------------------------------

    /**
     * Inspects hardware concurrency, memory tier, platform, and WebGL GPU capabilities.
     * Decouples device capability from screen size (screen size only affects CSS media queries).
     */
    function detectDevice() {
        const cores = navigator.hardwareConcurrency || 4;
        const memory = navigator.deviceMemory || null;

        // Platform detection
        let platform = "Desktop";
        if (navigator.userAgentData?.platform) {
            platform = navigator.userAgentData.platform;
        } else if (navigator.platform) {
            platform = navigator.platform;
        }

        // WebGL GPU info (safe inspection)
        let gpuRenderer = "Standard Renderer";
        try {
            const canvas = document.createElement("canvas");
            const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
            if (gl) {
                const dbg = gl.getExtension("WEBGL_debug_renderer_info");
                if (dbg) {
                    gpuRenderer = gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || gpuRenderer;
                }
            }
        } catch (e) {
            // Ignored if WebGL blocked or disabled
        }

        // Device form factor inspection
        const ua = (navigator.userAgent || "").toLowerCase();
        let formFactor = "Desktop / Workstation";
        if (/mobile|android|iphone|ipod/.test(ua)) {
            formFactor = "Mobile Device";
        } else if (/ipad|tablet/.test(ua)) {
            formFactor = "Tablet";
        } else if (/macintosh|mac os x/.test(ua)) {
            formFactor = "Mac Computer";
        } else if (/windows nt/.test(ua)) {
            formFactor = "Windows PC";
        } else if (/linux/.test(ua)) {
            formFactor = "Linux Machine";
        }

        // Capability Tier Classification:
        // HIGH:
        // - 8+ CPU cores
        // - Memory is >= 8 GB (or not exposed by browser API on desktop)
        // - High concurrency
        // MEDIUM:
        // - 4-7 CPU cores
        // - Memory >= 4 GB (or not exposed)
        // LOW:
        // - < 4 CPU cores
        // - Memory < 4 GB
        let level = "MEDIUM";
        if (cores >= 8 && (memory === null || memory >= 8)) {
            level = "HIGH";
        } else if (cores >= 4 && (memory === null || memory >= 4)) {
            level = "MEDIUM";
        } else {
            level = "LOW";
        }

        return {
            level,
            cores,
            memory,
            platform,
            formFactor,
            gpuRenderer,
            concurrencyTier: cores >= 8 ? "High Throughput" : (cores >= 4 ? "Balanced" : "Low Power")
        };
    }

    // ------------------------------------------------------------------------
    // 3. DECIDE — THE WEAKEST-LINK ADAPTIVE DECISION ENGINE
    // ------------------------------------------------------------------------

    /**
     * Determines final experience mode based strictly on the weakest condition.
     * HIGH + HIGH = HIGH
     * HIGH + MEDIUM = MEDIUM, MEDIUM + HIGH = MEDIUM
     * HIGH + LOW = LOW, LOW + HIGH = LOW
     * MEDIUM + LOW = LOW, LOW + MEDIUM = LOW
     * LOW + LOW = LOW
     */
    function calculateAdaptiveMode(networkLevel, deviceLevel) {
        // Any LOW condition triggers LOW tier (speed & resource preservation first)
        if (networkLevel === "LOW" || deviceLevel === "LOW") {
            return {
                mode: "LIGHTWEIGHT",
                tier: "LOW",
                imageWidth: 320,
                imageQuality: 40,
                animations: "OFF",
                effects3D: "OFF",
                prefetch: "OFF",
                recommendations: "OFF",
                jsStrategy: "ESSENTIAL",
                description: "Lightweight mode active. Weakest link rule triggered. The full catalog remains available with compressed images (320px, q40), no prefetching, and zero heavy animation loops."
            };
        }

        // Full high-tier requires BOTH High network AND High device capability
        if (networkLevel === "HIGH" && deviceLevel === "HIGH") {
            return {
                mode: "FULL EXPERIENCE",
                tier: "HIGH",
                imageWidth: 1000,
                imageQuality: 85,
                animations: "FULL",
                effects3D: "FULL",
                prefetch: "ON",
                recommendations: "ON",
                jsStrategy: "FULL",
                description: "Premium mode active. Dual-high environment confirmed. The full catalog uses high-res imagery (1000px, q85), 3D card tilt, animated mesh, and proactive prefetching."
            };
        }

        // Balanced tier for intermediate / medium pairings
        return {
            mode: "BALANCED",
            tier: "MEDIUM",
            imageWidth: 600,
            imageQuality: 65,
            animations: "REDUCED",
            effects3D: "OFF",
            prefetch: "OFF",
            recommendations: "LIMITED",
            jsStrategy: "BALANCED",
            description: "Balanced mode active. The full catalog uses medium imagery (600px, q65), subtle UI hover effects, and restrained JavaScript execution."
        };
    }

    // ------------------------------------------------------------------------
    // 4. ADAPT — STRATEGY EXECUTION
    // ------------------------------------------------------------------------

    /**
     * Generates adaptive responsive image URL matching active tier
     */
    function getAdaptiveImageUrl(rawUrl, config) {
        if (!rawUrl) return "";
        return rawUrl
            .replace(/w=\d+/, "w=" + config.imageWidth)
            .replace(/q=\d+/, "q=" + config.imageQuality);
    }

    /**
     * Prefetch Strategy: Prefetches next critical assets only in HIGH tier
     */
    function applyPrefetchStrategy(config, candidateUrl) {
        const existing = document.getElementById("adaptivePrefetchTag");
        if (existing) existing.remove();

        if (config.prefetch !== "ON" || !candidateUrl) return;

        const link = document.createElement("link");
        link.id = "adaptivePrefetchTag";
        link.rel = "prefetch";
        link.as = "image";
        link.href = candidateUrl;
        document.head.appendChild(link);
    }

    /**
     * JavaScript Strategy: Dynamically imports rich-features.js only in HIGH tier
     */
    async function applyJSStrategy(config) {
        if (config.tier === "HIGH") {
            try {
                if (!state.dynamicRichModule) {
                    state.dynamicRichModule = await import("./assets/js/rich-features.js");
                }
                state.dynamicRichModule?.initRichFeatures?.();
            } catch (err) {
                console.warn("[AdaptiveWeb] Dynamic import of rich-features.js failed:", err.message);
            }
        } else {
            // Unload / destroy rich features when leaving HIGH tier
            if (state.dynamicRichModule) {
                state.dynamicRichModule?.destroyRichFeatures?.();
            }
        }
    }

    /**
     * Applies overall visual tier classes to body
     */
    function applyAdaptiveMode(config) {
        state.activeConfig = config;
        document.body.classList.remove("high-mode", "medium-mode", "low-mode");

        if (config.tier === "HIGH") {
            document.body.classList.add("high-mode");
        } else if (config.tier === "MEDIUM") {
            document.body.classList.add("medium-mode");
        } else {
            document.body.classList.add("low-mode");
        }

        // Manage recommendations section
        const recSection = document.getElementById("recommendations");
        if (recSection) {
            recSection.style.display = config.recommendations === "OFF" ? "none" : "flex";
        }

        // Apply JS loading strategy
        applyJSStrategy(config);
    }

    // ------------------------------------------------------------------------
    // 5. MEASURE — REAL BROWSER TELEMETRY (WEB VITALS & RESOURCE TIMING)
    // ------------------------------------------------------------------------

    function initPerformanceMonitoring(onTelemetryUpdate) {
        // 1. Largest Contentful Paint (LCP)
        if ("PerformanceObserver" in window) {
            try {
                const lcpObserver = new PerformanceObserver((entryList) => {
                    const entries = entryList.getEntries();
                    if (entries.length > 0) {
                        const last = entries[entries.length - 1];
                        state.telemetry.lcp = Number((last.startTime / 1000).toFixed(2));
                        onTelemetryUpdate?.(state.telemetry);
                    }
                });
                lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });
            } catch (e) {
                state.telemetry.lcp = "Not supported";
            }

            // 2. Cumulative Layout Shift (CLS)
            try {
                const clsObserver = new PerformanceObserver((entryList) => {
                    for (const entry of entryList.getEntries()) {
                        if (!entry.hadRecentInput) {
                            state.telemetry.cls += entry.value;
                        }
                    }
                    onTelemetryUpdate?.(state.telemetry);
                });
                clsObserver.observe({ type: "layout-shift", buffered: true });
            } catch (e) {
                state.telemetry.cls = "Not supported";
            }

            // 3. Interaction to Next Paint (INP) / First Input Delay (FID)
            try {
                const inpObserver = new PerformanceObserver((entryList) => {
                    const entries = entryList.getEntries();
                    if (entries.length > 0) {
                        const first = entries[0];
                        state.telemetry.inp = Math.round(first.duration || (first.processingStart - first.startTime));
                        onTelemetryUpdate?.(state.telemetry);
                    }
                });
                inpObserver.observe({ type: "first-input", buffered: true });
            } catch (e) {
                state.telemetry.inp = "Not supported";
            }
        }

        // 4. Navigation & Resource Timings after page load
        const captureTimings = () => {
            setTimeout(() => {
                const navEntries = performance.getEntriesByType("navigation");
                if (navEntries.length > 0) {
                    const nav = navEntries[0];
                    if (nav.loadEventEnd > 0) {
                        state.telemetry.pageLoad = Math.round(nav.loadEventEnd - nav.startTime);
                    }
                    if (nav.domContentLoadedEventEnd > 0) {
                        state.telemetry.domContentLoaded = Math.round(nav.domContentLoadedEventEnd - nav.startTime);
                    }
                }

                // Resource Breakdown
                const resEntries = performance.getEntriesByType("resource");
                state.telemetry.resourceCount = resEntries.length;

                let totalBytes = 0;
                let imgBytes = 0;
                let imgCount = 0;
                let jsBytes = 0;
                let jsCount = 0;

                resEntries.forEach((res) => {
                    const bytes = res.transferSize || res.encodedBodySize || 0;
                    totalBytes += bytes;
                    if (res.initiatorType === "img" || /\.(png|jpe?g|webp|avif|svg)/i.test(res.name)) {
                        imgBytes += bytes;
                        imgCount++;
                    }
                    if (res.initiatorType === "script" || /\.js/i.test(res.name)) {
                        jsBytes += bytes;
                        jsCount++;
                    }
                });

                state.telemetry.totalTransferBytes = totalBytes;
                state.telemetry.imgCount = imgCount;
                state.telemetry.imgTransferBytes = imgBytes;
                state.telemetry.jsCount = jsCount;
                state.telemetry.jsTransferBytes = jsBytes;

                onTelemetryUpdate?.(state.telemetry);
            }, 300);
        };

        if (document.readyState === "complete") {
            captureTimings();
        } else {
            window.addEventListener("load", captureTimings);
        }
    }

    // ------------------------------------------------------------------------
    // 6. STRUCTURED CONSOLE LOGGING (Strictly adheres to Section 15)
    // ------------------------------------------------------------------------

    function logRuntimeUpdate(netInfo, devInfo, config, netMode = "AUTO", devMode = "AUTO") {
        const key = `${netInfo.level}-${devInfo.level}-${config.tier}-${netMode}-${devMode}`;
        if (key === state.lastLoggedKey) return;
        state.lastLoggedKey = key;

        const netSpeedDisplay = state.measuredBandwidth !== null
            ? `${state.measuredBandwidth} Mbps (Measured)`
            : (netInfo.browserEstimate !== null ? `${netInfo.browserEstimate} Mbps` : "Unavailable");

        const rttDisplay = netInfo.rtt !== null ? `${netInfo.rtt} ms` : "Unavailable";
        const memDisplay = devInfo.memory !== null ? `${devInfo.memory} GB` : "Unavailable";

        const lcpDisplay = typeof state.telemetry.lcp === "number" ? `${state.telemetry.lcp}s` : (state.telemetry.lcp || "Measuring...");
        const inpDisplay = typeof state.telemetry.inp === "number" ? `${state.telemetry.inp}ms` : (state.telemetry.inp || "Pending input");
        const clsDisplay = typeof state.telemetry.cls === "number" ? state.telemetry.cls.toFixed(3) : state.telemetry.cls;

        console.log(
            `========================================\n` +
            `AdaptiveWeb Runtime\n` +
            `========================================\n\n` +
            `[NETWORK]\n` +
            `Level: ${netInfo.level}\n` +
            `Mode: ${netMode}\n` +
            `Effective Type: ${netInfo.effectiveType}\n` +
            `Downlink: ${netSpeedDisplay}\n` +
            `RTT: ${rttDisplay}\n` +
            `Online: ${netInfo.onLine}\n` +
            `Save Data: ${netInfo.saveData ? "Yes" : "No"}\n\n` +
            `[DEVICE]\n` +
            `Level: ${devInfo.level}\n` +
            `Mode: ${devMode}\n` +
            `CPU Cores: ${devInfo.cores}\n` +
            `Memory: ${memDisplay}\n` +
            `Platform: ${devInfo.platform}\n` +
            `Browser: ${devInfo.formFactor}\n\n` +
            `[DECISION]\n` +
            `Final Mode: ${config.tier}\n\n` +
            `[DELIVERY]\n` +
            `Images: ${config.tier}\n` +
            `JavaScript: ${config.jsStrategy}\n` +
            `Animations: ${config.animations}\n` +
            `Recommendations: ${config.recommendations}\n` +
            `Prefetch: ${config.prefetch}\n\n` +
            `[PERFORMANCE]\n` +
            `LCP: ${lcpDisplay}\n` +
            `INP: ${inpDisplay}\n` +
            `CLS: ${clsDisplay}\n\n` +
            `========================================`
        );
    }

    // ------------------------------------------------------------------------
    // PUBLIC ENGINE API
    // ------------------------------------------------------------------------

    window.AdaptiveEngine = {
        detectNetwork,
        detectDevice,
        calculateAdaptiveMode,
        applyAdaptiveMode,
        applyPrefetchStrategy,
        applyJSStrategy,
        getAdaptiveImageUrl,
        measureBandwidth,
        initPerformanceMonitoring,
        logRuntimeUpdate,
        getTelemetry: () => ({ ...state.telemetry }),
        triggerAudioChime: (type) => state.dynamicRichModule?.playChime?.(type)
    };

})(window);
