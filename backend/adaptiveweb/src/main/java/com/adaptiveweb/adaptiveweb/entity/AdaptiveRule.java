package com.adaptiveweb.adaptiveweb.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "adaptive_rules")
public class AdaptiveRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String networkTier; // HIGH, MEDIUM, LOW

    @Column(nullable = false)
    private String deviceTier; // HIGH, MEDIUM, LOW

    @Column(nullable = false)
    private String finalMode; // HIGH, MEDIUM, LOW

    private Integer maxProducts;

    private Integer imageQuality;

    private String animations;

    private Boolean prefetchEnabled;

    private String jsStrategy;

    public AdaptiveRule() {}

    public AdaptiveRule(String networkTier, String deviceTier, String finalMode,
                        Integer maxProducts, Integer imageQuality, String animations,
                        Boolean prefetchEnabled, String jsStrategy) {
        this.networkTier = networkTier;
        this.deviceTier = deviceTier;
        this.finalMode = finalMode;
        this.maxProducts = maxProducts;
        this.imageQuality = imageQuality;
        this.animations = animations;
        this.prefetchEnabled = prefetchEnabled;
        this.jsStrategy = jsStrategy;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNetworkTier() { return networkTier; }
    public void setNetworkTier(String networkTier) { this.networkTier = networkTier; }

    public String getDeviceTier() { return deviceTier; }
    public void setDeviceTier(String deviceTier) { this.deviceTier = deviceTier; }

    public String getFinalMode() { return finalMode; }
    public void setFinalMode(String finalMode) { this.finalMode = finalMode; }

    public Integer getMaxProducts() { return maxProducts; }
    public void setMaxProducts(Integer maxProducts) { this.maxProducts = maxProducts; }

    public Integer getImageQuality() { return imageQuality; }
    public void setImageQuality(Integer imageQuality) { this.imageQuality = imageQuality; }

    public String getAnimations() { return animations; }
    public void setAnimations(String animations) { this.animations = animations; }

    public Boolean getPrefetchEnabled() { return prefetchEnabled; }
    public void setPrefetchEnabled(Boolean prefetchEnabled) { this.prefetchEnabled = prefetchEnabled; }

    public String getJsStrategy() { return jsStrategy; }
    public void setJsStrategy(String jsStrategy) { this.jsStrategy = jsStrategy; }
}
