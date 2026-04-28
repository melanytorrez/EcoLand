package com.ecoland.application.service;

import com.ecoland.infrastructure.config.FeatureToggleProperties;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class FeatureToggleService {

    private final FeatureToggleProperties properties;

    public FeatureToggleService(FeatureToggleProperties properties) {
        this.properties = properties;
    }

    public boolean isEnabled(String featureName) {
        if (featureName == null || featureName.trim().isEmpty()) {
            return false;
        }
        // Resiliencia: Si no existe el toggle, asumimos que esta desactivado por seguridad
        return properties.getToggles().getOrDefault(featureName, false);
    }

    public Map<String, Boolean> getAllToggles() {
        return properties.getToggles();
    }
}
