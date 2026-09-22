package com.adaptiveweb.adaptiveweb.repository;

import com.adaptiveweb.adaptiveweb.entity.AdaptiveRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdaptiveRuleRepository extends JpaRepository<AdaptiveRule, Long> {
    Optional<AdaptiveRule> findByNetworkTierAndDeviceTier(String networkTier, String deviceTier);
}
