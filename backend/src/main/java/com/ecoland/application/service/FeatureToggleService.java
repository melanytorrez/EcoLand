package com.ecoland.application.service;

import com.ecoland.infrastructure.entity.FeatureToggleEntity;
import com.ecoland.infrastructure.repository.FeatureToggleRepository;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.stream.Collectors;

@Service
public class FeatureToggleService {

    private final FeatureToggleRepository repository;

    public FeatureToggleService(FeatureToggleRepository repository) {
        this.repository = repository;
    }

    public boolean isEnabled(String featureName) {
        if (featureName == null || featureName.trim().isEmpty()) {
            return false;
        }
        return repository.findByFeatureName(featureName)
                .map(FeatureToggleEntity::isEnabled)
                .orElse(false); // Resiliencia: Si no existe, false por seguridad
    }

    public Map<String, Boolean> getAllToggles() {
        return repository.findAll().stream()
                .collect(Collectors.toMap(
                        FeatureToggleEntity::getFeatureName,
                        FeatureToggleEntity::isEnabled
                ));
    }
    
    public void updateToggle(String featureName, boolean isEnabled) {
        FeatureToggleEntity entity = repository.findByFeatureName(featureName)
                .orElseGet(() -> new FeatureToggleEntity(featureName, isEnabled));
        entity.setEnabled(isEnabled);
        repository.save(entity);
    }
}
