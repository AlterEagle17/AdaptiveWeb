const API_BASE_URL = "https://adaptiveweb.onrender.com/api";

let products = [];
let cart = [];
let activeCategory = "ALL";
let searchText = "";

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
        badge: "360 SOUND",
        description:
            "Immersive wireless speaker with spatial audio.",
        image:
            "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=1000&q=85"
    }
];


/* ============================================================
   HELPERS
============================================================ */

const $ = (id) => document.getElementById(id);

const money = (number) =>
    "₹" + Number(number || 0).toLocaleString("en-IN");

const escapeHTML = (value) =>
    String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");


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

function decide(network, device) {

    /*
        LOW network OR LOW device
        → LOW experience
    */

    if (
        network === "LOW" ||
        device === "LOW"
    ) {
        return "LOW";
    }


    /*
        HIGH network + HIGH device
        → FULL experience
    */

    if (
        network === "HIGH" &&
        device === "HIGH"
    ) {
        return "HIGH";
    }


    /*
        Everything else
        → MEDIUM
    */

    return "MEDIUM";
}


/* ============================================================
   MODE CONFIGURATION
============================================================ */

function config(mode) {

    if (mode === "HIGH") {

        return {

            title:
                "FULL EXPERIENCE",

            width:
                1000,

            q:
                88,

            js:
                "FULL",

            anim:
                "FULL",

            prefetch:
                "ON",

            recs:
                3,

            desc:
                "Maximum visual experience: animated environment, 3D product interactions, high-quality media and smart prefetching."

        };
    }


    if (mode === "LOW") {

        return {

            title:
                "LIGHTWEIGHT EXPERIENCE",

            width:
                320,

            q:
                40,

            js:
                "ESSENTIAL",

            anim:
                "MINIMAL",

            prefetch:
                "OFF",

            recs:
                0,

            desc:
                "Low-bandwidth and low-device mode: heavy decoration, movement and recommendations are removed."

        };
    }


    return {

        title:
            "BALANCED EXPERIENCE",

        width:
            600,

        q:
            65,

        js:
            "BALANCED",

        anim:
            "REDUCED",

        prefetch:
            "OFF",

        recs:
            1,

        desc:
            "Balanced mode keeps useful visual feedback while avoiding expensive effects."

    };
}


/* ============================================================
   ADAPTIVE IMAGE URL
============================================================ */

function imageUrl(src, settings) {

    try {

        const url =
            new URL(src);

        url.searchParams.set(
            "w",
            settings.width
        );

        url.searchParams.set(
            "q",
            settings.q
        );

        return url.toString();

    } catch {

        return src;

    }
}


/* ============================================================
   MAIN ADAPTIVE ENGINE
============================================================ */

function applyMode() {

    /*
        DETECT
    */

    detectedNetwork =
        detectNetwork();

    detectedDevice =
        detectDevice();


    /*
        DECIDE
    */

    const effectiveNetwork =
        networkSetting === "AUTO"
            ? detectedNetwork
            : networkSetting;

    const effectiveDevice =
        deviceSetting === "AUTO"
            ? detectedDevice
            : deviceSetting;


    currentMode =
        decide(
            effectiveNetwork,
            effectiveDevice
        );


    currentConfig =
        config(currentMode);


    /*
        ADAPT VISUAL MODE
    */

    document.body.classList.remove(
        "high-mode",
        "medium-mode",
        "low-mode"
    );


    document.body.classList.add(
        currentMode.toLowerCase() +
        "-mode"
    );


    /*
        HERO
    */

    if ($("heroMode")) {

        $("heroMode").textContent =
            currentMode;

    }


    /*
        CONFIG PANEL
    */

    if ($("detectedNetwork")) {

        $("detectedNetwork").textContent =
            "Detected: " +
            detectedNetwork;

    }


    if ($("detectedDevice")) {

        $("detectedDevice").textContent =
            "Detected: " +
            detectedDevice;

    }


    if ($("deliveryBadge")) {

        $("deliveryBadge").textContent =
            `${effectiveNetwork} / ${effectiveDevice}`;

    }


    if ($("deliveryMode")) {

        $("deliveryMode").textContent =
            currentConfig.title;

    }


    if ($("deliveryDescription")) {

        $("deliveryDescription").textContent =
            currentConfig.desc;

    }


    if ($("detailImages")) {

        $("detailImages").textContent =
            `${currentConfig.width}px / q${currentConfig.q}`;

    }


    if ($("detailJS")) {

        $("detailJS").textContent =
            currentConfig.js;

    }


    if ($("detailAnimations")) {

        $("detailAnimations").textContent =
            currentConfig.anim;

    }


    if ($("detailPrefetch")) {

        $("detailPrefetch").textContent =
            currentConfig.prefetch;

    }


    /*
        STATUS BAR
    */

    if ($("shopStatus")) {

        $("shopStatus").textContent =
            `${effectiveNetwork} Network · ` +
            `${effectiveDevice} Device → ` +
            `${currentConfig.title}`;

    }


    /*
        PRODUCT MODE TEXT
    */

    if ($("productMode")) {

        $("productMode").textContent =
            `${currentConfig.title} · ` +
            `Image q${currentConfig.q} · ` +
            `${currentConfig.anim} visual layer`;

    }


    /*
        PREFETCH
    */

    document
        .querySelectorAll(
            "[data-prefetch]"
        )
        .forEach(
            element =>
                element.remove()
        );


    if (
        currentConfig.prefetch === "ON" &&
        products.length > 1
    ) {

        const link =
            document.createElement("link");

        link.rel =
            "prefetch";

        link.as =
            "image";

        link.href =
            imageUrl(
                products[1].image,
                currentConfig
            );

        link.dataset.prefetch =
            "1";

        document.head.appendChild(link);
    }


    /*
        RENDER CONTENT
    */

    renderProducts();
}


/* ============================================================
   PRODUCT RENDER
============================================================ */

function renderProducts() {

    let list =
        [...products];


    /*
        CATEGORY FILTER
    */

    if (
        activeCategory !== "ALL"
    ) {

        list =
            list.filter(
                product =>
                    product.category ===
                    activeCategory
            );

    }


    /*
        SEARCH FILTER
    */

    if (
        searchText.trim()
    ) {

        const query =
            searchText
                .toLowerCase()
                .trim();


        list =
            list.filter(
                product => {

                    const text =
                        `${product.name} ` +
                        `${product.category} ` +
                        `${product.description}`;

                    return text
                        .toLowerCase()
                        .includes(query);

                }
            );

    }


    /*
        COUNT
    */

    if ($("productCount")) {

        $("productCount").textContent =
            `${list.length} products`;

    }


    /*
        NO RESULTS
    */

    if ($("noResults")) {

        $("noResults").hidden =
            list.length !== 0;

    }


    /*
        PRODUCT HTML
    */

    $("productGrid").innerHTML =
        list.map(
            product => {

                const image =
                    imageUrl(
                        product.image,
                        currentConfig ||
                        config("MEDIUM")
                    );


                return `

                <article
                    class="product"
                    data-id="${product.id}"
                >

                    <div class="product-image">

                        <span class="product-badge">
                            ${escapeHTML(
                                product.badge
                            )}
                        </span>

                        <img
                            src="${escapeHTML(image)}"
                            alt="${escapeHTML(product.name)}"
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


                        <h3>
                            ${escapeHTML(
                                product.name
                            )}
                        </h3>


                        <p class="product-desc">
                            ${escapeHTML(
                                product.description
                            )}
                        </p>


                        <div class="product-bottom">

                            <strong class="price">
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
        )
        .join("");


    renderRecommendations();

}


/* ============================================================
   RECOMMENDATIONS
============================================================ */

function renderRecommendations() {

    const container =
        $("recommendGrid");

    const section =
        $("recommendations");


    if (
        !currentConfig ||
        currentConfig.recs === 0
    ) {

        section.style.display =
            "none";

        container.innerHTML =
            "";

        return;

    }


    section.style.display =
        "flex";


    container.innerHTML =
        products
            .slice(
                0,
                currentConfig.recs
            )
            .map(
                product => {

                    const image =
                        imageUrl(
                            product.image,
                            currentConfig
                        );


                    return `

                    <div class="rec-card">

                        <img
                            src="${escapeHTML(image)}"
                            alt="${escapeHTML(product.name)}"
                        >

                        <div>

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
                            data-rec="${product.id}"
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
   LOAD PRODUCTS FROM SPRING BOOT
============================================================ */

async function loadProducts() {

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/products`,
                {
                    signal:
                        AbortSignal.timeout(
                            4500
                        )
                }
            );


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
                    (product, index) => {

                        const fallback =
                            fallbackProducts[
                                index %
                                fallbackProducts.length
                            ];


                        return {

                            ...fallback,

                            ...product,

                            image:
                                product.imageUrl ||
                                product.image ||
                                fallback.image

                        };

                    }
                );

        } else {

            products =
                [...fallbackProducts];

        }

    } catch {

        console.warn(
            "Backend unavailable. Using local products."
        );


        products =
            [...fallbackProducts];

    }


    applyMode();

}


/* ============================================================
   CATEGORY
============================================================ */

function setupCategories() {

    document
        .querySelectorAll(
            ".category"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        activeCategory =
                            button.dataset.category;


                        document
                            .querySelectorAll(
                                ".category"
                            )
                            .forEach(
                                item => {

                                    item.classList.toggle(
                                        "active",
                                        item === button
                                    );

                                }
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
   NETWORK / DEVICE SETTINGS
============================================================ */

function setupChoices() {

    document
        .querySelectorAll(
            ".network-choice"
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
                                ".network-choice"
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


                        applyMode();

                    }
                );

            }
        );


    document
        .querySelectorAll(
            ".device-choice"
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
                                ".device-choice"
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


                        applyMode();

                    }
                );

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
        imageUrl(
            product.image,
            currentConfig
        );


    $("productModalContent").innerHTML = `

        <div class="modal-content">

            <img
                src="${escapeHTML(image)}"
                alt="${escapeHTML(product.name)}"
            >


            <div class="modal-info">

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


                <p>
                    ${escapeHTML(
                        product.description
                    )}
                </p>


                <p>
                    ⭐ ${product.rating}
                </p>


                <strong class="modal-price">
                    ${money(product.price)}
                </strong>


                <button
                    class="primary"
                    data-modal-add="${product.id}"
                >
                    Add to Cart
                </button>

            </div>

        </div>

    `;


    $("productOverlay")
        .classList.add(
            "active"
        );

}


/* ============================================================
   CART
============================================================ */

function addCart(id) {

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


    if (!cart.length) {

        $("cartItems").innerHTML = `

            <div class="empty">

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


    $("cartItems").innerHTML =
        cart.map(
            (product, index) => {

                total +=
                    Number(
                        product.price
                    );


                return `

                <div class="cart-item">

                    <img
                        src="${escapeHTML(
                            imageUrl(
                                product.image,
                                currentConfig
                            )
                        )}"
                        alt="${escapeHTML(
                            product.name
                        )}"
                    >


                    <div>

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
                        class="remove"
                        data-remove="${index}"
                    >
                        ×
                    </button>

                </div>

                `;

            }
        )
        .join("");


    $("cartTotal").textContent =
        money(total);

}


/* ============================================================
   TOAST
============================================================ */

function showToast(message) {

    const toast =
        document.createElement(
            "div"
        );


    toast.className =
        "toast";


    toast.textContent =
        message;


    $("toastWrap")
        .appendChild(
            toast
        );


    setTimeout(
        () => toast.remove(),
        2200
    );

}


/* ============================================================
   CONFIG MODAL
============================================================ */

function setupConfig() {

    const openConfig = () => {

        $("configOverlay")
            .classList.add(
                "active"
            );

        applyMode();

    };


    $("configButton")
        .addEventListener(
            "click",
            openConfig
        );


    $("heroConfig")
        .addEventListener(
            "click",
            openConfig
        );


    $("statusConfig")
        .addEventListener(
            "click",
            openConfig
        );


    $("closeConfig")
        .addEventListener(
            "click",
            () => {

                $("configOverlay")
                    .classList.remove(
                        "active"
                    );

            }
        );


    $("configOverlay")
        .addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    $("configOverlay")
                ) {

                    $("configOverlay")
                        .classList.remove(
                            "active"
                        );

                }

            }
        );

}


/* ============================================================
   CART EVENTS
============================================================ */

function setupCart() {

    $("cartButton")
        .addEventListener(
            "click",
            () => {

                $("cartOverlay")
                    .classList.add(
                        "active"
                    );

            }
        );


    $("closeCart")
        .addEventListener(
            "click",
            () => {

                $("cartOverlay")
                    .classList.remove(
                        "active"
                    );

            }
        );


    $("cartOverlay")
        .addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    $("cartOverlay")
                ) {

                    $("cartOverlay")
                        .classList.remove(
                            "active"
                        );

                }

            }
        );


    $("cartItems")
        .addEventListener(
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


    $("checkout")
        .addEventListener(
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
                    .classList.remove(
                        "active"
                    );


                showToast(
                    "Demo checkout completed!"
                );

            }
        );

}


/* ============================================================
   PRODUCT EVENTS
============================================================ */

function setupProductEvents() {

    $("productGrid")
        .addEventListener(
            "click",
            event => {

                const addButton =
                    event.target.closest(
                        "[data-add]"
                    );


                if (addButton) {

                    addCart(
                        addButton.dataset.add
                    );

                    return;

                }


                const product =
                    event.target.closest(
                        ".product"
                    );


                if (product) {

                    openProduct(
                        product.dataset.id
                    );

                }

            }
        );


    $("recommendGrid")
        .addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest(
                        "[data-rec]"
                    );


                if (button) {

                    addCart(
                        button.dataset.rec
                    );

                }

            }
        );


    $("closeProduct")
        .addEventListener(
            "click",
            () => {

                $("productOverlay")
                    .classList.remove(
                        "active"
                    );

            }
        );


    $("productOverlay")
        .addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    $("productOverlay")
                ) {

                    $("productOverlay")
                        .classList.remove(
                            "active"
                        );

                }

            }
        );


    document.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "[data-modal-add]"
                );


            if (button) {

                addCart(
                    button.dataset.modalAdd
                );


                $("productOverlay")
                    .classList.remove(
                        "active"
                    );

            }

        }
    );

}


/* ============================================================
   EXPLORE BUTTON
============================================================ */

function setupExplore() {

    $("exploreButton")
        .addEventListener(
            "click",
            () => {

                $("products")
                    .scrollIntoView({
                        behavior:
                            "smooth"
                    });

            }
        );

}


/* ============================================================
   PERFORMANCE MONITORING
============================================================ */

function setupPerformance() {

    if (
        !window.PerformanceObserver
    ) {

        return;

    }


    /*
        LCP
    */

    try {

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
                        Math.round(
                            last.startTime
                        ) +
                        " ms";

                }

            }
        ).observe({

            type:
                "largest-contentful-paint",

            buffered:
                true

        });

    } catch {}


    /*
        CLS
    */

    try {

        let cls =
            0;


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
        ).observe({

            type:
                "layout-shift",

            buffered:
                true

        });

    } catch {}

}


/* ============================================================
   NETWORK CHANGE LISTENERS
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

                    applyMode();

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

                applyMode();

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

                applyMode();

            }

        }
    );

}


/* ============================================================
   ESC KEY
============================================================ */

function setupEscape() {

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Escape"
            ) {

                $("configOverlay")
                    .classList.remove(
                        "active"
                    );

                $("cartOverlay")
                    .classList.remove(
                        "active"
                    );

                $("productOverlay")
                    .classList.remove(
                        "active"
                    );

            }

        }
    );

}


/* ============================================================
   INITIALIZATION
============================================================ */

function init() {

    setupConfig();

    setupChoices();

    setupCategories();

    setupSearch();

    setupCart();

    setupProductEvents();

    setupExplore();

    setupNetworkListeners();

    setupEscape();

    setupPerformance();


    /*
        Initial adaptive decision
    */

    applyMode();


    /*
        Load backend products
    */

    loadProducts();

}


init();
