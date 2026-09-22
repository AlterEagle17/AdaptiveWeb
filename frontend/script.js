"use strict";


/* =====================================================
   BACKEND
===================================================== */

const API_BASE_URL =
    window.API_BASE_URL ||
    "https://adaptiveweb.onrender.com/api";


/* =====================================================
   STATE
===================================================== */

let products = [];

let activeCategory = "ALL";

let searchText = "";

let cart = [];

let networkSetting = "AUTO";

let deviceSetting = "AUTO";

let detectedNetwork = "MEDIUM";

let detectedDevice = "MEDIUM";



/* =====================================================
   FALLBACK PRODUCTS
===================================================== */

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
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=85",
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
        reviews: 189,
        badge: "PRO POWER",
        description:
            "High-performance laptop for creators, developers and professionals.",
        image:
            "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=85",
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
        reviews: 512,
        badge: "HI-RES AUDIO",
        description:
            "Premium wireless headphones with active noise cancellation.",
        image:
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85",
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
        reviews: 220,
        badge: "TITANIUM",
        description:
            "Premium smartwatch with GPS and health tracking.",
        image:
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85",
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
        reviews: 147,
        badge: "120HZ",
        description:
            "Professional tablet for entertainment and productivity.",
        image:
            "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=900&q=85",
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
        reviews: 410,
        badge: "CUSTOM",
        description:
            "Premium mechanical keyboard with hot-swappable switches.",
        image:
            "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=85",
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
        category: "ACCESSORIES",
        price: 44999,
        rating: 4.6,
        reviews: 95,
        badge: "144HZ HDR",
        description:
            "4K gaming display with high refresh rate and HDR support.",
        image:
            "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=85",
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
        reviews: 310,
        badge: "360 SOUND",
        description:
            "Immersive wireless speaker with spatial audio.",
        image:
            "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=85",
        specs: [
            "360° sound",
            "Spatial audio",
            "Wi-Fi",
            "Smart controls"
        ]
    }

];



/* =====================================================
   UTILS
===================================================== */

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


function get(id) {

    return document.getElementById(id);

}



/* =====================================================
   NETWORK DETECTION
===================================================== */

function detectNetwork() {

    const connection =
        navigator.connection ||
        navigator.mozConnection ||
        navigator.webkitConnection;


    if (!navigator.onLine) {

        return "LOW";

    }


    if (!connection) {

        return "MEDIUM";

    }


    const type =
        connection.effectiveType;


    const downlink =
        Number(connection.downlink || 0);


    if (
        type === "slow-2g" ||
        type === "2g" ||
        downlink < 1.5
    ) {

        return "LOW";

    }


    if (
        type === "4g" &&
        downlink >= 5
    ) {

        return "HIGH";

    }


    return "MEDIUM";

}



/* =====================================================
   DEVICE DETECTION
===================================================== */

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



/* =====================================================
   DETECT CURRENT ENVIRONMENT
===================================================== */

function refreshDetection() {

    detectedNetwork =
        detectNetwork();


    detectedDevice =
        detectDevice();


    get("detectedNetwork").textContent =
        `Detected: ${detectedNetwork}`;


    get("detectedDevice").textContent =
        `Detected: ${detectedDevice}`;

}



/* =====================================================
   FINAL ADAPTIVE MODE
===================================================== */

function getFinalLevels() {

    const network =
        networkSetting === "AUTO"
            ? detectedNetwork
            : networkSetting;


    const device =
        deviceSetting === "AUTO"
            ? detectedDevice
            : deviceSetting;


    return {
        network,
        device
    };

}



/* =====================================================
   DELIVERY DECISION
===================================================== */

function getDeliveryConfig() {

    const levels =
        getFinalLevels();


    let mode = "BALANCED";


    if (
        levels.network === "LOW" ||
        levels.device === "LOW"
    ) {

        mode = "LIGHTWEIGHT";

    }
    else if (
        levels.network === "HIGH" &&
        levels.device === "HIGH"
    ) {

        mode = "FULL EXPERIENCE";

    }


    if (mode === "LIGHTWEIGHT") {

        return {

            ...levels,

            mode,

            image: "320px / 40%",

            js: "Essential",

            animations: "Reduced",

            prefetch: "OFF",

            description:
                "Lightweight delivery enabled. Data and processing are minimized."

        };

    }


    if (mode === "FULL EXPERIENCE") {

        return {

            ...levels,

            mode,

            image: "1000px / 85%",

            js: "Full",

            animations: "Full",

            prefetch: "ON",

            description:
                "Full experience enabled for a strong network and capable device."

        };

    }


    return {

        ...levels,

        mode,

        image: "600px / 65%",

        js: "Balanced",

        animations: "Reduced",

        prefetch: "OFF",

        description:
            "Balanced delivery selected for the current environment."

    };

}



/* =====================================================
   CONFIG UI
===================================================== */

function updateConfigUI() {

    refreshDetection();


    const config =
        getDeliveryConfig();


    get("deliveryMode").textContent =
        config.mode;


    get("deliveryDescription").textContent =
        config.description;


    get("deliveryBadge").textContent =
        `${config.network} / ${config.device}`;


    get("detailImages").textContent =
        config.image;


    get("detailJS").textContent =
        config.js;


    get("detailAnimations").textContent =
        config.animations;


    get("detailPrefetch").textContent =
        config.prefetch;


    get("detailNetwork").textContent =
        config.network;


    get("detailDevice").textContent =
        config.device;


    applyAdaptiveImageStrategy(
        config
    );

}



/* =====================================================
   OPTION BUTTONS
===================================================== */

function setupOptions() {


    document
        .querySelectorAll(
            ".network-option"
        )
        .forEach(button => {

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


                    updateConfigUI();

                }
            );

        });



    document
        .querySelectorAll(
            ".device-option"
        )
        .forEach(button => {

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


                    updateConfigUI();

                }
            );

        });

}



/* =====================================================
   ADAPTIVE IMAGE STRATEGY
===================================================== */

function applyAdaptiveImageStrategy(
    config
) {

    const imageWidth =
        config.mode === "LIGHTWEIGHT"
            ? 320
            : config.mode === "FULL EXPERIENCE"
                ? 900
                : 600;


    const quality =
        config.mode === "LIGHTWEIGHT"
            ? 40
            : config.mode === "FULL EXPERIENCE"
                ? 85
                : 65;


    document
        .querySelectorAll(
            ".product-image img"
        )
        .forEach(img => {

            const original =
                img.dataset.original ||
                img.src;


            img.dataset.original =
                original;


            try {

                const url =
                    new URL(original);


                url.searchParams.set(
                    "w",
                    imageWidth
                );


                url.searchParams.set(
                    "q",
                    quality
                );


                img.src =
                    url.toString();

            } catch {

                // Keep original URL.

            }

        });

}



/* =====================================================
   LOAD PRODUCTS FROM BACKEND
===================================================== */

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
            throw new Error("Backend unavailable");
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
                                    item.reviewCount ??
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
                                fallback.image,

                            specs:
                                Array.isArray(
                                    item.specs
                                )
                                    ? item.specs
                                    : fallback.specs

                        };

                    }
                );


            get("backendStatus").textContent =
                "Backend • Online";

        }
        else {

            products =
                [...fallbackProducts];

            get("backendStatus").textContent =
                "Backend • Fallback";

        }

    }
    catch {

        products =
            [...fallbackProducts];

        get("backendStatus").textContent =
            "Backend • Fallback";

    }


    renderProducts();

}



/* =====================================================
   FILTER PRODUCTS
===================================================== */

function getFilteredProducts() {

    return products.filter(
        product => {

            const categoryMatch =
                activeCategory === "ALL" ||
                product.category ===
                activeCategory;


            const text =
                searchText
                    .trim()
                    .toLowerCase();


            const searchMatch =
                !text ||

                product.name
                    .toLowerCase()
                    .includes(text)

                ||

                product.category
                    .toLowerCase()
                    .includes(text)

                ||

                product.description
                    .toLowerCase()
                    .includes(text);


            return (
                categoryMatch &&
                searchMatch
            );

        }
    );

}



/* =====================================================
   RENDER PRODUCTS
===================================================== */

function renderProducts() {

    const grid =
        get("productGrid");


    const list =
        getFilteredProducts();


    get("productCount").textContent =
        `${list.length} products`;


    if (!list.length) {

        grid.innerHTML = "";

        get("noResults").style.display =
            "block";

        return;

    }


    get("noResults").style.display =
        "none";


    grid.innerHTML =
        list.map(
            product => `

                <article
                    class="product"
                >

                    <div
                        class="product-image"
                        data-id="${product.id}"
                    >

                        <span class="product-badge">
                            ${escapeHTML(
                                product.badge
                            )}
                        </span>

                        <img
                            src="${escapeHTML(
                                product.image
                            )}"
                            alt="${escapeHTML(
                                product.name
                            )}"
                            loading="lazy"
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


                        <h3
                            data-product="${product.id}"
                        >
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
                                ${money(
                                    product.price
                                )}
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

            `
        )
        .join("");


    applyAdaptiveImageStrategy(
        getDeliveryConfig()
    );

}



/* =====================================================
   CATEGORY
===================================================== */

function setCategory(category) {

    activeCategory =
        category;


    document
        .querySelectorAll(
            ".category-card"
        )
        .forEach(
            card => {

                card.classList.toggle(
                    "active",
                    card.dataset.category ===
                    category
                );

            }
        );


    renderProducts();


    document
        .getElementById(
            "products"
        )
        .scrollIntoView({
            behavior: "smooth"
        });

}



/* =====================================================
   CART
===================================================== */

function addToCart(id) {

    const product =
        products.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!product) return;


    const existing =
        cart.find(
            item =>
                String(item.product.id) ===
                String(id)
        );


    if (existing) {

        existing.quantity++;

    }
    else {

        cart.push({
            product,
            quantity: 1
        });

    }


    renderCart();


    toast(
        `${product.name} added to cart`
    );

}



function changeQuantity(
    id,
    change
) {

    const item =
        cart.find(
            entry =>
                String(entry.product.id) ===
                String(id)
        );


    if (!item) return;


    item.quantity +=
        change;


    if (item.quantity <= 0) {

        cart =
            cart.filter(
                entry =>
                    String(entry.product.id) !==
                    String(id)
            );

    }


    renderCart();

}



function removeCart(id) {

    cart =
        cart.filter(
            item =>
                String(item.product.id) !==
                String(id)
        );


    renderCart();

}



function renderCart() {

    const container =
        get("cartItems");


    const count =
        cart.reduce(
            (sum, item) =>
                sum + item.quantity,
            0
        );


    const total =
        cart.reduce(
            (sum, item) =>
                sum +
                item.product.price *
                item.quantity,
            0
        );


    get("cartCount").textContent =
        count;


    get("cartTotal").textContent =
        money(total);


    if (!cart.length) {

        container.innerHTML = `

            <div class="cart-empty">

                <div style="font-size:45px">
                    🛒
                </div>

                <h3>
                    Your cart is empty
                </h3>

                <p>
                    Add something you love.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        cart.map(
            item => `

                <div class="cart-row">

                    <img
                        src="${escapeHTML(
                            item.product.image
                        )}"
                        alt=""
                    >


                    <div class="cart-row-info">

                        <strong>
                            ${escapeHTML(
                                item.product.name
                            )}
                        </strong>

                        <span>
                            ${money(
                                item.product.price
                            )}
                        </span>


                        <div class="quantity">

                            <button
                                data-minus="${item.product.id}"
                            >
                                −
                            </button>

                            <b>
                                ${item.quantity}
                            </b>

                            <button
                                data-plus="${item.product.id}"
                            >
                                +
                            </button>

                        </div>

                    </div>


                    <button
                        class="remove-cart"
                        data-remove="${item.product.id}"
                    >
                        ✕
                    </button>

                </div>

            `
        )
        .join("");

}



/* =====================================================
   PRODUCT MODAL
===================================================== */

function openProduct(id) {

    const product =
        products.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!product) return;


    const specs =
        (product.specs || [])
            .map(
                spec =>
                    `<li>✓ ${escapeHTML(
                        spec
                    )}</li>`
            )
            .join("");


    get(
        "productModalContent"
    ).innerHTML = `

        <div class="product-modal-image">

            <img
                src="${escapeHTML(
                    product.image
                )}"
                alt="${escapeHTML(
                    product.name
                )}"
            >

        </div>


        <div>

            <span class="product-category">
                ${escapeHTML(
                    product.category
                )}
            </span>


            <h2>
                ${escapeHTML(
                    product.name
                )}
            </h2>


            <div class="product-rating">
                ★ ${product.rating}
                · ${product.reviews} reviews
            </div>


            <p>
                ${escapeHTML(
                    product.description
                )}
            </p>


            <ul class="product-specs">
                ${specs}
            </ul>


            <div
                class="product-modal-bottom"
            >

                <strong
                    class="product-modal-price"
                >
                    ${money(
                        product.price
                    )}
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


    get("productOverlay")
        .classList.add("active");

}



/* =====================================================
   PERFORMANCE
===================================================== */

function updatePerformance() {

    const navigation =
        performance.getEntriesByType(
            "navigation"
        )[0];


    if (navigation) {

        get("metricLoad").textContent =
            `${Math.round(
                navigation.loadEventEnd ||
                navigation.duration
            )} ms`;

    }


    const resources =
        performance.getEntriesByType(
            "resource"
        );


    get("metricResources").textContent =
        resources.length;


    let transfer = 0;


    resources.forEach(
        item => {

            transfer +=
                item.transferSize || 0;

        }
    );


    get("metricTransfer").textContent =
        `${(
            transfer / 1024
        ).toFixed(1)} KB`;



    if (
        "PerformanceObserver"
        in window
    ) {

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


                        if (last) {

                            get(
                                "metricLCP"
                            ).textContent =
                                `${Math.round(
                                    last.startTime
                                )} ms`;

                        }

                    }
                );


            lcpObserver.observe({
                type: "largest-contentful-paint",
                buffered: true
            });

        }
        catch {}



        try {

            const clsObserver =
                new PerformanceObserver(
                    list => {

                        let cls = 0;


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


                        get(
                            "metricCLS"
                        ).textContent =
                            cls.toFixed(3);

                    }
                );


            clsObserver.observe({
                type: "layout-shift",
                buffered: true
            });

        }
        catch {}



        try {

            const inpObserver =
                new PerformanceObserver(
                    list => {

                        const entries =
                            list.getEntries();


                        const last =
                            entries[
                                entries.length - 1
                            ];


                        if (last) {

                            get(
                                "metricINP"
                            ).textContent =
                                `${Math.round(
                                    last.duration
                                )} ms`;

                        }

                    }
                );


            inpObserver.observe({
                type: "event",
                buffered: true,
                durationThreshold: 40
            });

        }
        catch {}

    }

}



/* =====================================================
   TOAST
===================================================== */

function toast(message) {

    const container =
        get("toastContainer");


    const element =
        document.createElement(
            "div"
        );


    element.className =
        "toast";


    element.textContent =
        message;


    container.appendChild(
        element
    );


    setTimeout(
        () => element.remove(),
        2200
    );

}



/* =====================================================
   EVENTS
===================================================== */

function setupEvents() {


    /* Search */

    get("searchInput")
        .addEventListener(
            "input",
            event => {

                searchText =
                    event.target.value;


                get("clearSearch").style.display =
                    searchText
                        ? "block"
                        : "none";


                renderProducts();

            }
        );


    get("clearSearch")
        .addEventListener(
            "click",
            () => {

                searchText = "";

                get(
                    "searchInput"
                ).value = "";

                get(
                    "clearSearch"
                ).style.display =
                    "none";

                renderProducts();

            }
        );


    /* Categories */

    document
        .querySelectorAll(
            ".category-card"
        )
        .forEach(
            card => {

                card.addEventListener(
                    "click",
                    () =>
                        setCategory(
                            card.dataset.category
                        )
                );

            }
        );


    get("viewAllButton")
        .addEventListener(
            "click",
            () =>
                setCategory("ALL")
        );


    /* Hero buttons */

    get("shopNowButton")
        .addEventListener(
            "click",
            () => {

                get(
                    "products"
                ).scrollIntoView({
                    behavior: "smooth"
                });

            }
        );


    get("browseButton")
        .addEventListener(
            "click",
            () => {

                get(
                    "categories"
                ).scrollIntoView({
                    behavior: "smooth"
                });

            }
        );


    get("promoButton")
        .addEventListener(
            "click",
            () => {

                get(
                    "products"
                ).scrollIntoView({
                    behavior: "smooth"
                });

            }
        );


    /* Product actions */

    get("productGrid")
        .addEventListener(
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


                const product =
                    event.target.closest(
                        "[data-product]"
                    );


                const image =
                    event.target.closest(
                        ".product-image"
                    );


                if (product) {

                    openProduct(
                        product.dataset.product
                    );

                    return;

                }


                if (image) {

                    openProduct(
                        image.dataset.id
                    );

                }

            }
        );


    /* Cart */

    get("cartButton")
        .addEventListener(
            "click",
            () =>
                get(
                    "cartOverlay"
                ).classList.add(
                    "active"
                )
        );


    get("closeCart")
        .addEventListener(
            "click",
            () =>
                get(
                    "cartOverlay"
                ).classList.remove(
                    "active"
                )
        );


    get("cartItems")
        .addEventListener(
            "click",
            event => {

                if (
                    event.target.dataset.plus
                ) {

                    changeQuantity(
                        event.target.dataset.plus,
                        1
                    );

                }


                if (
                    event.target.dataset.minus
                ) {

                    changeQuantity(
                        event.target.dataset.minus,
                        -1
                    );

                }


                if (
                    event.target.dataset.remove
                ) {

                    removeCart(
                        event.target.dataset.remove
                    );

                }

            }
        );


    get("checkoutButton")
        .addEventListener(
            "click",
            () => {

                if (!cart.length) {

                    toast(
                        "Your cart is empty"
                    );

                    return;

                }


                cart = [];

                renderCart();

                get(
                    "cartOverlay"
                ).classList.remove(
                    "active"
                );


                toast(
                    "Demo order completed successfully"
                );

            }
        );


    /* Product modal */

    get("closeProduct")
        .addEventListener(
            "click",
            () =>
                get(
                    "productOverlay"
                ).classList.remove(
                    "active"
                )
        );


    get("productModalContent")
        .addEventListener(
            "click",
            event => {

                if (
                    event.target.dataset.modalAdd
                ) {

                    addToCart(
                        event.target.dataset.modalAdd
                    );

                    get(
                        "productOverlay"
                    ).classList.remove(
                        "active"
                    );

                }

            }
        );


    /* Config */

    get("configButton")
        .addEventListener(
            "click",
            () => {

                updateConfigUI();

                get(
                    "configOverlay"
                ).classList.add(
                    "active"
                );

            }
        );


    get("closeConfig")
        .addEventListener(
            "click",
            () =>
                get(
                    "configOverlay"
                ).classList.remove(
                    "active"
                )
        );


    /* Close overlay by background */

    [
        "configOverlay",
        "productOverlay"
    ]
        .forEach(id => {

            get(id)
                .addEventListener(
                    "click",
                    event => {

                        if (
                            event.target.id === id
                        ) {

                            get(id)
                                .classList
                                .remove(
                                    "active"
                                );

                        }

                    }
                );

        });


    setupOptions();

}



/* =====================================================
   START
===================================================== */

async function init() {

    detectedNetwork =
        detectNetwork();


    detectedDevice =
        detectDevice();


    setupEvents();

    renderCart();

    updatePerformance();

    await loadProducts();

    updateConfigUI();

}


init();
