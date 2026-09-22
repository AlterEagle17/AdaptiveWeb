// ============================================================================
// AdaptiveWeb — Main E-Commerce Application & UI Coordinator
// ============================================================================
// File: script.js
// Store: AdaptiveShop ("One Web App. Every Network. Every Device.")
// ============================================================================

(function () {
    "use strict";

    // ------------------------------------------------------------------------
    // APPLICATION STATE & CONSTANTS
    // ------------------------------------------------------------------------

    const API_BASE_URL = window.API_BASE_URL || "http://localhost:8080/api";
    let isBackendAvailable = false;

    let activeCategory = "ALL";
    let searchQuery = "";
    const cart = new Map(); // id -> { product, quantity }

    // Fallback Product Catalog (10 Realistic Tech Products)
    const localProducts = [
        {
            id: 1,
            name: "Nova X Pro 5G",
            category: "SMARTPHONES",
            price: 69999,
            priceFormatted: "₹69,999",
            rating: 4.9,
            reviewsCount: 342,
            badge: "✦ Flagship",
            description: "Adaptive 120Hz LTPO OLED display with Neural Coprocessor, 200MP camera, and 5G dual-SIM.",
            image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=85",
            specs: ["6.8\" Quad-HD+ OLED", "Snapdragon 8 Gen 3", "5000mAh battery", "45W SuperVOOC"]
        },
        {
            id: 2,
            name: "UltraBook Pro 16",
            category: "LAPTOPS",
            price: 149999,
            priceFormatted: "₹1,49,999",
            rating: 4.8,
            reviewsCount: 189,
            badge: "✦ Pro Power",
            description: "Liquid Retina XDR workstation with 16-core CPU architecture, 32GB unified RAM, and 36-hour battery.",
            image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1000&q=85",
            specs: ["16.2\" Mini-LED 120Hz", "16-Core M3 Max", "1TB Gen4 NVMe", "MagSafe 3 & TB4"]
        },
        {
            id: 3,
            name: "Sonic Pro Wireless ANC",
            category: "AUDIO",
            price: 18999,
            priceFormatted: "₹18,999",
            rating: 4.9,
            reviewsCount: 512,
            badge: "✦ Hi-Res Audio",
            description: "Active noise cancelling with 40mm beryllium drivers, spatial acoustics, and 48-hour playback.",
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=85",
            specs: ["Hybrid Adaptive ANC", "LDAC & aptX Lossless", "Multipoint Bluetooth 5.4", "Ultra-soft memory foam"]
        },
        {
            id: 4,
            name: "Vision Watch Ultra",
            category: "ACCESSORIES",
            price: 42999,
            priceFormatted: "₹42,999",
            rating: 4.7,
            reviewsCount: 220,
            badge: "✦ Titanium",
            description: "Aerospace titanium chassis, sapphire crystal display, dual-frequency GPS, and 100m water resistance.",
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=85",
            specs: ["Grade 5 Titanium", "3000-nit OLED", "Dual-band L1/L5 GPS", "ECG & Blood Oxygen"]
        },
        {
            id: 5,
            name: "UltraTab Pro 12.9",
            category: "SMARTPHONES",
            price: 89999,
            priceFormatted: "₹89,999",
            rating: 4.8,
            reviewsCount: 147,
            badge: "✦ 120Hz Retina",
            description: "Creative touchscreen canvas powered by octa-core silicon with magnetic stylus sync and stage manager.",
            image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1000&q=85",
            specs: ["12.9\" ProMotion OLED", "8-Core Silicon", "Apple Pencil Pro support", "Quad studio speakers"]
        },
        {
            id: 6,
            name: "Apex Mechanical Keyboard",
            category: "ACCESSORIES",
            price: 9499,
            priceFormatted: "₹9,499",
            rating: 4.9,
            reviewsCount: 410,
            badge: "✦ Custom",
            description: "CNC aircraft aluminum body with hot-swappable tactile switches, gasket mount, and per-key RGB.",
            image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=85",
            specs: ["Gasket Mount structure", "Gateron Oil King switches", "Tri-mode 2.4G/BT/Wired", "PBT dye-sub keycaps"]
        },
        {
            id: 7,
            name: "Titan 4K Gaming Display",
            category: "LAPTOPS",
            price: 44999,
            priceFormatted: "₹44,999",
            rating: 4.6,
            reviewsCount: 95,
            badge: "✦ 144Hz HDR",
            description: "32-inch 4K Fast IPS panel with 1ms GTG response, DisplayHDR 600 clarity, and 98% DCI-P3 color gamut.",
            image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1000&q=85",
            specs: ["3840x2160 IPS 144Hz", "DisplayHDR 600 certified", "HDMI 2.1 & DP 1.4", "G-Sync & FreeSync Premium"]
        },
        {
            id: 8,
            name: "Pulse 360 Studio Speaker",
            category: "AUDIO",
            price: 14999,
            priceFormatted: "₹14,999",
            rating: 4.8,
            reviewsCount: 310,
            badge: "✦ 360° Sound",
            description: "Lossless spatial audio projection with real-time acoustic room mapping and AirPlay 2 connectivity.",
            image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=1000&q=85",
            specs: ["Spatial Audio DSP", "Dual downward subwoofers", "Wi-Fi 6 streaming", "Smart voice control"]
        },
        {
            id: 9,
            name: "Alpha 7R Mirrorless Camera",
            category: "ACCESSORIES",
            price: 189999,
            priceFormatted: "₹1,89,999",
            rating: 5.0,
            reviewsCount: 88,
            badge: "✦ 61MP 8K",
            description: "Full-frame back-illuminated sensor with AI real-time tracking autofocus and 8-stop image stabilization.",
            image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=85",
            specs: ["61.0MP Full-Frame Exmor R", "BIONZ XR AI processing", "8K 24p & 4K 60p 10-bit", "Dual CFexpress Type A"]
        },
        {
            id: 10,
            name: "Aeroflex Wireless Mouse",
            category: "ACCESSORIES",
            price: 6999,
            priceFormatted: "₹6,999",
            rating: 4.7,
            reviewsCount: 275,
            badge: "✦ Ultralight 49g",
            description: "Zero-latency 26K DPI optical sensor with honeycomb lightweight chassis and 90-hour continuous battery.",
            image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1000&q=85",
            specs: ["PAW3395 26,000 DPI sensor", "Ultra-light 49 grams", "Nordic 52840 MCU", "Pure PTFE skate feet"]
        }
    ];

    let currentProducts = [...localProducts];

    // ------------------------------------------------------------------------
    // BACKEND SYNCHRONIZATION (Graceful Fallback)
    // ------------------------------------------------------------------------

    async function syncWithBackend() {
        const syncEl = document.getElementById("configBackendSync");
        if (syncEl) syncEl.textContent = "Connecting...";

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2500);

            const res = await fetch(`${API_BASE_URL}/products`, {
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    currentProducts = data.map((item, idx) => ({
                        id: item.id || idx + 1,
                        name: item.name || "Product",
                        category: (item.category || "ACCESSORIES").toUpperCase(),
                        price: item.price || 9999,
                        priceFormatted: `₹${Number(item.price || 9999).toLocaleString("en-IN")}`,
                        rating: item.rating || 4.8,
                        reviewsCount: item.reviewCount || 120,
                        badge: item.badge || "✦ Verified",
                        description: item.description || "Adaptive high performance gear.",
                        image: item.imageUrl || localProducts[idx % localProducts.length].image,
                        specs: item.specs ? (Array.isArray(item.specs) ? item.specs : item.specs.split(",")) : localProducts[idx % localProducts.length].specs
                    }));
                    isBackendAvailable = true;
                    if (syncEl) syncEl.textContent = "Online (Live API)";
                    updateUI();
                    return;
                }
            }
        } catch (e) {
            // Backend unavailable or timed out; seamless local fallback
        }

        isBackendAvailable = false;
        if (syncEl) syncEl.textContent = "Fallback (Mock Data)";
    }

    // ------------------------------------------------------------------------
    // UI COORDINATOR & ADAPTIVE DECISION APPLICATION
    // ------------------------------------------------------------------------

    function getSelectedNetworkTier(detectedLevel) {
        const select = document.getElementById("networkMode");
        const val = select ? select.value : "AUTO";
        return val === "AUTO" ? detectedLevel : val;
    }

    function getSelectedDeviceTier(detectedLevel) {
        const select = document.getElementById("deviceMode");
        const val = select ? select.value : "AUTO";
        return val === "AUTO" ? detectedLevel : val;
    }

    function updateUI() {
        const netInfo = window.AdaptiveEngine.detectNetwork();
        const devInfo = window.AdaptiveEngine.detectDevice();

        const netModeSelect = document.getElementById("networkMode")?.value || "AUTO";
        const devModeSelect = document.getElementById("deviceMode")?.value || "AUTO";

        const effectiveNetTier = getSelectedNetworkTier(netInfo.level);
        const effectiveDevTier = getSelectedDeviceTier(devInfo.level);

        // Calculate final mode using the Weakest Link Rule centrally
        const config = window.AdaptiveEngine.calculateAdaptiveMode(effectiveNetTier, effectiveDevTier);

        // Apply visual tier, prefetch, and dynamic JS
        window.AdaptiveEngine.applyAdaptiveMode(config);

        // Render the complete filtered catalog with tier-specific delivery settings.
        renderProducts(config);
        renderRecommendations(config);
        updateConfigModalUI(netInfo, devInfo, config, netModeSelect, devModeSelect);

        // Update Storefront Status Bar
        const shopStatusEl = document.getElementById("shopStatus");
        if (shopStatusEl) {
            const netLabel = netModeSelect === "AUTO" ? `${effectiveNetTier} (Live)` : `${effectiveNetTier} (Manual)`;
            const devLabel = devModeSelect === "AUTO" ? `${effectiveDevTier} (Live)` : `${effectiveDevTier} (Manual)`;
            shopStatusEl.textContent = `${netLabel} · ${devLabel} → ${config.tier} TIER (${config.mode})`;
        }

        // Prefetch next critical candidate asset in HIGH mode
        if (config.tier === "HIGH" && currentProducts.length > 1) {
            const candidateUrl = window.AdaptiveEngine.getAdaptiveImageUrl(currentProducts[1].image, config);
            window.AdaptiveEngine.applyPrefetchStrategy(config, candidateUrl);
        }

        // Clean structured console log matching Section 15
        window.AdaptiveEngine.logRuntimeUpdate(netInfo, devInfo, config, netModeSelect, devModeSelect);
    }

    // ------------------------------------------------------------------------
    // PRODUCT RENDERING
    // ------------------------------------------------------------------------

    function renderProducts(config) {
        const grid = document.getElementById("productGrid");
        const noResults = document.getElementById("noResultsNotice");
        if (!grid) return;

        // Filter by category
        let filtered = currentProducts;
        if (activeCategory !== "ALL") {
            filtered = filtered.filter(p => p.category === activeCategory);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q) ||
                p.category.toLowerCase().includes(q)
            );
        }

        // Empty state check
        if (filtered.length === 0) {
            grid.innerHTML = "";
            if (noResults) noResults.style.display = "block";
            updateProductCounts(0, config);
            return;
        }

        if (noResults) noResults.style.display = "none";

        // Network and device tiers change delivery cost, never catalog availability.
        const visibleItems = filtered;
        grid.innerHTML = "";

        visibleItems.forEach((product) => {
            const card = document.createElement("article");
            card.className = "product";
            card.setAttribute("data-id", product.id);

            const imgUrl = window.AdaptiveEngine.getAdaptiveImageUrl(product.image, config);

            card.innerHTML = `
                <div class="product-image" onclick="window.AdaptiveShop.openProductModal(${product.id})">
                    <span class="product-badge">${product.badge}</span>
                    <img
                        src="${imgUrl}"
                        alt="${product.name}"
                        loading="lazy"
                        width="360"
                        height="270"
                        decoding="async"
                    >
                </div>

                <div class="product-info">
                    <div class="product-meta-row">
                        <span class="product-category">${product.category}</span>
                        <span class="product-rating" title="${product.rating} rating from ${product.reviewsCount} reviews">
                            ★ <b>${product.rating}</b> <small>(${product.reviewsCount})</small>
                        </span>
                    </div>

                    <h3 onclick="window.AdaptiveShop.openProductModal(${product.id})">${product.name}</h3>
                    <p>${product.description}</p>

                    <div class="product-bottom">
                        <strong class="product-price">${product.priceFormatted}</strong>
                        <button
                            class="add-cart"
                            data-id="${product.id}"
                            aria-label="Add ${product.name} to cart"
                            onclick="window.AdaptiveShop.addToCart(${product.id})"
                        >
                            Add to Cart +
                        </button>
                    </div>
                </div>
            `;

            grid.appendChild(card);
        });

        updateProductCounts(visibleItems.length, config);

        // Re-attach 3D tilt listeners if dynamic module is active
        if (config.tier === "HIGH") {
            window.AdaptiveEngine.applyJSStrategy(config);
        }
    }

    function updateProductCounts(count, config) {
        const countEl = document.getElementById("productCount");
        if (countEl) countEl.textContent = `${count} products`;

        const modeEl = document.getElementById("productMode");
        if (modeEl) {
            modeEl.textContent = `${config.mode} · Images: ${config.imageQuality}% (${config.imageWidth}px)`;
        }
    }

    // ------------------------------------------------------------------------
    // RECOMMENDATIONS RENDERING (HIGH & MEDIUM only, omitted in LOW)
    // ------------------------------------------------------------------------

    function renderRecommendations(config) {
        const recSection = document.getElementById("recommendations");
        const recGrid = document.getElementById("recommendationsGrid");
        if (!recSection || !recGrid) return;

        if (config.recommendations === "OFF") {
            recSection.style.display = "none";
            recGrid.innerHTML = "";
            return;
        }

        recSection.style.display = "flex";
        recGrid.innerHTML = "";

        const recCount = config.tier === "HIGH" ? 3 : 1;
        const recItems = currentProducts.slice(0, recCount);

        recItems.forEach(item => {
            const card = document.createElement("div");
            card.className = "rec-card";
            const imgUrl = window.AdaptiveEngine.getAdaptiveImageUrl(item.image, config);

            card.innerHTML = `
                <img src="${imgUrl}" alt="${item.name}" loading="lazy" width="120" height="90">
                <div class="rec-info">
                    <strong>${item.name}</strong>
                    <span>${item.priceFormatted}</span>
                </div>
                <button class="rec-btn" onclick="window.AdaptiveShop.addToCart(${item.id})">
                    + Add
                </button>
            `;
            recGrid.appendChild(card);
        });
    }

    // ------------------------------------------------------------------------
    // SEARCH & FILTERING
    // ------------------------------------------------------------------------

    function filterCategory(cat) {
        activeCategory = cat;

        // Update category pills
        document.querySelectorAll(".category-card").forEach(el => {
            if (el.getAttribute("data-cat") === cat) {
                el.classList.add("active");
            } else {
                el.classList.remove("active");
            }
        });

        updateUI();
        scrollToProducts();
    }

    function handleSearchInput(e) {
        searchQuery = e.target.value;
        const clearBtn = document.getElementById("clearSearchBtn");
        if (clearBtn) {
            clearBtn.style.display = searchQuery ? "inline-flex" : "none";
        }
        updateUI();
    }

    function clearSearchFilter() {
        const input = document.getElementById("productSearchInput");
        if (input) input.value = "";
        searchQuery = "";
        activeCategory = "ALL";
        const clearBtn = document.getElementById("clearSearchBtn");
        if (clearBtn) clearBtn.style.display = "none";
        filterCategory("ALL");
    }

    function scrollToProducts() {
        const el = document.getElementById("products");
        if (el) el.scrollIntoView({ behavior: "smooth" });
    }

    // ------------------------------------------------------------------------
    // CART DRAWER & CHECKOUT
    // ------------------------------------------------------------------------

    function addToCart(productId) {
        const prod = currentProducts.find(p => p.id == productId);
        if (!prod) return;

        if (cart.has(productId)) {
            cart.get(productId).quantity += 1;
        } else {
            cart.set(productId, { product: prod, quantity: 1 });
        }

        updateCartUI();
        window.AdaptiveEngine.triggerAudioChime("cart");
        showToast(`Added "${prod.name}" to cart.`);
    }

    function removeFromCart(productId) {
        if (cart.has(productId)) {
            cart.delete(productId);
            updateCartUI();
            showToast("Item removed from cart.");
        }
    }

    function updateCartQuantity(productId, delta) {
        if (!cart.has(productId)) return;
        const entry = cart.get(productId);
        entry.quantity += delta;
        if (entry.quantity <= 0) {
            cart.delete(productId);
        }
        updateCartUI();
    }

    function updateCartUI() {
        let totalItems = 0;
        let subtotal = 0;

        cart.forEach(({ product, quantity }) => {
            totalItems += quantity;
            subtotal += product.price * quantity;
        });

        // Update badge
        const badge = document.getElementById("cartCount");
        if (badge) badge.textContent = totalItems;

        // Update drawer subtotal
        const subtotalEl = document.getElementById("cartSubtotal");
        if (subtotalEl) {
            subtotalEl.textContent = `₹${subtotal.toLocaleString("en-IN")}`;
        }

        renderCartDrawerItems();
    }

    function renderCartDrawerItems() {
        const container = document.getElementById("cartItemsList");
        if (!container) return;

        if (cart.size === 0) {
            container.innerHTML = `
                <div class="cart-empty-state">
                    <span class="empty-icon">🛒</span>
                    <h3>Your cart is empty</h3>
                    <p>AdaptiveShop scales performance dynamically as you shop.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = "";
        cart.forEach(({ product, quantity }) => {
            const row = document.createElement("div");
            row.className = "cart-item-row";

            row.innerHTML = `
                <img src="${product.image}" alt="${product.name}" width="64" height="64" loading="lazy">
                <div class="cart-item-details">
                    <strong>${product.name}</strong>
                    <span class="cart-item-price">${product.priceFormatted}</span>
                    <div class="cart-qty-controls">
                        <button onclick="window.AdaptiveShop.updateCartQuantity(${product.id}, -1)" aria-label="Decrease quantity">-</button>
                        <span>${quantity}</span>
                        <button onclick="window.AdaptiveShop.updateCartQuantity(${product.id}, 1)" aria-label="Increase quantity">+</button>
                    </div>
                </div>
                <button class="cart-remove-btn" onclick="window.AdaptiveShop.removeFromCart(${product.id})" aria-label="Remove item">✕</button>
            `;
            container.appendChild(row);
        });
    }

    function openCartDrawer() {
        const overlay = document.getElementById("cartDrawerOverlay");
        if (overlay) {
            overlay.classList.add("active");
            overlay.setAttribute("aria-hidden", "false");
        }
    }

    function closeCartDrawer() {
        const overlay = document.getElementById("cartDrawerOverlay");
        if (overlay) {
            overlay.classList.remove("active");
            overlay.setAttribute("aria-hidden", "true");
        }
    }

    async function handleCheckout() {
        if (cart.size === 0) {
            showToast("Your cart is empty. Add products to checkout.");
            return;
        }

        const items = [];
        let total = 0;
        cart.forEach(({ product, quantity }) => {
            items.push({ productId: product.id, quantity, unitPrice: product.price });
            total += product.price * quantity;
        });

        // If backend is active, submit order
        if (isBackendAvailable) {
            try {
                await fetch(`${API_BASE_URL}/orders`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        customerName: "Hackathon Demo User",
                        customerEmail: "demo@adaptiveshop.io",
                        items: items
                    })
                });
            } catch (e) {
                console.warn("[AdaptiveWeb] Backend order submit fallback:", e);
            }
        }

        window.AdaptiveEngine.triggerAudioChime("checkout");
        cart.clear();
        updateCartUI();
        closeCartDrawer();
        showToast(`Order confirmed! ₹${total.toLocaleString("en-IN")} processed successfully.`);
    }

    // ------------------------------------------------------------------------
    // PRODUCT QUICK VIEW MODAL
    // ------------------------------------------------------------------------

    function openProductModal(productId) {
        const product = currentProducts.find(p => p.id == productId);
        if (!product) return;

        const content = document.getElementById("productModalContent");
        const overlay = document.getElementById("productModalOverlay");
        if (!content || !overlay) return;

        const specsHtml = (product.specs || [])
            .map(s => `<li>✓ ${s}</li>`)
            .join("");

        content.innerHTML = `
            <div class="product-modal-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-modal-info">
                <span class="product-badge">${product.badge}</span>
                <span class="product-category">${product.category}</span>
                <h2>${product.name}</h2>
                <div class="product-modal-rating">
                    ★ <b>${product.rating}</b> / 5.0 · ${product.reviewsCount} customer reviews
                </div>
                <p class="product-modal-desc">${product.description}</p>
                <ul class="product-modal-specs">${specsHtml}</ul>
                <div class="product-modal-bottom">
                    <strong class="product-modal-price">${product.priceFormatted}</strong>
                    <button class="hero-button" onclick="window.AdaptiveShop.addToCart(${product.id}); window.AdaptiveShop.closeProductModal();">
                        Add to Cart
                    </button>
                </div>
            </div>
        `;

        overlay.classList.add("active");
        overlay.setAttribute("aria-hidden", "false");
    }

    function closeProductModal() {
        const overlay = document.getElementById("productModalOverlay");
        if (overlay) {
            overlay.classList.remove("active");
            overlay.setAttribute("aria-hidden", "true");
        }
    }

    // ------------------------------------------------------------------------
    // TOAST NOTIFICATIONS
    // ------------------------------------------------------------------------

    function showToast(message) {
        const container = document.getElementById("toastContainer");
        if (!container) return;

        const toast = document.createElement("div");
        toast.className = "toast";
        toast.textContent = message;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = "0";
            toast.style.transform = "translateY(10px)";
            toast.style.transition = "all 0.3s ease";
            setTimeout(() => toast.remove(), 300);
        }, 2400);
    }

    // ------------------------------------------------------------------------
    // CONFIG PANEL STATUS UPDATER (Strictly Section 14)
    // ------------------------------------------------------------------------

    function updateConfigModalUI(netInfo, devInfo, config, netMode, devMode) {
        const setVal = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val;
        };

        // Network Status
        const netLevelEffective = netMode === "AUTO" ? netInfo.level : netMode;
        setVal("networkLevel", netLevelEffective);
        setVal("networkBadge", netLevelEffective);
        setVal("networkModeDisplay", netMode === "AUTO" ? "AUTO (Live)" : "MANUAL (Simulated)");
        setVal("networkType", netInfo.effectiveType);
        setVal("browserSpeed", netInfo.browserEstimate !== null ? `${netInfo.browserEstimate} Mbps` : "Unavailable");
        setVal("measuredSpeed", netInfo.measuredBandwidth !== null ? `${netInfo.measuredBandwidth} Mbps` : "Click 'Run Speed Test'");
        setVal("networkRTT", netInfo.rtt !== null ? `${netInfo.rtt} ms` : "Unavailable");
        setVal("onlineStatus", netInfo.onLine ? "YES (Connected)" : "NO (Offline)");
        setVal("saveDataStatus", netInfo.saveData ? "YES (Active)" : "NO");

        // Device Status
        const devLevelEffective = devMode === "AUTO" ? devInfo.level : devMode;
        setVal("deviceLevel", devLevelEffective);
        setVal("deviceBadge", devLevelEffective);
        setVal("deviceModeDisplay", devMode === "AUTO" ? "AUTO (Live)" : "MANUAL (Simulated)");
        setVal("cpuCores", `${devInfo.cores} Cores`);
        setVal("deviceMemory", devInfo.memory !== null ? `${devInfo.memory} GB` : "Unavailable (API unexposed)");
        setVal("platform", devInfo.platform);
        setVal("deviceType", devInfo.formFactor);
        setVal("concurrencyTier", devInfo.concurrencyTier);
        setVal("gpuInfo", devInfo.gpuRenderer);

        // Adaptive Decision
        setVal("adaptiveMode", config.mode);
        setVal("adaptiveDescription", config.description);
        setVal("decisionPill", `${config.tier} TIER`);

        // Delivery Strategy
        setVal("configImageQuality", `${config.tier} (${config.imageWidth}px, q${config.imageQuality})`);
        setVal("configProductCount", "All catalog items");
        setVal("configAnimations", config.animations);
        setVal("config3DEffects", config.effects3D);
        setVal("configRecommendations", config.recommendations);
        setVal("configPrefetch", config.prefetch);
        setVal("configJS", config.jsStrategy);
    }

    function updateTelemetryUI(telemetry) {
        const setVal = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val;
        };

        if (typeof telemetry.lcp === "number") setVal("perfLCP", `${telemetry.lcp}s`);
        else if (telemetry.lcp) setVal("perfLCP", telemetry.lcp);

        if (typeof telemetry.cls === "number") setVal("perfCLS", telemetry.cls.toFixed(3));
        else if (telemetry.cls) setVal("perfCLS", telemetry.cls);

        if (typeof telemetry.inp === "number") setVal("perfINP", `${telemetry.inp}ms`);
        else if (telemetry.inp) setVal("perfINP", telemetry.inp);

        if (typeof telemetry.pageLoad === "number") setVal("perfPageLoad", `${telemetry.pageLoad}ms`);
        if (typeof telemetry.domContentLoaded === "number") setVal("perfDomLoaded", `${telemetry.domContentLoaded}ms`);

        if (telemetry.resourceCount > 0) {
            setVal("perfResourceCount", `${telemetry.resourceCount} items`);
            const totalKB = (telemetry.totalTransferBytes / 1024).toFixed(1);
            setVal("perfTransferSize", `${totalKB} KB Total`);

            setVal("perfImageCount", `${telemetry.imgCount} images`);
            const imgKB = (telemetry.imgTransferBytes / 1024).toFixed(1);
            setVal("perfImageSize", `${imgKB} KB transferred`);

            setVal("perfJSCount", `${telemetry.jsCount} scripts`);
            const jsKB = (telemetry.jsTransferBytes / 1024).toFixed(1);
            setVal("perfJSSize", `${jsKB} KB transferred`);
        }

        // Send telemetry to backend if available
        if (isBackendAvailable && telemetry.pageLoad) {
            fetch(`${API_BASE_URL}/performance`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    lcp: typeof telemetry.lcp === "number" ? telemetry.lcp : null,
                    cls: typeof telemetry.cls === "number" ? telemetry.cls : null,
                    inp: typeof telemetry.inp === "number" ? telemetry.inp : null,
                    pageLoadTime: telemetry.pageLoad,
                    domContentLoaded: telemetry.domContentLoaded,
                    resourceCount: telemetry.resourceCount,
                    totalTransferBytes: telemetry.totalTransferBytes,
                    adaptiveMode: document.body.className.includes("high") ? "HIGH" : (document.body.className.includes("low") ? "LOW" : "MEDIUM")
                })
            }).catch(() => {});
        }
    }

    // ------------------------------------------------------------------------
    // MODAL HANDLERS
    // ------------------------------------------------------------------------

    function openConfigModal() {
        const overlay = document.getElementById("configOverlay");
        if (overlay) overlay.classList.add("active");
    }

    function closeConfigModal() {
        const overlay = document.getElementById("configOverlay");
        if (overlay) overlay.classList.remove("active");
    }

    // ------------------------------------------------------------------------
    // EVENT BINDINGS & BOOTSTRAP
    // ------------------------------------------------------------------------

    function initEventListeners() {
        // Config modal triggers
        document.getElementById("configButton")?.addEventListener("click", openConfigModal);
        document.getElementById("closeConfig")?.addEventListener("click", closeConfigModal);
        document.getElementById("configOverlay")?.addEventListener("click", (e) => {
            if (e.target.id === "configOverlay") closeConfigModal();
        });

        // Cart triggers
        document.getElementById("cartButton")?.addEventListener("click", openCartDrawer);
        document.getElementById("closeCartDrawer")?.addEventListener("click", closeCartDrawer);
        document.getElementById("cartDrawerOverlay")?.addEventListener("click", (e) => {
            if (e.target.id === "cartDrawerOverlay") closeCartDrawer();
        });
        document.getElementById("checkoutButton")?.addEventListener("click", handleCheckout);

        // Product Quick View modal triggers
        document.getElementById("closeProductModal")?.addEventListener("click", closeProductModal);
        document.getElementById("productModalOverlay")?.addEventListener("click", (e) => {
            if (e.target.id === "productModalOverlay") closeProductModal();
        });

        // Search input
        const searchInput = document.getElementById("productSearchInput");
        if (searchInput) {
            searchInput.addEventListener("input", handleSearchInput);
        }
        document.getElementById("clearSearchBtn")?.addEventListener("click", clearSearchFilter);

        // Simulation dropdowns
        document.getElementById("networkMode")?.addEventListener("change", updateUI);
        document.getElementById("deviceMode")?.addEventListener("change", updateUI);

        // Speed test button
        document.getElementById("runSpeedTestBtn")?.addEventListener("click", async () => {
            const btn = document.getElementById("runSpeedTestBtn");
            if (btn) btn.textContent = "Testing...";
            await window.AdaptiveEngine.measureBandwidth();
            if (btn) btn.textContent = "⚡ Run Speed Test";
            updateUI();
            showToast("Bandwidth measurement updated!");
        });

        // Escape key closes modals
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                closeConfigModal();
                closeCartDrawer();
                closeProductModal();
            }
        });

        // Network connection live change listener
        const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (conn) {
            conn.addEventListener("change", () => {
                console.log("[AdaptiveWeb] Client network properties changed");
                updateUI();
            });
        }

        // Online / offline listeners
        window.addEventListener("online", () => {
            console.log("[AdaptiveWeb] Connection status: ONLINE");
            updateUI();
            showToast("Network restored: Online.");
        });

        window.addEventListener("offline", () => {
            console.log("[AdaptiveWeb] Connection status: OFFLINE");
            updateUI();
            showToast("Connection lost: Offline mode active.");
        });
    }

    // ------------------------------------------------------------------------
    // APPLICATION INITIALIZATION
    // ------------------------------------------------------------------------

    function initializeApplication() {
        initEventListeners();
        window.AdaptiveEngine.initPerformanceMonitoring(updateTelemetryUI);
        updateUI();

        // Attempt backend sync in background
        syncWithBackend();

        // Safe non-blocking speed test after initial page settle
        window.addEventListener("load", () => {
            setTimeout(async () => {
                await window.AdaptiveEngine.measureBandwidth();
                updateUI();
            }, 600);
        });
    }

    // Expose global methods for inline HTML onclick handlers
    window.AdaptiveShop = {
        openConfigModal,
        closeConfigModal,
        openCartDrawer,
        closeCartDrawer,
        openProductModal,
        closeProductModal,
        filterCategory,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearSearchFilter,
        scrollToProducts
    };

    // Global alias helpers
    window.openConfigModal = openConfigModal;
    window.filterCategory = filterCategory;
    window.scrollToProducts = scrollToProducts;
    window.clearSearchFilter = clearSearchFilter;

    // Start application on DOM ready
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initializeApplication);
    } else {
        initializeApplication();
    }

})();
