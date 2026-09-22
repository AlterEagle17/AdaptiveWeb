package com.adaptiveweb.adaptiveweb.dto;

public class PerformanceMetricDTO {
    private Double lcp;
    private Double cls;
    private Integer inp;
    private Integer pageLoadTime;
    private Integer domContentLoaded;
    private Integer resourceCount;
    private Long totalTransferBytes;
    private String adaptiveMode;

    public PerformanceMetricDTO() {}

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
}
