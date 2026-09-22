package com.adaptiveweb.adaptiveweb.controller;

import com.adaptiveweb.adaptiveweb.entity.AdaptiveRule;
import com.adaptiveweb.adaptiveweb.service.AdaptiveRuleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/adaptive-rules")
@CrossOrigin(origins = "*")
public class AdaptiveRuleController {

    private final AdaptiveRuleService ruleService;

    public AdaptiveRuleController(AdaptiveRuleService ruleService) {
        this.ruleService = ruleService;
    }

    @GetMapping
    public ResponseEntity<List<AdaptiveRule>> getRules(
            @RequestParam(required = false) String network,
            @RequestParam(required = false) String device) {
        if (network != null && device != null) {
            return ruleService.getRuleForEnvironment(network, device)
                    .map(r -> ResponseEntity.ok(List.of(r)))
                    .orElse(ResponseEntity.ok(List.of()));
        }
        return ResponseEntity.ok(ruleService.getAllRules());
    }
}
