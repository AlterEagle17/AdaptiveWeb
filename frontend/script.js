"use strict";

/* ============================================================
   ADAPTIVESHOP
   NETWORK + DEVICE ADAPTIVE ENGINE
============================================================ */

const API_BASE_URL =
    "https://adaptiveweb.onrender.com/api";


/* ============================================================
   HELPERS
============================================================ */

const $ = id =>
    document.getElementById(id);


function escapeHTML(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


function money(value) {

    return "₹" +
        Number(value || 0).toLocaleString("en-IN");

}


/* ============================================================
   STATE
============================================================ */

let products = [];

let cart = [];

let activeCategory = "ALL";

let searchTerm = "";

let networkSetting = "AUTO";

let deviceSetting = "AUTO";

let currentNetwork = null;

let currentDevice = null;

let currentConfig = null;

let measuredBandwidth = null;


/* ============================================================
   FALLBACK PRODUCTS
============================================================ */

const fallbackProducts = [

    {
        id: 1,
        name: "Nova X Pro",
        category: "SMARTPHONES",
        price: 64999,
        rating: 4.8,
        reviews: 1284,
        badge: "BESTSELLER",
        description:
            "Flagship smartphone with a high-refresh display and powerful processor.",
        image:
            "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1000&q=85"
    },

    {
        id: 2,
        name: "Pixel Edge",
        category: "SMARTPHONES",
        price: 54999,
        rating: 4.7,
        reviews: 932,
        badge: "NEW",
        description:
            "Clean premium smartphone designed for photography and everyday performance.",
        image:
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=85"
    },

    {
        id: 3,
        name: "AeroBook Pro",
        category: "LAPTOPS",
        price: 89999,
        rating: 4.9,
        reviews: 764,
        badge: "PRO",
        description:
            "Powerful laptop for development, productivity and creative workloads.",
        image:
            "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1000&q=85"
    },

    {
        id: 4,
        name: "UltraBook Air",
        category: "LAPTOPS",
        price: 74999,
        rating: 4.6,
        reviews: 541,
        badge: "LIGHT",
        description:
            "Slim and lightweight laptop designed for students and professionals.",
        image:
            "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1000&q=85"
    },

    {
        id: 5,
        name: "Sonic Max",
        category: "AUDIO",
        price: 12999,
        rating: 4.8,
        reviews: 2187,
        badge: "POPULAR",
        description:
            "Premium wireless headphones with immersive audio and long battery life.",
        image:
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=85"
    },

    {
        id: 6,
        name: "Studio Buds",
        category: "AUDIO",
        price: 7999,
        rating: 4.5,
        reviews: 1452,
        badge: "HOT",
        description:
            "Compact wireless earbuds with clear sound and active noise cancellation.",
        image:
            "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=1000&q=85"
    },

    {
        id: 7,
        name: "FitWatch X",
        category: "ACCESSORIES",
        price: 8999,
        rating: 4.4,
        reviews: 876,
        badge: "SMART",
        description:
            "Smart wearable with fitness tracking, notifications and health insights.",
        image:
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=85"
    },

    {
        id: 8,
        name: "PowerDock",
        category: "ACCESSORIES",
        price: 3999,
        rating: 4.3,
        reviews: 632,
        badge: "VALUE",
        description:
            "Compact multi-device charging dock for your everyday setup.",
        image:
            "https://images.unsplash.com/photo-1609592424984-4b8b1b5c7b8d?auto=format&fit=crop&w=1000&q=85"
    }

];


/* ============================================================
   NETWORK DETECTION
============================================================ */

function getConnection() {

    return (
        navigator.connection ||
        navigator.mozConnection ||
        navigator.webkitConnection ||
        null
    );

}


function detectNetwork() {

    const connection = getConnection();

    const online =
        navigator.onLine !== false;

    const effectiveType =
        connection?.effectiveType ||
        "unknown";

    const downlink =
        typeof connection?.downlink === "number"
            ? connection.downlink
            : null;

    const rtt =
        typeof connection?.rtt === "number"
            ? connection.rtt
            : null;

    const saveData =
        Boolean(connection?.saveData);


    const speed =
        measuredBandwidth ??
        downlink;


    let level = "MEDIUM";


    if (
        !online ||
        saveData ||
        effectiveType === "slow-2g" ||
        effectiveType === "2g" ||
        (speed !== null && speed < 1.5) ||
        (rtt !== null && rtt >= 400)
    ) {

        level = "LOW";

    }
    else if (
        speed !== null &&
        speed >= 5 &&
        (rtt === null || rtt < 150)
    ) {

        level = "HIGH";

    }


    return {
        level,
        online,
        effectiveType,
        downlink,
        rtt,
        saveData,
        measuredBandwidth
    };

}


/* ============================================================
   BANDWIDTH TEST
============================================================ */

async function measureBandwidth() {

    try {

        const start =
            performance.now();

        const response =
            await fetch(
                "assets/network-test.bin?t=" +
                Date.now(),
                {
                    cache: "no-store"
                }
            );

        if (!response.ok) {
            throw new Error("Speed test failed");
        }


        const buffer =
            await response.arrayBuffer();


        const seconds =
            (performance.now() - start) / 1000;


        if (seconds > 0) {

            measuredBandwidth =
                Number(
                    (
                        buffer.byteLength *
                        8 /
                        seconds /
                        1000000
                    ).toFixed(2)
                );

        }

    }
    catch {

        measuredBandwidth = null;

    }

}


/* ============================================================
   DEVICE DETECTION
============================================================ */

function detectDevice() {

    const cores =
        navigator.hardwareConcurrency || 4;

    const memory =
        navigator.deviceMemory || null;


    let level = "MEDIUM";


    if (
        cores >= 8 &&
        (memory === null || memory >= 8)
    ) {

        level = "HIGH";

    }
    else if (
        cores < 4 ||
        (memory !== null && memory < 4)
    ) {

        level = "LOW";

    }


    let platform =
        navigator.userAgentData?.platform ||
        navigator.platform ||
        "Unknown";


    return {
        level,
        cores,
        memory,
        platform
    };

}


/* ============================================================
   ADAPTIVE DECISION
============================================================ */

function calculateAdaptiveMode(
    network,
    device
) {

    /*
        LOW + anything
        = LOW
    */

    if (
        network === "LOW" ||
        device === "LOW"
    ) {

        return {

            tier: "LOW",

            mode: "LIGHTWEIGHT",

            imageWidth: 320,

            imageQuality: 40,

            animations: "OFF",

            effects3D: "OFF",

            prefetch: "OFF",

            recommendations: "OFF",

            jsStrategy: "ESSENTIAL",

            description:
                "Lightweight mode. Compressed images, essential JavaScript and no heavy visual effects."

        };

    }


    /*
        HIGH + HIGH
        = HIGH
    */

    if (
        network === "HIGH" &&
        device === "HIGH"
    ) {

        return {

            tier: "HIGH",

            mode: "FULL EXPERIENCE",

            imageWidth: 1000,

            imageQuality: 85,

            animations: "FULL",

            effects3D: "FULL",

            prefetch: "ON",

            recommendations: "ON",

            jsStrategy: "FULL",

            description:
                "Premium mode. High-quality images, 3D hover, animated background and proactive prefetching."

        };

    }


    /*
        Everything else
        = MEDIUM
    */

    return {

        tier: "MEDIUM",

        mode: "BALANCED",

        imageWidth: 600,

        imageQuality: 65,

        animations: "REDUCED",

        effects3D: "OFF",

        prefetch: "OFF",

        recommendations: "LIMITED",

        jsStrategy: "BALANCED",

        description:
            "Balanced mode. Medium images and subtle hover effects with restrained JavaScript."

    };

}


/* ============================================================
   IMAGE ADAPTATION
============================================================ */

function getAdaptiveImageURL(
    url,
    config
) {

    if (!url) {
        return "";
    }


    let result = url;


    if (/w=\d+/i.test(result)) {

        result =
            result.replace(
                /w=\d+/i,
                `w=${config.imageWidth}`
            );

    }


    if (/q=\d+/i.test(result)) {

        result =
            result.replace(
                /q=\d+/i,
                `q=${config.imageQuality}`
            );

    }


    return result;

}


/* ============================================================
   PREFETCH
============================================================ */

function applyPrefetch(config) {

    const old =
        $("adaptivePrefetch");

    if (old) {
        old.remove();
    }


    if (
        config.prefetch !== "ON" ||
        !products.length
    ) {

        return;

    }


    const first =
        products[0];


    const link =
        document.createElement("link");


    link.id =
        "adaptivePrefetch";

    link.rel =
        "prefetch";

    link.as =
        "image";

    link.href =
        getAdaptiveImageURL(
            first.image,
            config
        );


    document.head.appendChild(link);

}


/* ============================================================
   APPLY VISUAL MODE
============================================================ */

function applyVisualMode(config) {

    document.body.classList.remove(
        "high-mode",
        "medium-mode",
        "low-mode"
    );


    document.body.classList.add(
        config.tier.toLowerCase() + "-mode"
    );


    const recommendationSection =
        $("recommendations");


    if (recommendationSection) {

        recommendationSection.style.display =
            config.recommendations === "OFF"
                ? "none"
                : "";

    }

}


/* ============================================================
   CONFIG PANEL UPDATE
============================================================ */

function updateConfigPanel(
    network,
    device,
    config
) {

    if ($("detectedNetwork")) {

        $("detectedNetwork").textContent =
            `Detected: ${network}`;

    }


    if ($("detectedDevice")) {

        $("detectedDevice").textContent =
            `Detected: ${device}`;

    }


    if ($("deliveryBadge")) {

        $("deliveryBadge").textContent =
            config.tier;

    }


    if ($("deliveryMode")) {

        $("deliveryMode").textContent =
            config.mode;

    }


    if ($("deliveryDescription")) {

        $("deliveryDescription").textContent =
            config.description;

    }


    if ($("detailImages")) {

        $("detailImages").textContent =
            `${config.imageWidth}px / q${config.imageQuality}`;

    }


    if ($("detailJS")) {

        $("detailJS").textContent =
            config.jsStrategy;

    }


    if ($("detailAnimations")) {

        $("detailAnimations").textContent =
            config.animations;

    }


    if ($("detailPrefetch")) {

        $("detailPrefetch").textContent =
            config.prefetch;

    }


    if ($("detailNetwork")) {

        $("detailNetwork").textContent =
            network;

    }


    if ($("detailDevice")) {

        $("detailDevice").textContent =
            device;

    }


    if ($("shopStatus")) {

        $("shopStatus").textContent =
            `${config.tier} · ${network} network · ${device} device`;

    }


    if ($("productMode")) {

        $("productMode").textContent =
            `${config.tier} delivery · ${config.imageWidth}px images · ${config.animations} animation`;

    }

}


/* ============================================================
   CURRENT CONDITIONS
============================================================ */

function getSelectedNetwork() {

    return networkSetting === "AUTO"
        ? currentNetwork.level
        : networkSetting;

}


function getSelectedDevice() {

    return deviceSetting === "AUTO"
        ? currentDevice.level
        : deviceSetting;

}


function updateAdaptiveEngine() {

    currentNetwork =
        detectNetwork();

    currentDevice =
        detectDevice();


    const network =
        getSelectedNetwork();

    const device =
        getSelectedDevice();


    currentConfig =
        calculateAdaptiveMode(
            network,
            device
        );


    applyVisualMode(
        currentConfig
    );


    applyPrefetch(
        currentConfig
    );


    renderProducts();

    renderRecommendations();


    updateConfigPanel(
        network,
        device,
        currentConfig
    );

}


/* ============================================================
   PRODUCT RENDERING
============================================================ */

function getFilteredProducts() {

    return products.filter(product => {

        const categoryMatch =
            activeCategory === "ALL" ||
            String(product.category).toUpperCase() ===
            activeCategory;


        const text =
            (
                product.name +
                " " +
                product.category +
                " " +
                product.description
            ).toLowerCase();


        const searchMatch =
            !searchTerm ||
            text.includes(
                searchTerm.toLowerCase()
            );


        return (
            categoryMatch &&
            searchMatch
        );

    });

}


function renderProducts() {

    const grid =
        $("productGrid");

    if (!grid) {
        return;
    }


    const list =
        getFilteredProducts();


    grid.innerHTML =
        list.map(product => {

            const image =
                getAdaptiveImageURL(
                    product.image,
                    currentConfig
                );


            return `

                <article
                    class="product"
                    data-id="${product.id}"
                >

                    <div
                        class="product-image"
                        data-product="${product.id}"
                    >

                        <img
                            src="${escapeHTML(image)}"
                            alt="${escapeHTML(product.name)}"
                            loading="lazy"
                            onerror="this.onerror=null;this.src='https://placehold.co/1000x700/eef5ff/2874f0?text=AdaptiveShop';"
                        >

                        <span class="product-badge">
                            ${escapeHTML(product.badge || "FEATURED")}
                        </span>

                    </div>


                    <div class="product-info">

                        <div class="product-top">

                            <span class="product-category">
                                ${escapeHTML(product.category)}
                            </span>

                            <span class="product-rating">
                                ⭐ ${product.rating}
                            </span>

                        </div>


                        <h3>
                            ${escapeHTML(product.name)}
                        </h3>


                        <p class="product-description">
                            ${escapeHTML(product.description)}
                        </p>


                        <div class="product-bottom">

                            <strong class="product-price">
                                ${money(product.price)}
                            </strong>

                            <button
                                class="add-cart"
                                data-add="${product.id}"
                            >
                                Add to Cart
                            </button>

                        </div>

                    </div>

                </article>

            `;

        }).join("");


    if ($("productCount")) {

        $("productCount").textContent =
            `${list.length} products`;

    }


    if ($("noResults")) {

        $("noResults").style.display =
            list.length
                ? "none"
                : "block";

    }

}


/* ============================================================
   RECOMMENDATIONS
============================================================ */

function renderRecommendations() {

    const grid =
        $("recommendationGrid");

    if (!grid) {
        return;
    }


    if (
        currentConfig?.recommendations === "OFF"
    ) {

        grid.innerHTML = "";

        return;

    }


    const count =
        currentConfig?.tier === "HIGH"
            ? 4
            : 2;


    grid.innerHTML =
        products
            .slice(0,count)
            .map(product => {

                const image =
                    getAdaptiveImageURL(
                        product.image,
                        currentConfig
                    );


                return `

                    <div class="rec-card">

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
                                ${money(product.price)}
                            </span>

                        </div>

                        <button
                            class="rec-btn"
                            data-rec-add="${product.id}"
                        >
                            Add
                        </button>

                    </div>

                `;

            }).join("");

}


/* ============================================================
   BACKEND
============================================================ */

async function loadProducts() {

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/products`,
                {
                    signal:
                        AbortSignal.timeout(4000)
                }
            );


        if (!response.ok) {
            throw new Error("Backend unavailable");
        }


        const data =
            await response.json();


        if (Array.isArray(data) && data.length) {

            products =
                data;

        }
        else {

            products =
                fallbackProducts;

        }

    }
    catch {

        console.warn(
            "[AdaptiveShop] Backend unavailable. Using local catalog."
        );


        products =
            fallbackProducts;

    }


    renderProducts();

    renderRecommendations();

}


/* ============================================================
   CATEGORY
============================================================ */

function setupCategories() {

    document
        .querySelectorAll(".category-card")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".category-card"
                        )
                        .forEach(
                            item =>
                                item.classList.remove(
                                    "active"
                                )
                        );


                    button.classList.add(
                        "active"
                    );


                    activeCategory =
                        button.dataset.category;


                    renderProducts();

                }
            );

        });

}


/* ============================================================
   SEARCH
============================================================ */

function setupSearch() {

    $("searchInput")
        ?.addEventListener(
            "input",
            event => {

                searchTerm =
                    event.target.value.trim();

                renderProducts();

            }
        );

}


/* ============================================================
   CONFIG OPTIONS
============================================================ */

function setupConfigOptions() {

    document
        .querySelectorAll(".network-option")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".network-option"
                        )
                        .forEach(
                            item =>
                                item.classList.remove(
                                    "active"
                                )
                        );


                    button.classList.add(
                        "active"
                    );


                    networkSetting =
                        button.dataset.value;


                    updateAdaptiveEngine();

                }
            );

        });


    document
        .querySelectorAll(".device-option")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".device-option"
                        )
                        .forEach(
                            item =>
                                item.classList.remove(
                                    "active"
                                )
                        );


                    button.classList.add(
                        "active"
                    );


                    deviceSetting =
                        button.dataset.value;


                    updateAdaptiveEngine();

                }
            );

        });

}


/* ============================================================
   CONFIG
============================================================ */

function openConfig() {

    updateAdaptiveEngine();

    $("configOverlay")
        ?.classList.add("active");

}


function closeConfig() {

    $("configOverlay")
        ?.classList.remove("active");

}


function setupConfig() {

    $("configButton")
        ?.addEventListener(
            "click",
            openConfig
        );


    $("heroConfigButton")
        ?.addEventListener(
            "click",
            openConfig
        );


    $("statusConfigButton")
        ?.addEventListener(
            "click",
            openConfig
        );


    $("closeConfig")
        ?.addEventListener(
            "click",
            closeConfig
        );


    $("configOverlay")
        ?.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    $("configOverlay")
                ) {

                    closeConfig();

                }

            }
        );

}


/* ============================================================
   PRODUCT MODAL
============================================================ */

function openProduct(id) {

    const product =
        products.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!product) {
        return;
    }


    const image =
        getAdaptiveImageURL(
            product.image,
            currentConfig
        );


    $("productModalContent").innerHTML = `

        <div class="product-modal-content">

            <div class="product-modal-image">

                <img
                    src="${escapeHTML(image)}"
                    alt="${escapeHTML(product.name)}"
                >

            </div>


            <div class="product-modal-info">

                <span class="product-category">
                    ${escapeHTML(product.category)}
                </span>

                <h2>
                    ${escapeHTML(product.name)}
                </h2>

                <p>
                    ${escapeHTML(product.description)}
                </p>

                <p>
                    ⭐ ${product.rating}
                    · ${product.reviews} reviews
                </p>

                <strong class="modal-price">
                    ${money(product.price)}
                </strong>

                <button
                    class="primary-button"
                    data-modal-add="${product.id}"
                >
                    Add to Cart
                </button>

            </div>

        </div>

    `;


    $("productOverlay")
        ?.classList.add("active");

}


function closeProduct() {

    $("productOverlay")
        ?.classList.remove("active");

}


function setupProductEvents() {

    $("productGrid")
        ?.addEventListener(
            "click",
            event => {

                const add =
                    event.target.closest(
                        "[data-add]"
                    );


                if (add) {

                    addToCart(
                        add.dataset.add
                    );

                    return;

                }


                const card =
                    event.target.closest(
                        ".product"
                    );


                if (card) {

                    openProduct(
                        card.dataset.id
                    );

                }

            }
        );


    $("productOverlay")
        ?.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    $("productOverlay")
                ) {

                    closeProduct();

                }

            }
        );


    $("closeProduct")
        ?.addEventListener(
            "click",
            closeProduct
        );

}


/* ============================================================
   CART
============================================================ */

function addToCart(id) {

    const product =
        products.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!product) {
        return;
    }


    cart.push(product);

    updateCart();

    showToast(
        `${product.name} added to cart`
    );

}


function updateCart() {

    $("cartCount").textContent =
        cart.length;


    const container =
        $("cartItems");


    if (!container) {
        return;
    }


    if (!cart.length) {

        container.innerHTML = `

            <div class="cart-empty">

                🛒

                <h3>
                    Your cart is empty
                </h3>

            </div>

        `;


        $("cartTotal").textContent =
            "₹0";


        return;

    }


    let total = 0;


    container.innerHTML =
        cart.map(
            (product,index) => {

                total +=
                    Number(product.price);


                const image =
                    getAdaptiveImageURL(
                        product.image,
                        currentConfig
                    );


                return `

                    <div class="cart-item">

                        <img
                            src="${escapeHTML(image)}"
                            alt="${escapeHTML(product.name)}"
                        >

                        <div class="cart-item-info">

                            <strong>
                                ${escapeHTML(product.name)}
                            </strong>

                            <span>
                                ${money(product.price)}
                            </span>

                        </div>

                        <button
                            class="remove-cart"
                            data-remove="${index}"
                        >
                            ×
                        </button>

                    </div>

                `;

            }
        ).join("");


    $("cartTotal").textContent =
        money(total);

}


function setupCart() {

    $("cartButton")
        ?.addEventListener(
            "click",
            () => {

                $("cartOverlay")
                    ?.classList.add("active");

            }
        );


    $("closeCart")
        ?.addEventListener(
            "click",
            () => {

                $("cartOverlay")
                    ?.classList.remove("active");

            }
        );


    $("cartOverlay")
        ?.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    $("cartOverlay")
                ) {

                    $("cartOverlay")
                        .classList.remove("active");

                }

            }
        );


    $("cartItems")
        ?.addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest(
                        "[data-remove]"
                    );


                if (!button) {
                    return;
                }


                cart.splice(
                    Number(button.dataset.remove),
                    1
                );


                updateCart();

            }
        );


    $("checkoutButton")
        ?.addEventListener(
            "click",
            () => {

                if (!cart.length) {

                    showToast(
                        "Your cart is empty"
                    );

                    return;

                }


                cart = [];

                updateCart();


                $("cartOverlay")
                    ?.classList.remove(
                        "active"
                    );


                showToast(
                    "Demo order completed successfully!"
                );

            }
        );

}


/* ============================================================
   RECOMMENDATION + MODAL EVENTS
============================================================ */

document.addEventListener(
    "click",
    event => {

        const recommendation =
            event.target.closest(
                "[data-rec-add]"
            );


        if (recommendation) {

            addToCart(
                recommendation.dataset.recAdd
            );

        }


        const modalAdd =
            event.target.closest(
                "[data-modal-add]"
            );


        if (modalAdd) {

            addToCart(
                modalAdd.dataset.modalAdd
            );

            closeProduct();

        }

    }
);


/* ============================================================
   HIGH MODE POINTER TILT
============================================================ */

function setupHighModeTilt() {

    const grid =
        $("productGrid");


    if (!grid) {
        return;
    }


    grid.addEventListener(
        "pointermove",
        event => {

            if (
                !document.body.classList.contains(
                    "high-mode"
                )
            ) {

                return;

            }


            const card =
                event.target.closest(
                    ".product"
                );


            if (!card) {
                return;
            }


            const rect =
                card.getBoundingClientRect();


            const x =
                (event.clientX - rect.left) /
                rect.width;


            const y =
                (event.clientY - rect.top) /
                rect.height;


            const rotateY =
                (x - .5) * 7;


            const rotateX =
                (y - .5) * -5;


            card.style.transform =
                `
                translateY(-12px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                scale(1.025)
                `;

        }
    );


    grid.addEventListener(
        "pointerout",
        event => {

            const card =
                event.target.closest(
                    ".product"
                );


            if (
                card &&
                !card.contains(
                    event.relatedTarget
                )
            ) {

                card.style.transform =
                    "";

            }

        }
    );

}


/* ============================================================
   TOAST
============================================================ */

function showToast(message) {

    const container =
        $("toastContainer");


    if (!container) {
        return;
    }


    const toast =
        document.createElement("div");


    toast.className =
        "toast";


    toast.textContent =
        message;


    container.appendChild(
        toast
    );


    setTimeout(
        () => toast.remove(),
        2200
    );

}


/* ============================================================
   PERFORMANCE TELEMETRY
============================================================ */

function setupPerformanceTelemetry() {

    if (!window.PerformanceObserver) {
        return;
    }


    /* LCP */

    try {

        const observer =
            new PerformanceObserver(
                list => {

                    const entries =
                        list.getEntries();


                    const last =
                        entries[
                            entries.length - 1
                        ];


                    if (
                        last &&
                        $("metricLCP")
                    ) {

                        $("metricLCP")
                            .textContent =
                            `${Math.round(
                                last.startTime
                            )} ms`;

                    }

                }
            );


        observer.observe({
            type:
                "largest-contentful-paint",
            buffered:
                true
        });

    }
    catch {}


    /* CLS */

    try {

        let cls = 0;


        const observer =
            new PerformanceObserver(
                list => {

                    list.getEntries()
                        .forEach(entry => {

                            if (
                                !entry.hadRecentInput
                            ) {

                                cls +=
                                    entry.value;

                            }

                        });


                    if ($("metricCLS")) {

                        $("metricCLS")
                            .textContent =
                            cls.toFixed(3);

                    }

                }
            );


        observer.observe({
            type:
                "layout-shift",
            buffered:
                true
        });

    }
    catch {}


    /*
        INP-style event measurement.
        Uses PerformanceEventTiming entries.
    */

    try {

        let longestInteraction = 0;


        const observer =
            new PerformanceObserver(
                list => {

                    list.getEntries()
                        .forEach(entry => {

                            longestInteraction =
                                Math.max(
                                    longestInteraction,
                                    entry.duration || 0
                                );

                        });


                    if (
                        $("metricINP") &&
                        longestInteraction > 0
                    ) {

                        $("metricINP")
                            .textContent =
                            `${Math.round(
                                longestInteraction
                            )} ms`;

                    }

                }
            );


        observer.observe({
            type:
                "event",
            buffered:
                true,
            durationThreshold:
                40
        });

    }
    catch {}


    /* Navigation + Resources */

    window.addEventListener(
        "load",
        () => {

            setTimeout(
                () => {

                    const navigation =
                        performance.getEntriesByType(
                            "navigation"
                        )[0];


                    if (
                        navigation &&
                        $("metricLoad")
                    ) {

                        $("metricLoad")
                            .textContent =
                            `${Math.round(
                                navigation.loadEventEnd -
                                navigation.startTime
                            )} ms`;

                    }


                    const resources =
                        performance.getEntriesByType(
                            "resource"
                        );


                    let totalBytes = 0;


                    resources.forEach(
                        resource => {

                            totalBytes +=
                                resource.transferSize ||
                                resource.encodedBodySize ||
                                0;

                        }
                    );


                    if ($("metricTransfer")) {

                        $("metricTransfer")
                            .textContent =
                            `${(
                                totalBytes /
                                1024
                            ).toFixed(1)} KB`;

                    }


                    if ($("metricResources")) {

                        $("metricResources")
                            .textContent =
                            resources.length;

                    }

                },
                500
            );

        }
    );

}


/* ============================================================
   NETWORK LISTENERS
============================================================ */

function setupNetworkListeners() {

    const connection =
        getConnection();


    if (connection) {

        connection.addEventListener(
            "change",
            () => {

                if (
                    networkSetting === "AUTO"
                ) {

                    updateAdaptiveEngine();

                }

            }
        );

    }


    window.addEventListener(
        "online",
        () => {

            if (
                networkSetting === "AUTO"
            ) {

                updateAdaptiveEngine();

            }

        }
    );


    window.addEventListener(
        "offline",
        () => {

            if (
                networkSetting === "AUTO"
            ) {

                updateAdaptiveEngine();

            }

        }
    );

}


/* ============================================================
   ESCAPE KEY
============================================================ */

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            closeConfig();

            closeProduct();

            $("cartOverlay")
                ?.classList.remove(
                    "active"
                );

        }

    }
);


/* ============================================================
   EXPLORE
============================================================ */

function setupExplore() {

    $("exploreButton")
        ?.addEventListener(
            "click",
            () => {

                $("products")
                    ?.scrollIntoView({
                        behavior: "smooth"
                    });

            }
        );

}


/* ============================================================
   INITIALIZATION
============================================================ */

async function init() {

    setupConfig();

    setupConfigOptions();

    setupCategories();

    setupSearch();

    setupProductEvents();

    setupCart();

    setupHighModeTilt();

    setupNetworkListeners();

    setupPerformanceTelemetry();

    setupExplore();


    /*
        Detect first.
    */

    currentNetwork =
        detectNetwork();

    currentDevice =
        detectDevice();


    /*
        Load products.
    */

    await loadProducts();


    /*
        Optional active bandwidth test.
        Does not block initial UI.
    */

    measureBandwidth()
        .then(() => {

            if (
                networkSetting === "AUTO"
            ) {

                updateAdaptiveEngine();

            }

        });


    updateAdaptiveEngine();


    updateCart();


    console.log(
        "[AdaptiveWeb] AdaptiveShop initialized"
    );

}


init();
