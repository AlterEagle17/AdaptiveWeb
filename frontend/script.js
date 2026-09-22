"use strict";


/* ============================================================
   CONFIG
============================================================ */

const API_BASE_URL =
    window.API_BASE_URL ||
    "https://adaptiveweb.onrender.com/api";


/* ============================================================
   STATE
============================================================ */

let products = [];

let activeCategory = "ALL";

let searchText = "";

let cart = [];

let networkSetting = "AUTO";

let deviceSetting = "AUTO";

let detectedNetwork = "MEDIUM";

let detectedDevice = "MEDIUM";

let currentMode = "MEDIUM";

let currentConfig = null;



/* ============================================================
   FALLBACK PRODUCTS
============================================================ */

const fallbackProducts = [

    {
        id: 1,
        name: "Nova X Pro 5G",
        category: "SMARTPHONES",
        price: 69999,
        rating: 4.9,
        reviews: 342,
        badge: "FLAGSHIP",
        description:
            "Premium smartphone with OLED display and advanced camera system.",
        image:
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=85"
    },

    {
        id: 2,
        name: "UltraBook Pro 16",
        category: "LAPTOPS",
        price: 149999,
        rating: 4.8,
        reviews: 189,
        badge: "PRO POWER",
        description:
            "High-performance laptop for creators, developers and professionals.",
        image:
            "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1000&q=85"
    },

    {
        id: 3,
        name: "Sonic Pro Wireless ANC",
        category: "AUDIO",
        price: 18999,
        rating: 4.9,
        reviews: 512,
        badge: "HI-RES AUDIO",
        description:
            "Premium wireless headphones with active noise cancellation.",
        image:
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=85"
    },

    {
        id: 4,
        name: "Vision Watch Ultra",
        category: "ACCESSORIES",
        price: 42999,
        rating: 4.7,
        reviews: 220,
        badge: "TITANIUM",
        description:
            "Premium smartwatch with GPS and health tracking.",
        image:
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=85"
    },

    {
        id: 5,
        name: "UltraTab Pro 12.9",
        category: "SMARTPHONES",
        price: 89999,
        rating: 4.8,
        reviews: 147,
        badge: "120HZ",
        description:
            "Professional tablet for entertainment and productivity.",
        image:
            "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1000&q=85"
    },

    {
        id: 6,
        name: "Apex Mechanical Keyboard",
        category: "ACCESSORIES",
        price: 9499,
        rating: 4.9,
        reviews: 410,
        badge: "CUSTOM",
        description:
            "Premium mechanical keyboard with hot-swappable switches.",
        image:
            "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=85"
    },

    {
        id: 7,
        name: "Titan 4K Gaming Display",
        category: "ACCESSORIES",
        price: 44999,
        rating: 4.6,
        reviews: 95,
        badge: "144HZ HDR",
        description:
            "4K gaming display with high refresh rate and HDR support.",
        image:
            "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1000&q=85"
    },

    {
        id: 8,
        name: "Pulse 360 Studio Speaker",
        category: "AUDIO",
        price: 14999,
        rating: 4.8,
        reviews: 310,
        badge: "360 SOUND",
        description:
            "Immersive wireless speaker with spatial audio.",
        image:
            "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=1000&q=85"
    },

    {
        id: 9,
        name: "Alpha Mirrorless Camera",
        category: "ACCESSORIES",
        price: 189999,
        rating: 5.0,
        reviews: 88,
        badge: "8K CAMERA",
        description:
            "Professional mirrorless camera with high-resolution sensor.",
        image:
            "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=85"
    },

    {
        id: 10,
        name: "Aeroflex Wireless Mouse",
        category: "ACCESSORIES",
        price: 6999,
        rating: 4.7,
        reviews: 275,
        badge: "ULTRALIGHT",
        description:
            "Lightweight wireless mouse designed for gaming and productivity.",
        image:
            "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1000&q=85"
    }

];



/* ============================================================
   HELPER
============================================================ */

function $(id) {

    return document.getElementById(id);

}


function money(value) {

    return "₹" +
        Number(value || 0)
            .toLocaleString("en-IN");

}


function escapeHTML(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}



/* ============================================================
   NETWORK DETECTION
============================================================ */

function detectNetwork() {

    if (!navigator.onLine) {

        return "LOW";

    }


    const connection =
        navigator.connection ||
        navigator.mozConnection ||
        navigator.webkitConnection;


    if (!connection) {

        return "MEDIUM";

    }


    const type =
        connection.effectiveType || "";


    const downlink =
        Number(connection.downlink || 0);


    const rtt =
        Number(connection.rtt || 0);


    if (
        type === "slow-2g" ||
        type === "2g" ||
        downlink < 1.5 ||
        rtt >= 400
    ) {

        return "LOW";

    }


    if (
        downlink >= 5 &&
        rtt < 150
    ) {

        return "HIGH";

    }


    return "MEDIUM";

}



/* ============================================================
   DEVICE DETECTION
============================================================ */

function detectDevice() {

    const cores =
        navigator.hardwareConcurrency || 4;


    const memory =
        navigator.deviceMemory;


    if (
        cores >= 8 &&
        (!memory || memory >= 8)
    ) {

        return "HIGH";

    }


    if (
        cores >= 4 &&
        (!memory || memory >= 4)
    ) {

        return "MEDIUM";

    }


    return "LOW";

}



/* ============================================================
   ADAPTIVE DECISION
============================================================ */

function calculateAdaptiveMode(
    network,
    device
) {

    /*
       Weakest-link rule
    */

    if (
        network === "LOW" ||
        device === "LOW"
    ) {

        return "LOW";

    }


    if (
        network === "HIGH" &&
        device === "HIGH"
    ) {

        return "HIGH";

    }


    return "MEDIUM";

}



/* ============================================================
   MODE CONFIG
============================================================ */

function getModeConfig(mode) {

    if (mode === "HIGH") {

        return {

            title:
                "FULL EXPERIENCE",

            imageWidth:
                1000,

            imageQuality:
                85,

            javascript:
                "FULL",

            animations:
                "FULL",

            prefetch:
                "ON",

            recommendations:
                true,

            description:
                "High-capability experience enabled with rich animations, enhanced hover effects, high-quality images and prefetching."

        };

    }


    if (mode === "LOW") {

        return {

            title:
                "LIGHTWEIGHT",

            imageWidth:
                320,

            imageQuality:
                40,

            javascript:
                "ESSENTIAL",

            animations:
                "MINIMAL",

            prefetch:
                "OFF",

            recommendations:
                false,

            description:
                "Lightweight experience enabled. Heavy animations and unnecessary effects are removed to reduce processing cost."

        };

    }


    return {

        title:
            "BALANCED",

        imageWidth:
            600,

        imageQuality:
            65,

        javascript:
            "BALANCED",

        animations:
            "REDUCED",

        prefetch:
            "OFF",

        recommendations:
            true,

        description:
            "Balanced experience with moderate image quality and restrained animations."

    };

}



/* ============================================================
   APPLY VISUAL MODE
============================================================ */

function applyVisualMode(mode) {

    document.body.classList.remove(
        "high-mode",
        "medium-mode",
        "low-mode"
    );


    document.body.classList.add(
        `${mode.toLowerCase()}-mode`
    );


    document.body.dataset.adaptiveMode =
        mode;


    currentMode =
        mode;

}



/* ============================================================
   IMAGE ADAPTATION
============================================================ */

function getAdaptiveImageURL(
    original,
    config
) {

    try {

        const url =
            new URL(original);


        url.searchParams.set(
            "w",
            config.imageWidth
        );


        url.searchParams.set(
            "q",
            config.imageQuality
        );


        return url.toString();

    }
    catch {

        return original;

    }

}



/* ============================================================
   PREFETCH
============================================================ */

function applyPrefetch(config) {

    document
        .querySelectorAll(
            "link[data-adaptive-prefetch]"
        )
        .forEach(
            element =>
                element.remove()
        );


    if (
        config.prefetch !== "ON"
    ) {

        return;

    }


    if (
        products.length < 2
    ) {

        return;

    }


    const link =
        document.createElement("link");


    link.rel =
        "prefetch";


    link.as =
        "image";


    link.href =
        getAdaptiveImageURL(
            products[1].image,
            config
        );


    link.dataset.adaptivePrefetch =
        "true";


    document.head.appendChild(
        link
    );

}



/* ============================================================
   ADAPTIVE ENGINE
============================================================ */

function updateAdaptiveEngine() {

    detectedNetwork =
        detectNetwork();


    detectedDevice =
        detectDevice();


    const effectiveNetwork =
        networkSetting === "AUTO"
            ? detectedNetwork
            : networkSetting;


    const effectiveDevice =
        deviceSetting === "AUTO"
            ? detectedDevice
            : deviceSetting;


    const mode =
        calculateAdaptiveMode(
            effectiveNetwork,
            effectiveDevice
        );


    const config =
        getModeConfig(mode);


    currentConfig =
        config;


    /*
       DETECT
       ↓
       DECIDE
       ↓
       ADAPT
    */

    applyVisualMode(mode);


    updateAdaptiveUI(
        effectiveNetwork,
        effectiveDevice,
        config
    );


    applyPrefetch(config);


    updateProductText(
        config
    );

}



/* ============================================================
   ADAPTIVE UI
============================================================ */

function updateAdaptiveUI(
    network,
    device,
    config
) {

    if ($("detectedNetwork")) {

        $("detectedNetwork").textContent =
            `Detected: ${detectedNetwork}`;

    }


    if ($("detectedDevice")) {

        $("detectedDevice").textContent =
            `Detected: ${detectedDevice}`;

    }


    if ($("deliveryBadge")) {

        $("deliveryBadge").textContent =
            `${network} / ${device}`;

    }


    if ($("deliveryMode")) {

        $("deliveryMode").textContent =
            config.title;

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
            config.javascript;

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
            `${network} Network · ${device} Device → ${config.title}`;

    }

}



/* ============================================================
   PRODUCT RENDERING
============================================================ */

function renderProducts() {

    const grid =
        $("productGrid");


    if (!grid) {

        return;

    }


    let filtered =
        [...products];


    if (
        activeCategory !== "ALL"
    ) {

        filtered =
            filtered.filter(
                product =>
                    product.category ===
                    activeCategory
            );

    }


    if (
        searchText.trim()
    ) {

        const query =
            searchText
                .trim()
                .toLowerCase();


        filtered =
            filtered.filter(
                product =>

                    product.name
                        .toLowerCase()
                        .includes(query)

                    ||

                    product.category
                        .toLowerCase()
                        .includes(query)

                    ||

                    product.description
                        .toLowerCase()
                        .includes(query)
            );

    }


    if (!filtered.length) {

        grid.innerHTML =
            "";


        if ($("noResults")) {

            $("noResults").style.display =
                "block";

        }


        if ($("productCount")) {

            $("productCount").textContent =
                "0 products";

        }


        return;

    }


    if ($("noResults")) {

        $("noResults").style.display =
            "none";

    }


    if ($("productCount")) {

        $("productCount").textContent =
            `${filtered.length} products`;

    }


    grid.innerHTML =
        filtered.map(
            product => {

                const image =
                    getAdaptiveImageURL(
                        product.image,
                        currentConfig ||
                        getModeConfig("MEDIUM")
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

                        <span class="product-badge">
                            ${escapeHTML(
                                product.badge
                            )}
                        </span>

                        <img
                            src="${escapeHTML(image)}"
                            alt="${escapeHTML(product.name)}"
                            loading="lazy"
                            decoding="async"
                        >

                    </div>


                    <div class="product-info">

                        <div class="product-top">

                            <span class="product-category">
                                ${escapeHTML(
                                    product.category
                                )}
                            </span>

                            <span class="product-rating">
                                ★ ${product.rating}
                            </span>

                        </div>


                        <h3>
                            ${escapeHTML(
                                product.name
                            )}
                        </h3>


                        <p class="product-description">
                            ${escapeHTML(
                                product.description
                            )}
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

            }
        ).join("");


    renderRecommendations();


    updateProductText(
        currentConfig
    );

}



/* ============================================================
   PRODUCT MODE TEXT
============================================================ */

function updateProductText(config) {

    if (!$("productMode") || !config) {

        return;

    }


    $("productMode").textContent =
        `${config.title} · Images ${config.imageQuality}% · ${config.animations} animations`;

}



/* ============================================================
   RECOMMENDATIONS
============================================================ */

function renderRecommendations() {

    const container =
        $("recommendationGrid");


    const section =
        $("recommendations");


    if (!container || !section) {

        return;

    }


    if (
        !currentConfig ||
        !currentConfig.recommendations
    ) {

        section.style.display =
            "none";

        container.innerHTML =
            "";

        return;

    }


    section.style.display =
        "flex";


    const count =
        currentMode === "HIGH"
            ? 3
            : 1;


    container.innerHTML =
        products
            .slice(0, count)
            .map(
                product => {

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
                        >

                        <div class="rec-info">

                            <strong>
                                ${escapeHTML(
                                    product.name
                                )}
                            </strong>

                            <span>
                                ${money(product.price)}
                            </span>

                        </div>

                        <button
                            class="rec-btn"
                            data-rec-add="${product.id}"
                        >
                            +
                        </button>

                    </div>

                    `;

                }
            )
            .join("");

}



/* ============================================================
   LOAD BACKEND PRODUCTS
============================================================ */

async function loadProducts() {

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
                    signal:
                        controller.signal
                }
            );


        clearTimeout(timeout);


        if (!response.ok) {

            throw new Error(
                "Backend unavailable"
            );

        }


        const data =
            await response.json();


        if (
            Array.isArray(data) &&
            data.length
        ) {

            products =
                data.map(
                    (item, index) => {

                        const fallback =
                            fallbackProducts[
                                index %
                                fallbackProducts.length
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

                            reviews:
                                Number(
                                    item.reviews ??
                                    fallback.reviews
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
                                fallback.image

                        };

                    }
                );

        }
        else {

            products =
                [...fallbackProducts];

        }

    }
    catch (error) {

        console.warn(
            "[AdaptiveShop] Using fallback catalog"
        );

        products =
            [...fallbackProducts];

    }


    renderProducts();

}



/* ============================================================
   CATEGORY
============================================================ */

function setupCategories() {

    document
        .querySelectorAll(
            ".category-card"
        )
        .forEach(
            card => {

                card.addEventListener(
                    "click",
                    () => {

                        activeCategory =
                            card.dataset.category;


                        document
                            .querySelectorAll(
                                ".category-card"
                            )
                            .forEach(
                                item =>
                                    item.classList.toggle(
                                        "active",
                                        item === card
                                    )
                            );


                        renderProducts();

                    }
                );

            }
        );

}



/* ============================================================
   SEARCH
============================================================ */

function setupSearch() {

    const input =
        $("searchInput");


    if (!input) {

        return;

    }


    input.addEventListener(
        "input",
        event => {

            searchText =
                event.target.value;


            renderProducts();

        }
    );

}



/* ============================================================
   CONFIG OPTIONS
============================================================ */

function setupConfigOptions() {


    document
        .querySelectorAll(
            ".network-option"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        networkSetting =
                            button.dataset.value;


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


                        updateAdaptiveEngine();

                    }
                );

            }
        );



    document
        .querySelectorAll(
            ".device-option"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        deviceSetting =
                            button.dataset.value;


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


                        updateAdaptiveEngine();

                    }
                );

            }
        );

}



/* ============================================================
   CONFIG MODAL
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
   HIGH-END 3D POINTER EFFECT
============================================================ */

function setupHighEndHover() {

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
                event.clientX -
                rect.left;


            const y =
                event.clientY -
                rect.top;


            const rotateY =
                ((x / rect.width) - .5) * 7;


            const rotateX =
                ((y / rect.height) - .5) * -5;


            card.style.transform =
                `
                translateY(-9px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                scale(1.02)
                `;

        }
    );


    grid.addEventListener(
        "pointerleave",
        event => {

            const card =
                event.target.closest(
                    ".product"
                );


            if (card) {

                card.style.transform =
                    "";

            }

        },
        true
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
            currentConfig ||
            getModeConfig("MEDIUM")
        );


    $("productModalContent").innerHTML = `

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

    `;


    $("productOverlay")
        ?.classList.add("active");

}


function closeProduct() {

    $("productOverlay")
        ?.classList.remove("active");

}



/* ============================================================
   PRODUCT EVENTS
============================================================ */

function setupProductEvents() {

    const grid =
        $("productGrid");


    if (!grid) {

        return;

    }


    grid.addEventListener(
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


            const productImage =
                event.target.closest(
                    "[data-product]"
                );


            const productCard =
                event.target.closest(
                    ".product"
                );


            if (
                productImage ||
                productCard
            ) {

                const id =
                    productCard?.dataset.id ||
                    productImage?.dataset.product;


                if (id) {

                    openProduct(id);

                }

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
            (product, index) => {

                total +=
                    Number(product.price);


                return `

                <div class="cart-item">

                    <img
                        src="${escapeHTML(
                            getAdaptiveImageURL(
                                product.image,
                                currentConfig
                            )
                        )}"
                        alt="${escapeHTML(
                            product.name
                        )}"
                    >


                    <div class="cart-item-info">

                        <strong>
                            ${escapeHTML(
                                product.name
                            )}
                        </strong>

                        <span>
                            ${money(
                                product.price
                            )}
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


                const index =
                    Number(
                        button.dataset.remove
                    );


                cart.splice(
                    index,
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
   RECOMMENDATION EVENTS
============================================================ */

document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "[data-rec-add]"
            );


        if (button) {

            addToCart(
                button.dataset.recAdd
            );

        }


        const modalButton =
            event.target.closest(
                "[data-modal-add]"
            );


        if (modalButton) {

            addToCart(
                modalButton.dataset.modalAdd
            );

            closeProduct();

        }

    }
);



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


    setTimeout(
        () => {

            toast.remove();

        },
        2200
    );

}



/* ============================================================
   PERFORMANCE TELEMETRY
============================================================ */

function setupPerformanceTelemetry() {

    if (
        !window.PerformanceObserver
    ) {

        return;

    }



    /* =========================
       LCP
    ========================= */

    try {

        const lcpObserver =
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


        lcpObserver.observe({

            type:
                "largest-contentful-paint",

            buffered:
                true

        });

    }
    catch {}



    /* =========================
       CLS
    ========================= */

    try {

        let cls =
            0;


        const clsObserver =
            new PerformanceObserver(
                list => {

                    list
                        .getEntries()
                        .forEach(
                            entry => {

                                if (
                                    !entry.hadRecentInput
                                ) {

                                    cls +=
                                        entry.value;

                                }

                            }
                        );


                    if ($("metricCLS")) {

                        $("metricCLS")
                            .textContent =
                            cls.toFixed(3);

                    }

                }
            );


        clsObserver.observe({

            type:
                "layout-shift",

            buffered:
                true

        });

    }
    catch {}



    /* =========================
       INP
    ========================= */

    try {

        const inpObserver =
            new PerformanceObserver(
                list => {

                    const entries =
                        list.getEntries();


                    if (!entries.length) {

                        return;

                    }


                    /*
                       INP uses the longest
                       interaction observed.
                    */

                    const longest =
                        entries.reduce(
                            (max, entry) =>
                                Math.max(
                                    max,
                                    entry.duration
                                ),
                            0
                        );


                    if ($("metricINP")) {

                        $("metricINP")
                            .textContent =
                            `${Math.round(
                                longest
                            )} ms`;

                    }

                }
            );


        inpObserver.observe({

            type:
                "event",

            buffered:
                true,

            durationThreshold:
                40

        });

    }
    catch {}



    /* =========================
       NAVIGATION
    ========================= */

    window.addEventListener(
        "load",
        () => {

            setTimeout(
                () => {

                    const navigation =
                        performance.getEntriesByType(
                            "navigation"
                        )[0];


                    if (navigation) {

                        if ($("metricLoad")) {

                            $("metricLoad")
                                .textContent =
                                `${Math.round(
                                    navigation.loadEventEnd
                                )} ms`;

                        }

                    }


                    const resources =
                        performance.getEntriesByType(
                            "resource"
                        );


                    let totalBytes =
                        0;


                    resources.forEach(
                        resource => {

                            totalBytes +=
                                resource.transferSize ||
                                0;

                        }
                    );


                    if ($("metricTransfer")) {

                        $("metricTransfer")
                            .textContent =
                            `${(
                                totalBytes / 1024
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
   NETWORK LIVE CHANGES
============================================================ */

function setupNetworkListeners() {

    const connection =
        navigator.connection ||
        navigator.mozConnection ||
        navigator.webkitConnection;


    if (connection) {

        connection.addEventListener(
            "change",
            () => {

                if (
                    networkSetting ===
                    "AUTO"
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
                networkSetting ===
                "AUTO"
            ) {

                updateAdaptiveEngine();

            }

        }
    );


    window.addEventListener(
        "offline",
        () => {

            if (
                networkSetting ===
                "AUTO"
            ) {

                updateAdaptiveEngine();

            }

        }
    );

}



/* ============================================================
   ESCAPE
============================================================ */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "Escape"
        ) {

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
   EXPLORE BUTTON
============================================================ */

function setupExplore() {

    $("exploreButton")
        ?.addEventListener(
            "click",
            () => {

                $("products")
                    ?.scrollIntoView({
                        behavior:
                            "smooth"
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

    setupHighEndHover();

    setupNetworkListeners();

    setupPerformanceTelemetry();

    setupExplore();


    /*
       Initial detection
    */

    updateAdaptiveEngine();


    /*
       Load backend catalog
       with local fallback.
    */

    await loadProducts();


    /*
       Apply adaptive mode again
       after catalog loads.
    */

    updateAdaptiveEngine();


    console.log(
        "[AdaptiveWeb] AdaptiveShop initialized"
    );

}


init();
