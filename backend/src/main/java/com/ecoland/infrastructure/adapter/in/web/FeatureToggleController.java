package com.ecoland.infrastructure.adapter.in.web;

import com.ecoland.application.service.FeatureToggleService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/features")
@CrossOrigin(origins = "*")
public class FeatureToggleController {

    private final FeatureToggleService featureToggleService;

    public FeatureToggleController(FeatureToggleService featureToggleService) {
        this.featureToggleService = featureToggleService;
    }

    @GetMapping
    public Map<String, Boolean> getAllFeatures() {
        return featureToggleService.getAllToggles();
    }

    @PutMapping("/{featureName}")
    public void updateFeature(@PathVariable String featureName, @RequestParam boolean enabled) {
        featureToggleService.updateToggle(featureName, enabled);
    }
}
