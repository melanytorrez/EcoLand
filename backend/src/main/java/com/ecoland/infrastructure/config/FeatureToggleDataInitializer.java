package com.ecoland.infrastructure.config;

import com.ecoland.infrastructure.entity.FeatureToggleEntity;
import com.ecoland.infrastructure.repository.FeatureToggleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;
import java.util.Optional;

@Configuration
public class FeatureToggleDataInitializer {

    @Bean
    CommandLineRunner initFeatureToggles(FeatureToggleRepository repository) {
        return args -> {
            // Inicializar modulos por defecto en true si no existen en DB
            String[] defaultFeatures = {"inicio", "reforestacion", "reciclaje", "estadisticas", "perfil"};
            
            for (String feature : defaultFeatures) {
                Optional<FeatureToggleEntity> existing = repository.findByFeatureName(feature);
                if (existing.isEmpty()) {
                    repository.save(new FeatureToggleEntity(feature, true));
                }
            }
        };
    }
}
