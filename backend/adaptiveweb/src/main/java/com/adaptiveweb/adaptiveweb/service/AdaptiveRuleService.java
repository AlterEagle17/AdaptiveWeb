package com.adaptiveweb.adaptiveweb.service;

import com.adaptiveweb.adaptiveweb.entity.AdaptiveRule;
import com.adaptiveweb.adaptiveweb.repository.AdaptiveRuleRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdaptiveRuleService {

    private final AdaptiveRuleRepository ruleRepository;

    public AdaptiveRuleService(AdaptiveRuleRepository ruleRepository) {
        this.ruleRepository = ruleRepository;
    }

    public List<AdaptiveRule> getAllRules() {
        return ruleRepository.findAll();
    }

    public Optional<AdaptiveRule> getRuleForEnvironment(String networkTier, String deviceTier) {
        return ruleRepository.findByNetworkTierAndDeviceTier(networkTier.toUpperCase(), deviceTier.toUpperCase());
    }

    public AdaptiveRule saveRule(AdaptiveRule rule) {
        return ruleRepository.save(rule);
    }
}
