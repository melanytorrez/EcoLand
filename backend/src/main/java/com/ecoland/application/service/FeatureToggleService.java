package com.ecoland.application.service;

import com.ecoland.infrastructure.entity.FeatureToggleEntity;
import com.ecoland.infrastructure.repository.FeatureToggleRepository;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class FeatureToggleService {

    private static final Set<String> REMOVED_FEATURES = Set.of("reforestacion", "reciclaje");

    private final FeatureToggleRepository repository;

    public FeatureToggleService(FeatureToggleRepository repository) {
        this.repository = repository;
    }

    public boolean isEnabled(String featureName) {
        if (featureName == null || featureName.trim().isEmpty()) {
            return false;
        }
        if (isRemovedFeature(featureName)) {
            return true;
        }
        return repository.findByFeatureName(featureName)
                .map(FeatureToggleEntity::isEnabled)
                .orElse(false); // Resiliencia: Si no existe, false por seguridad
    }

    public Map<String, Boolean> getAllToggles() {
        return repository.findAll().stream()
                .filter(toggle -> !isRemovedFeature(toggle.getFeatureName()))
                .collect(Collectors.toMap(
                        FeatureToggleEntity::getFeatureName,
                        FeatureToggleEntity::isEnabled
                ));
    }

    public void updateToggle(String featureName, boolean isEnabled) {
        if (isRemovedFeature(featureName)) {
            return;
        }
        FeatureToggleEntity entity = repository.findByFeatureName(featureName)
                .orElseGet(() -> new FeatureToggleEntity(featureName, isEnabled));
        entity.setEnabled(isEnabled);
        repository.save(entity);
    }

    private boolean isRemovedFeature(String featureName) {
        return REMOVED_FEATURES.stream().anyMatch(f -> f.equalsIgnoreCase(featureName));
    }
}
