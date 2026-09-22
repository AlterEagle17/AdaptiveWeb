package com.adaptiveweb.adaptiveweb.service;

import com.adaptiveweb.adaptiveweb.dto.PerformanceMetricDTO;
import com.adaptiveweb.adaptiveweb.entity.PerformanceMetric;
import com.adaptiveweb.adaptiveweb.repository.PerformanceMetricRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PerformanceMetricService {

    private final PerformanceMetricRepository metricRepository;

    public PerformanceMetricService(PerformanceMetricRepository metricRepository) {
        this.metricRepository = metricRepository;
    }

    public PerformanceMetric recordMetric(PerformanceMetricDTO dto) {
        PerformanceMetric metric = new PerformanceMetric(
                dto.getLcp(),
                dto.getCls(),
                dto.getInp(),
                dto.getPageLoadTime(),
                dto.getDomContentLoaded(),
                dto.getResourceCount(),
                dto.getTotalTransferBytes(),
                dto.getAdaptiveMode()
        );
        return metricRepository.save(metric);
    }

    public List<PerformanceMetric> getRecentMetrics() {
        return metricRepository.findTop20ByOrderByRecordedAtDesc();
    }
}
