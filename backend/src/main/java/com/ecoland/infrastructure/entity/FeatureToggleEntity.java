package com.ecoland.infrastructure.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "feature_toggles")
public class FeatureToggleEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "feature_name", nullable = false, unique = true)
    private String featureName;

    @Column(name = "is_enabled", nullable = false)
    private boolean isEnabled;

    public FeatureToggleEntity() {
    }

    public FeatureToggleEntity(String featureName, boolean isEnabled) {
        this.featureName = featureName;
        this.isEnabled = isEnabled;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFeatureName() {
        return featureName;
    }

    public void setFeatureName(String featureName) {
        this.featureName = featureName;
    }

    public boolean isEnabled() {
        return isEnabled;
    }

    public void setEnabled(boolean enabled) {
        isEnabled = enabled;
    }
}
