package com.adaptiveweb.adaptiveweb.config;

import com.adaptiveweb.adaptiveweb.entity.AdaptiveRule;
import com.adaptiveweb.adaptiveweb.entity.Category;
import com.adaptiveweb.adaptiveweb.entity.Product;
import com.adaptiveweb.adaptiveweb.repository.AdaptiveRuleRepository;
import com.adaptiveweb.adaptiveweb.repository.CategoryRepository;
import com.adaptiveweb.adaptiveweb.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final AdaptiveRuleRepository ruleRepository;

    public DataInitializer(ProductRepository productRepository,
                           CategoryRepository categoryRepository,
                           AdaptiveRuleRepository ruleRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.ruleRepository = ruleRepository;
    }

    @Override
    public void run(String... args) {
        if (categoryRepository.count() == 0) {
            seedCategories();
        }
        if (productRepository.count() == 0) {
            seedProducts();
        }
        if (ruleRepository.count() == 0) {
            seedAdaptiveRules();
        }
    }

    private void seedCategories() {
        categoryRepository.saveAll(List.of(
                new Category("SMARTPHONES", "Smartphones", "📱", "Next-gen 5G phones and flagship foldables"),
                new Category("LAPTOPS", "Laptops & Displays", "💻", "Pro workstation laptops and ultra-clear 4K panels"),
                new Category("AUDIO", "Audio & Acoustics", "🎧", "Spatial audio, studio speakers and ANC headphones"),
                new Category("ACCESSORIES", "Accessories & Gear", "⌚", "Titanium smartwatches, mechanical keyboards and mice")
        ));
    }

    private void seedProducts() {
        productRepository.saveAll(List.of(
                new Product("Nova X Pro 5G", "SMARTPHONES", BigDecimal.valueOf(69999),
                        "Adaptive 120Hz LTPO OLED display with Neural Coprocessor, 200MP camera, and 5G dual-SIM.",
                        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=85",
                        4.9, 342, "✦ Flagship", "6.8\" Quad-HD+ OLED, Snapdragon 8 Gen 3, 5000mAh battery, 45W SuperVOOC", "HIGH"),

                new Product("UltraBook Pro 16", "LAPTOPS", BigDecimal.valueOf(149999),
                        "Liquid Retina XDR workstation with 16-core CPU architecture, 32GB unified RAM, and 36-hour battery.",
                        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1000&q=85",
                        4.8, 189, "✦ Pro Power", "16.2\" Mini-LED 120Hz, 16-Core M3 Max, 1TB Gen4 NVMe, MagSafe 3 & TB4", "HIGH"),

                new Product("Sonic Pro Wireless ANC", "AUDIO", BigDecimal.valueOf(18999),
                        "Active noise cancelling with 40mm beryllium drivers, spatial acoustics, and 48-hour playback.",
                        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=85",
                        4.9, 512, "✦ Hi-Res Audio", "Hybrid Adaptive ANC, LDAC & aptX Lossless, Multipoint Bluetooth 5.4, Memory foam", "HIGH"),

                new Product("Vision Watch Ultra", "ACCESSORIES", BigDecimal.valueOf(42999),
                        "Aerospace titanium chassis, sapphire crystal display, dual-frequency GPS, and 100m water resistance.",
                        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=85",
                        4.7, 220, "✦ Titanium", "Grade 5 Titanium, 3000-nit OLED, Dual-band L1/L5 GPS, ECG & Blood Oxygen", "MEDIUM"),

                new Product("UltraTab Pro 12.9", "SMARTPHONES", BigDecimal.valueOf(89999),
                        "Creative touchscreen canvas powered by octa-core silicon with magnetic stylus sync and stage manager.",
                        "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1000&q=85",
                        4.8, 147, "✦ 120Hz Retina", "12.9\" ProMotion OLED, 8-Core Silicon, Apple Pencil Pro support, Quad studio speakers", "MEDIUM"),

                new Product("Apex Mechanical Keyboard", "ACCESSORIES", BigDecimal.valueOf(9499),
                        "CNC aircraft aluminum body with hot-swappable tactile switches, gasket mount, and per-key RGB.",
                        "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=85",
                        4.9, 410, "✦ Custom", "Gasket Mount structure, Gateron Oil King switches, Tri-mode 2.4G/BT/Wired, PBT keycaps", "MEDIUM"),

                new Product("Titan 4K Gaming Display", "LAPTOPS", BigDecimal.valueOf(44999),
                        "32-inch 4K Fast IPS panel with 1ms GTG response, DisplayHDR 600 clarity, and 98% DCI-P3 color gamut.",
                        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1000&q=85",
                        4.6, 95, "✦ 144Hz HDR", "3840x2160 IPS 144Hz, DisplayHDR 600 certified, HDMI 2.1 & DP 1.4, FreeSync Premium", "LOW"),

                new Product("Pulse 360 Studio Speaker", "AUDIO", BigDecimal.valueOf(14999),
                        "Lossless spatial audio projection with real-time acoustic room mapping and AirPlay 2 connectivity.",
                        "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=1000&q=85",
                        4.8, 310, "✦ 360° Sound", "Spatial Audio DSP, Dual downward subwoofers, Wi-Fi 6 streaming, Smart voice control", "LOW"),

                new Product("Alpha 7R Mirrorless Camera", "ACCESSORIES", BigDecimal.valueOf(189999),
                        "Full-frame back-illuminated sensor with AI real-time tracking autofocus and 8-stop image stabilization.",
                        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=85",
                        5.0, 88, "✦ 61MP 8K", "61.0MP Full-Frame Exmor R, BIONZ XR AI processing, 8K 24p & 4K 60p 10-bit, CFexpress", "LOW"),

                new Product("Aeroflex Wireless Mouse", "ACCESSORIES", BigDecimal.valueOf(6999),
                        "Zero-latency 26K DPI optical sensor with honeycomb lightweight chassis and 90-hour continuous battery.",
                        "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1000&q=85",
                        4.7, 275, "✦ Ultralight 49g", "PAW3395 26,000 DPI sensor, Ultra-light 49 grams, Nordic 52840 MCU, Pure PTFE skate feet", "LOW")
        ));
    }

    private void seedAdaptiveRules() {
        // Complete 9-condition Weakest Link Rule matrix.
        // Every tier keeps the full catalog; only delivery and animation cost changes.
        ruleRepository.saveAll(List.of(
                new AdaptiveRule("HIGH", "HIGH", "HIGH", 10, 85, "FULL", true, "FULL"),
                new AdaptiveRule("HIGH", "MEDIUM", "MEDIUM", 10, 65, "REDUCED", false, "BALANCED"),
                new AdaptiveRule("HIGH", "LOW", "LOW", 10, 40, "OFF", false, "ESSENTIAL"),
                new AdaptiveRule("MEDIUM", "HIGH", "MEDIUM", 10, 65, "REDUCED", false, "BALANCED"),
                new AdaptiveRule("MEDIUM", "MEDIUM", "MEDIUM", 10, 65, "REDUCED", false, "BALANCED"),
                new AdaptiveRule("MEDIUM", "LOW", "LOW", 10, 40, "OFF", false, "ESSENTIAL"),
                new AdaptiveRule("LOW", "HIGH", "LOW", 10, 40, "OFF", false, "ESSENTIAL"),
                new AdaptiveRule("LOW", "MEDIUM", "LOW", 10, 40, "OFF", false, "ESSENTIAL"),
                new AdaptiveRule("LOW", "LOW", "LOW", 10, 40, "OFF", false, "ESSENTIAL")
        ));
    }
}
