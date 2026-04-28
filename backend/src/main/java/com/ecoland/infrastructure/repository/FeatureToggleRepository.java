package com.ecoland.infrastructure.repository;

import com.ecoland.infrastructure.entity.FeatureToggleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FeatureToggleRepository extends JpaRepository<FeatureToggleEntity, Long> {
    Optional<FeatureToggleEntity> findByFeatureName(String featureName);
}
