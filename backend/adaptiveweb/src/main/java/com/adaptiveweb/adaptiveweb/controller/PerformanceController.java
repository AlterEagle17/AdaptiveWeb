package com.adaptiveweb.adaptiveweb.controller;

import com.adaptiveweb.adaptiveweb.dto.ApiResponse;
import com.adaptiveweb.adaptiveweb.dto.PerformanceMetricDTO;
import com.adaptiveweb.adaptiveweb.entity.PerformanceMetric;
import com.adaptiveweb.adaptiveweb.service.PerformanceMetricService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/performance")
@CrossOrigin(origins = "*")
public class PerformanceController {

    private final PerformanceMetricService metricService;

    public PerformanceController(PerformanceMetricService metricService) {
        this.metricService = metricService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PerformanceMetric>> recordMetrics(@RequestBody PerformanceMetricDTO dto) {
        PerformanceMetric saved = metricService.recordMetric(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Performance metrics recorded", saved));
    }

    @GetMapping
    public ResponseEntity<List<PerformanceMetric>> getRecentMetrics() {
        return ResponseEntity.ok(metricService.getRecentMetrics());
    }
}
