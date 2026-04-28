package com.ecoland.infrastructure.config;

import com.ecoland.infrastructure.security.FeatureToggleInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    private final FeatureToggleInterceptor featureToggleInterceptor;

    public WebMvcConfig(FeatureToggleInterceptor featureToggleInterceptor) {
        this.featureToggleInterceptor = featureToggleInterceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(featureToggleInterceptor)
                .addPathPatterns("/api/**")
                .excludePathPatterns("/api/features"); // Permitir siempre consultar el estado
    }
}
