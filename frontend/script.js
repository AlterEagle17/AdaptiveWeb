/* =========================================================
   AdaptiveWeb — Main Storefront
   Backend remains unchanged
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       BACKEND
       ===================================================== */

    const API_BASE_URL =
        window.API_BASE_URL ||
        "https://adaptiveweb.onrender.com/api";


    let isBackendAvailable = false;

    let activeCategory = "ALL";
    let searchQuery = "";

    const cart = new Map();

    let currentProducts = [];


    /* =====================================================
       FALLBACK PRODUCTS
       ===================================================== */

    const localProducts = [

        {
            id: 1,
            name: "Nova X Pro 5G",
            category: "SMARTPHONES",
            price: 69999,
            rating: 4.9,
            reviewsCount: 342,
            badge: "✦ Flagship",
            description:
                "Adaptive 120Hz OLED display with powerful performance and advanced camera system.",
            image:
                "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=85",
            specs: [
                "6.8 inch OLED",
                "Snapdragon processor",
                "5000mAh battery",
                "5G connectivity"
            ]
        },

        {
            id: 2,
            name: "UltraBook Pro 16",
            category: "LAPTOPS",
            price: 149999,
            rating: 4.8,
            reviewsCount: 189,
            badge: "✦ Pro Power",
            description:
                "High-performance laptop designed for developers, creators and professionals.",
            image:
                "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1000&q=85",
            specs: [
                "16 inch display",
                "16-Core CPU",
                "32GB RAM",
                "1TB NVMe"
            ]
        },

        {
            id: 3,
            name: "Sonic Pro Wireless ANC",
            category: "AUDIO",
            price: 18999,
            rating: 4.9,
            reviewsCount: 512,
            badge: "✦ Hi-Res Audio",
            description:
                "Premium wireless headphones with active noise cancellation and spatial audio.",
            image:
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=85",
            specs: [
                "Adaptive ANC",
                "Hi-Res Audio",
                "Bluetooth 5.4",
                "48-hour battery"
            ]
        },

        {
            id: 4,
            name: "Vision Watch Ultra",
            category: "ACCESSORIES",
            price: 42999,
            rating: 4.7,
            reviewsCount: 220,
            badge: "✦ Titanium",
            description:
                "Premium smartwatch with GPS, health tracking and a titanium body.",
            image:
                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=85",
            specs: [
                "Titanium body",
                "OLED display",
                "GPS",
                "Health tracking"
            ]
        },

        {
            id: 5,
            name: "UltraTab Pro 12.9",
            category: "SMARTPHONES",
            price: 89999,
            rating: 4.8,
            reviewsCount: 147,
            badge: "✦ 120Hz",
            description:
                "Large professional tablet for entertainment, creativity and productivity.",
            image:
                "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1000&q=85",
            specs: [
                "12.9 inch display",
                "Octa-core processor",
                "Stylus support",
                "Quad speakers"
            ]
        },

        {
            id: 6,
            name: "Apex Mechanical Keyboard",
            category: "ACCESSORIES",
            price: 9499,
            rating: 4.9,
            reviewsCount: 410,
            badge: "✦ Custom",
            description:
                "Premium mechanical keyboard with hot-swappable switches and RGB.",
            image:
                "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=85",
            specs: [
                "Mechanical switches",
                "RGB lighting",
                "Wireless",
                "Hot-swappable"
            ]
        },

        {
            id: 7,
            name: "Titan 4K Gaming Display",
            category: "LAPTOPS",
            price: 44999,
            rating: 4.6,
            reviewsCount: 95,
            badge: "✦ 144Hz HDR",
            description:
                "4K gaming monitor with high refresh rate and HDR support.",
            image:
                "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1000&q=85",
            specs: [
                "4K resolution",
                "144Hz refresh rate",
                "HDR",
                "Adaptive sync"
            ]
        },

        {
            id: 8,
            name: "Pulse 360 Studio Speaker",
            category: "AUDIO",
            price: 14999,
            rating: 4.8,
            reviewsCount: 310,
            badge: "✦ 360° Sound",
            description:
                "Immersive wireless speaker with spatial audio and room optimization.",
            image:
                "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=1000&q=85",
            specs: [
                "360° sound",
                "Spatial audio",
                "Wi-Fi",
                "Smart controls"
            ]
        },

        {
            id: 9,
            name: "Alpha Mirrorless Camera",
            category: "ACCESSORIES",
            price: 189999,
            rating: 5.0,
            reviewsCount: 88,
            badge: "✦ 61MP",
            description:
                "Professional mirrorless camera with advanced autofocus and stabilization.",
            image:
                "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=85",
            specs: [
                "61MP sensor",
                "8K video",
                "AI autofocus",
                "Image stabilization"
            ]
        },

        {
            id: 10,
            name: "Aeroflex Wireless Mouse",
            category: "ACCESSORIES",
            price: 6999,
            rating: 4.7,
            reviewsCount: 275,
            badge: "✦ Ultralight",
            description:
                "Lightweight wireless mouse with high precision sensor and long battery life.",
            image:
                "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1000&q=85",
            specs: [
                "26K DPI sensor",
                "49g weight",
                "Wireless",
                "90-hour battery"
            ]
        }

    ];


    currentProducts = [...localProducts];


    /* =====================================================
       HELPERS
       ===================================================== */

    function formatPrice(price) {

        return `₹${Number(price || 0).toLocaleString("en-IN")}`;

    }


    function adaptiveImage(url, config) {

        if (!url) return "";

        try {

            const parsed = new URL(url);

            if (config && config.imageWidth) {
                parsed.searchParams.set(
                    "w",
                    config.imageWidth
                );
            }

            if (config && config.imageQuality) {
                parsed.searchParams.set(
                    "q",
                    config.imageQuality
                );
            }

            return parsed.toString();

        } catch {

            return url;

        }

    }


    function escapeHTML(value) {

        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");

    }


    /* =====================================================
       BACKEND SYNC
       ===================================================== */

    async function syncWithBackend() {

        const backendStatus =
            document.getElementById("configBackendSync");

        if (backendStatus) {
            backendStatus.textContent = "Connecting...";
        }

        try {

            const controller =
                new AbortController();

            const timeout =
                setTimeout(
                    () => controller.abort(),
                    5000
                );


            const response =
                await fetch(
                    `${API_BASE_URL}/products`,
                    {
                        signal: controller.signal
                    }
                );


            clearTimeout(timeout);


            if (!response.ok) {
                throw new Error(
                    `HTTP ${response.status}`
                );
            }


            const data =
                await response.json();


            if (Array.isArray(data) && data.length) {

                currentProducts =
                    data.map((item, index) => {

                        const fallback =
                            localProducts[
                                index %
                                localProducts.length
                            ];

                        return {

                            id:
                                item.id ??
                                fallback.id,

                            name:
                                item.name ??
                                fallback.name,

                            category:
                                String(
                                    item.category ??
                                    fallback.category
                                ).toUpperCase(),

                            price:
                                Number(
                                    item.price ??
                                    fallback.price
                                ),

                            rating:
                                Number(
                                    item.rating ??
                                    fallback.rating
                                ),

                            reviewsCount:
                                Number(
                                    item.reviewCount ??
                                    item.reviewsCount ??
                                    fallback.reviewsCount
                                ),

                            badge:
                                item.badge ??
                                fallback.badge,

                            description:
                                item.description ??
                                fallback.description,

                            image:
                                item.imageUrl ??
                                item.image ??
                                fallback.image,

                            specs:
                                Array.isArray(item.specs)
                                    ? item.specs
                                    : fallback.specs

                        };

                    });


                isBackendAvailable = true;

                if (backendStatus) {
                    backendStatus.textContent =
                        "Online • Live API";
                }

            }

        } catch (error) {

            isBackendAvailable = false;

            currentProducts =
                [...localProducts];

            if (backendStatus) {
                backendStatus.textContent =
                    "Fallback • Local Catalog";
            }

        }


        updateUI();

    }


    /* =====================================================
       ADAPTIVE CONFIG
       ===================================================== */

    function getAdaptiveConfig() {

        let config = {

            tier: "MEDIUM",

            mode: "BALANCED",

            imageWidth: 600,

            imageQuality: 65,

            animations: "REDUCED",

            recommendations: "LIMITED",

            prefetch: "OFF",

            jsStrategy: "BALANCED",

            description:
                "Balanced delivery for normal network and device conditions."

        };


        if (
            window.AdaptiveEngine &&
            typeof window.AdaptiveEngine.detectNetwork === "function"
        ) {

            const net =
                window.AdaptiveEngine.detectNetwork();

            const dev =
                window.AdaptiveEngine.detectDevice();


            if (
                typeof window.AdaptiveEngine
                    .calculateAdaptiveMode === "function"
            ) {

                config =
                    window.AdaptiveEngine
                        .calculateAdaptiveMode(
                            net.level,
                            dev.level
                        );

            }

        }


        return config;

    }


    function applyAdaptiveUI(config) {

        document.body.classList.remove(
            "high-mode",
            "medium-mode",
            "low-mode"
        );


        if (config.tier === "HIGH") {

            document.body.classList.add(
                "high-mode"
            );

        } else if (config.tier === "LOW") {

            document.body.classList.add(
                "low-mode"
            );

        } else {

            document.body.classList.add(
                "medium-mode"
            );

        }


        setText(
            "adaptiveMode",
            config.mode || config.tier
        );

        setText(
            "adaptiveDescription",
            config.description ||
            "Adaptive delivery active."
        );

        setText(
            "decisionPill",
            `${config.tier} TIER`
        );

        setText(
            "configImageQuality",
            `${config.imageQuality || "—"}%`
        );

        setText(
            "configAnimations",
            config.animations || "—"
        );

        setText(
            "configRecommendations",
            config.recommendations || "—"
        );

        setText(
            "configPrefetch",
            config.prefetch || "—"
        );

        setText(
            "configJS",
            config.jsStrategy || "—"
        );

    }


    /* =====================================================
       PRODUCT RENDERING
       ===================================================== */

    function renderProducts(config) {

        const grid =
            document.getElementById("productGrid");

        const noResults =
            document.getElementById("noResultsNotice");


        if (!grid) return;


        let products =
            [...currentProducts];


        if (activeCategory !== "ALL") {

            products =
                products.filter(
                    product =>
                        product.category ===
                        activeCategory
                );

        }


        if (searchQuery.trim()) {

            const query =
                searchQuery
                    .toLowerCase()
                    .trim();


            products =
                products.filter(product =>

                    product.name
                        .toLowerCase()
                        .includes(query)

                    ||

                    product.description
                        .toLowerCase()
                        .includes(query)

                    ||

                    product.category
                        .toLowerCase()
                        .includes(query)

                );

        }


        if (!products.length) {

            grid.innerHTML = "";

            if (noResults) {
                noResults.style.display =
                    "block";
            }

            setText(
                "productCount",
                "0 products"
            );

            return;

        }


        if (noResults) {
            noResults.style.display =
                "none";
        }


        grid.innerHTML = "";


        products.forEach(product => {

            const card =
                document.createElement("article");


            card.className = "product";


            const image =
                adaptiveImage(
                    product.image,
                    config
                );


            card.innerHTML = `

                <div
                    class="product-image"
                    onclick="window.AdaptiveShop.openProductModal(${product.id})"
                >

                    <span class="product-badge">
                        ${escapeHTML(product.badge)}
                    </span>

                    <img
                        src="${escapeHTML(image)}"
                        alt="${escapeHTML(product.name)}"
                        loading="lazy"
                        decoding="async"
                        width="600"
                        height="450"
                    >

                </div>


                <div class="product-info">

                    <div class="product-meta-row">

                        <span class="product-category">
                            ${escapeHTML(product.category)}
                        </span>

                        <span class="product-rating">
                            ★
                            <b>
                                ${product.rating}
                            </b>

                            <small>
                                (${product.reviewsCount})
                            </small>
                        </span>

                    </div>


                    <h3
                        onclick="window.AdaptiveShop.openProductModal(${product.id})"
                    >
                        ${escapeHTML(product.name)}
                    </h3>


                    <p>
                        ${escapeHTML(product.description)}
                    </p>


                    <div class="product-bottom">

                        <strong class="product-price">
                            ${formatPrice(product.price)}
                        </strong>

                        <button
                            class="add-cart"
                            onclick="window.AdaptiveShop.addToCart(${product.id})"
                        >
                            Add +
                        </button>

                    </div>

                </div>

            `;


            grid.appendChild(card);

        });


        setText(
            "productCount",
            `${products.length} products`
        );

    }


    /* =====================================================
       RECOMMENDATIONS
       ===================================================== */

    function renderRecommendations(config) {

        const section =
            document.getElementById(
                "recommendations"
            );

        const grid =
            document.getElementById(
                "recommendationsGrid"
            );


        if (!section || !grid) return;


        if (
            config.recommendations === "OFF"
        ) {

            section.style.display =
                "none";

            return;

        }


        section.style.display =
            "block";


        grid.innerHTML = "";


        const count =
            config.tier === "HIGH"
                ? 3
                : 1;


        currentProducts
            .slice(0, count)
            .forEach(product => {

                const image =
                    adaptiveImage(
                        product.image,
                        config
                    );


                const card =
                    document.createElement("div");


                card.className =
                    "rec-card";


                card.innerHTML = `

                    <img
                        src="${escapeHTML(image)}"
                        alt="${escapeHTML(product.name)}"
                        loading="lazy"
                    >

                    <div class="rec-info">

                        <strong>
                            ${escapeHTML(product.name)}
                        </strong>

                        <span>
                            ${formatPrice(product.price)}
                        </span>

                    </div>

                    <button
                        class="rec-btn"
                        onclick="window.AdaptiveShop.addToCart(${product.id})"
                    >
                        + Add
                    </button>

                `;


                grid.appendChild(card);

            });

    }


    /* =====================================================
       UPDATE UI
       ===================================================== */

    function updateUI() {

        const config =
            getAdaptiveConfig();


        applyAdaptiveUI(config);


        renderProducts(config);

        renderRecommendations(config);


        if (
            window.AdaptiveEngine &&
            typeof window.AdaptiveEngine.detectNetwork ===
            "function"
        ) {

            const network =
                window.AdaptiveEngine
                    .detectNetwork();


            const device =
                window.AdaptiveEngine
                    .detectDevice();


            setText(
                "networkLevel",
                network.level || "—"
            );

            setText(
                "networkType",
                network.effectiveType || "—"
            );

            setText(
                "browserSpeed",
                network.browserEstimate != null
                    ? `${network.browserEstimate} Mbps`
                    : "Unavailable"
            );

            setText(
                "measuredSpeed",
                network.measuredBandwidth != null
                    ? `${network.measuredBandwidth} Mbps`
                    : "Unavailable"
            );


            setText(
                "deviceLevel",
                device.level || "—"
            );

            setText(
                "deviceType",
                device.formFactor || "—"
            );

            setText(
                "cpuCores",
                device.cores
                    ? `${device.cores} Cores`
                    : "—"
            );

            setText(
                "deviceMemory",
                device.memory != null
                    ? `${device.memory} GB`
                    : "Unavailable"
            );

            setText(
                "platform",
                device.platform || "—"
            );


            setText(
                "shopStatus",
                `${network.level || "—"} Network · ${device.level || "—"} Device → ${config.tier}`
            );

        }

    }


    /* =====================================================
       CATEGORY
       ===================================================== */

    function filterCategory(category) {

        activeCategory =
            category;


        document
            .querySelectorAll(".category-card")
            .forEach(card => {

                card.classList.toggle(
                    "active",
                    card.dataset.cat === category
                );

            });


        updateUI();

        scrollToProducts();

    }


    /* =====================================================
       SEARCH
       ===================================================== */

    function handleSearch(event) {

        searchQuery =
            event.target.value;


        const clear =
            document.getElementById(
                "clearSearchBtn"
            );


        if (clear) {

            clear.style.display =
                searchQuery
                    ? "block"
                    : "none";

        }


        updateUI();

    }


    function clearSearchFilter() {

        const input =
            document.getElementById(
                "productSearchInput"
            );


        if (input) {
            input.value = "";
        }


        searchQuery = "";

        activeCategory = "ALL";


        document
            .querySelectorAll(".category-card")
            .forEach(card => {

                card.classList.toggle(
                    "active",
                    card.dataset.cat === "ALL"
                );

            });


        const clear =
            document.getElementById(
                "clearSearchBtn"
            );


        if (clear) {
            clear.style.display = "none";
        }


        updateUI();

    }


    /* =====================================================
       CART
       ===================================================== */

    function addToCart(productId) {

        const product =
            currentProducts.find(
                item =>
                    String(item.id) ===
                    String(productId)
            );


        if (!product) return;


        if (cart.has(productId)) {

            cart.get(productId).quantity++;

        } else {

            cart.set(
                productId,
                {
                    product,
                    quantity: 1
                }
            );

        }


        updateCartUI();

        showToast(
            `${product.name} added to cart`
        );

    }


    function removeFromCart(productId) {

        cart.delete(productId);

        updateCartUI();

    }


    function updateCartQuantity(
        productId,
        change
    ) {

        const item =
            cart.get(productId);


        if (!item) return;


        item.quantity += change;


        if (item.quantity <= 0) {

            cart.delete(productId);

        }


        updateCartUI();

    }


    function updateCartUI() {

        let totalItems = 0;

        let subtotal = 0;


        cart.forEach(item => {

            totalItems +=
                item.quantity;

            subtotal +=
                item.product.price *
                item.quantity;

        });


        setText(
            "cartCount",
            totalItems
        );


        setText(
            "cartSubtotal",
            formatPrice(subtotal)
        );


        renderCart();

    }


    function renderCart() {

        const container =
            document.getElementById(
                "cartItemsList"
            );


        if (!container) return;


        if (!cart.size) {

            container.innerHTML = `

                <div class="cart-empty-state">

                    <span class="empty-icon">
                        🛒
                    </span>

                    <h3>
                        Your cart is empty
                    </h3>

                    <p>
                        Add products to start shopping.
                    </p>

                </div>

            `;

            return;

        }


        container.innerHTML = "";


        cart.forEach(
            ({ product, quantity }) => {

                const row =
                    document.createElement(
                        "div"
                    );


                row.className =
                    "cart-item-row";


                row.innerHTML = `

                    <img
                        src="${escapeHTML(product.image)}"
                        alt="${escapeHTML(product.name)}"
                    >

                    <div class="cart-item-details">

                        <strong>
                            ${escapeHTML(product.name)}
                        </strong>

                        <span class="cart-item-price">
                            ${formatPrice(product.price)}
                        </span>

                        <div class="cart-qty-controls">

                            <button
                                onclick="window.AdaptiveShop.updateCartQuantity(${product.id}, -1)"
                            >
                                −
                            </button>

                            <span>
                                ${quantity}
                            </span>

                            <button
                                onclick="window.AdaptiveShop.updateCartQuantity(${product.id}, 1)"
                            >
                                +
                            </button>

                        </div>

                    </div>

                    <button
                        class="cart-remove-btn"
                        onclick="window.AdaptiveShop.removeFromCart(${product.id})"
                    >
                        ✕
                    </button>

                `;


                container.appendChild(row);

            }
        );

    }


    function openCartDrawer() {

        const overlay =
            document.getElementById(
                "cartDrawerOverlay"
            );


        overlay?.classList.add(
            "active"
        );

    }


    function closeCartDrawer() {

        const overlay =
            document.getElementById(
                "cartDrawerOverlay"
            );


        overlay?.classList.remove(
            "active"
        );

    }


    /* =====================================================
       CHECKOUT
       ===================================================== */

    async function handleCheckout() {

        if (!cart.size) {

            showToast(
                "Your cart is empty"
            );

            return;

        }


        const items = [];

        let total = 0;


        cart.forEach(
            ({ product, quantity }) => {

                items.push({

                    productId:
                        product.id,

                    quantity:
                        quantity,

                    unitPrice:
                        product.price

                });


                total +=
                    product.price *
                    quantity;

            }
        );


        if (isBackendAvailable) {

            try {

                await fetch(
                    `${API_BASE_URL}/orders`,
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({

                                customerName:
                                    "Hackathon Demo User",

                                customerEmail:
                                    "demo@adaptiveshop.io",

                                items

                            })

                    }
                );

            } catch {

                // graceful fallback

            }

        }


        cart.clear();

        updateCartUI();

        closeCartDrawer();


        showToast(
            `Order confirmed • ${formatPrice(total)}`
        );

    }


    /* =====================================================
       PRODUCT MODAL
       ===================================================== */

    function openProductModal(productId) {

        const product =
            currentProducts.find(
                item =>
                    String(item.id) ===
                    String(productId)
            );


        if (!product) return;


        const overlay =
            document.getElementById(
                "productModalOverlay"
            );


        const content =
            document.getElementById(
                "productModalContent"
            );


        if (!overlay || !content) return;


        const specs =
            (product.specs || [])
                .map(
                    spec =>
                        `<li>✓ ${escapeHTML(spec)}</li>`
                )
                .join("");


        content.innerHTML = `

            <div class="product-modal-image">

                <img
                    src="${escapeHTML(product.image)}"
                    alt="${escapeHTML(product.name)}"
                >

            </div>


            <div class="product-modal-info">

                <span class="product-badge">
                    ${escapeHTML(product.badge)}
                </span>

                <span class="product-category">
                    ${escapeHTML(product.category)}
                </span>

                <h2>
                    ${escapeHTML(product.name)}
                </h2>

                <div class="product-modal-rating">

                    ★
                    <b>${product.rating}</b>
                    / 5.0

                    ·

                    ${product.reviewsCount}
                    reviews

                </div>

                <p class="product-modal-desc">
                    ${escapeHTML(product.description)}
                </p>

                <ul class="product-modal-specs">
                    ${specs}
                </ul>

                <div class="product-modal-bottom">

                    <strong class="product-modal-price">
                        ${formatPrice(product.price)}
                    </strong>

                    <button
                        class="hero-button"
                        onclick="
                            window.AdaptiveShop.addToCart(${product.id});
                            window.AdaptiveShop.closeProductModal();
                        "
                    >
                        Add to Cart
                    </button>

                </div>

            </div>

        `;


        overlay.classList.add(
            "active"
        );

    }


    function closeProductModal() {

        document
            .getElementById(
                "productModalOverlay"
            )
            ?.classList.remove(
                "active"
            );

    }


    /* =====================================================
       CONFIG
       ===================================================== */

    function openConfigModal() {

        document
            .getElementById(
                "configOverlay"
            )
            ?.classList.add(
                "active"
            );

    }


    function closeConfigModal() {

        document
            .getElementById(
                "configOverlay"
            )
            ?.classList.remove(
                "active"
            );

    }


    /* =====================================================
       TOAST
       ===================================================== */

    function showToast(message) {

        const container =
            document.getElementById(
                "toastContainer"
            );


        if (!container) return;


        const toast =
            document.createElement(
                "div"
            );


        toast.className =
            "toast";


        toast.textContent =
            message;


        container.appendChild(
            toast
        );


        setTimeout(() => {

            toast.style.opacity =
                "0";

            toast.style.transform =
                "translateY(10px)";


            setTimeout(
                () => toast.remove(),
                300
            );

        }, 2300);

    }


    /* =====================================================
       SCROLL
       ===================================================== */

    function scrollToProducts() {

        document
            .getElementById("products")
            ?.scrollIntoView({
                behavior: "smooth"
            });

    }


    /* =====================================================
       TELEMETRY
       ===================================================== */

    function updateTelemetryUI(
        telemetry
    ) {

        if (!telemetry) return;


        if (
            typeof telemetry.lcp ===
            "number"
        ) {

            setText(
                "perfLCP",
                `${telemetry.lcp}s`
            );

        }


        if (
            typeof telemetry.inp ===
            "number"
        ) {

            setText(
                "perfINP",
                `${telemetry.inp}ms`
            );

        }


        if (
            typeof telemetry.cls ===
            "number"
        ) {

            setText(
                "perfCLS",
                telemetry.cls.toFixed(3)
            );

        }


        if (
            typeof telemetry.pageLoad ===
            "number"
        ) {

            setText(
                "perfPageLoad",
                `${telemetry.pageLoad}ms`
            );

        }


        if (
            typeof telemetry.totalTransferBytes ===
            "number"
        ) {

            setText(
                "perfTransferSize",
                `${(
                    telemetry.totalTransferBytes /
                    1024
                ).toFixed(1)} KB`
            );

        }


        if (
            typeof telemetry.resourceCount ===
            "number"
        ) {

            setText(
                "perfResourceCount",
                telemetry.resourceCount
            );

        }

    }


    /* =====================================================
       TEXT HELPER
       ===================================================== */

    function setText(
        id,
        value
    ) {

        const element =
            document.getElementById(id);


        if (element) {

            element.textContent =
                value;

        }

    }


    /* =====================================================
       EVENT LISTENERS
       ===================================================== */

    function init() {


        /* Search */

        document
            .getElementById(
                "productSearchInput"
            )
            ?.addEventListener(
                "input",
                handleSearch
            );


        document
            .getElementById(
                "clearSearchBtn"
            )
            ?.addEventListener(
                "click",
                clearSearchFilter
            );


        /* Cart */

        document
            .getElementById(
                "cartButton"
            )
            ?.addEventListener(
                "click",
                openCartDrawer
            );


        document
            .getElementById(
                "closeCartDrawer"
            )
            ?.addEventListener(
                "click",
                closeCartDrawer
            );


        document
            .getElementById(
                "cartDrawerOverlay"
            )
            ?.addEventListener(
                "click",
                event => {

                    if (
                        event.target.id ===
                        "cartDrawerOverlay"
                    ) {

                        closeCartDrawer();

                    }

                }
            );


        document
            .getElementById(
                "checkoutButton"
            )
            ?.addEventListener(
                "click",
                handleCheckout
            );


        /* Product Modal */

        document
            .getElementById(
                "closeProductModal"
            )
            ?.addEventListener(
                "click",
                closeProductModal
            );


        document
            .getElementById(
                "productModalOverlay"
            )
            ?.addEventListener(
                "click",
                event => {

                    if (
                        event.target.id ===
                        "productModalOverlay"
                    ) {

                        closeProductModal();

                    }

                }
            );


        /* Config */

        document
            .getElementById(
                "configButton"
            )
            ?.addEventListener(
                "click",
                openConfigModal
            );


        document
            .getElementById(
                "closeConfig"
            )
            ?.addEventListener(
                "click",
                closeConfigModal
            );


        document
            .getElementById(
                "configOverlay"
            )
            ?.addEventListener(
                "click",
                event => {

                    if (
                        event.target.id ===
                        "configOverlay"
                    ) {

                        closeConfigModal();

                    }

                }
            );


        /* Escape */

        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key ===
                    "Escape"
                ) {

                    closeCartDrawer();
                    closeProductModal();
                    closeConfigModal();

                }

            }
        );


        /* Network changes */

        window.addEventListener(
            "online",
            () => {

                updateUI();

                showToast(
                    "Network connection restored"
                );

            }
        );


        window.addEventListener(
            "offline",
            () => {

                updateUI();

                showToast(
                    "Offline mode detected"
                );

            }
        );


        const connection =
            navigator.connection ||
            navigator.mozConnection ||
            navigator.webkitConnection;


        connection?.addEventListener(
            "change",
            updateUI
        );


        /* Adaptive
