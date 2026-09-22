package com.adaptiveweb.adaptiveweb.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "performance_metrics")
public class PerformanceMetric {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double lcp; // in seconds

    private Double cls;

    private Integer inp; // in ms

    private Integer pageLoadTime; // in ms

    private Integer domContentLoaded; // in ms

    private Integer resourceCount;

    private Long totalTransferBytes;

    private String adaptiveMode; // HIGH, MEDIUM, LOW

    private LocalDateTime recordedAt;

    public PerformanceMetric() {
        this.recordedAt = LocalDateTime.now();
    }

    public PerformanceMetric(Double lcp, Double cls, Integer inp, Integer pageLoadTime,
                             Integer domContentLoaded, Integer resourceCount,
                             Long totalTransferBytes, String adaptiveMode) {
        this();
        this.lcp = lcp;
        this.cls = cls;
        this.inp = inp;
        this.pageLoadTime = pageLoadTime;
        this.domContentLoaded = domContentLoaded;
        this.resourceCount = resourceCount;
        this.totalTransferBytes = totalTransferBytes;
        this.adaptiveMode = adaptiveMode;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Double getLcp() { return lcp; }
    public void setLcp(Double lcp) { this.lcp = lcp; }

    public Double getCls() { return cls; }
    public void setCls(Double cls) { this.cls = cls; }

    public Integer getInp() { return inp; }
    public void setInp(Integer inp) { this.inp = inp; }

    public Integer getPageLoadTime() { return pageLoadTime; }
    public void setPageLoadTime(Integer pageLoadTime) { this.pageLoadTime = pageLoadTime; }

    public Integer getDomContentLoaded() { return domContentLoaded; }
    public void setDomContentLoaded(Integer domContentLoaded) { this.domContentLoaded = domContentLoaded; }

    public Integer getResourceCount() { return resourceCount; }
    public void setResourceCount(Integer resourceCount) { this.resourceCount = resourceCount; }

    public Long getTotalTransferBytes() { return totalTransferBytes; }
    public void setTotalTransferBytes(Long totalTransferBytes) { this.totalTransferBytes = totalTransferBytes; }

    public String getAdaptiveMode() { return adaptiveMode; }
    public void setAdaptiveMode(String adaptiveMode) { this.adaptiveMode = adaptiveMode; }

    public LocalDateTime getRecordedAt() { return recordedAt; }
    public void setRecordedAt(LocalDateTime recordedAt) { this.recordedAt = recordedAt; }
}
