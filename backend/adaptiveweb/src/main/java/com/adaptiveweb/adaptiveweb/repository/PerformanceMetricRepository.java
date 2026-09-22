package com.adaptiveweb.adaptiveweb.repository;

import com.adaptiveweb.adaptiveweb.entity.PerformanceMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PerformanceMetricRepository extends JpaRepository<PerformanceMetric, Long> {
    List<PerformanceMetric> findTop20ByOrderByRecordedAtDesc();
}
