package com.ecoland.infrastructure.security;

import com.ecoland.application.service.FeatureToggleService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class FeatureToggleInterceptor implements HandlerInterceptor {

    private final FeatureToggleService featureToggleService;

    public FeatureToggleInterceptor(FeatureToggleService featureToggleService) {
        this.featureToggleService = featureToggleService;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if (handler instanceof HandlerMethod) {
            HandlerMethod handlerMethod = (HandlerMethod) handler;
            
            // Buscar anotacion en el metodo
            RequireFeature methodAnnotation = handlerMethod.getMethodAnnotation(RequireFeature.class);
            // Buscar anotacion en la clase
            RequireFeature classAnnotation = handlerMethod.getBeanType().getAnnotation(RequireFeature.class);

            RequireFeature featureAnnotation = methodAnnotation != null ? methodAnnotation : classAnnotation;

            if (featureAnnotation != null) {
                String featureName = featureAnnotation.value();
                if (!featureToggleService.isEnabled(featureName)) {
                    response.setStatus(HttpStatus.FORBIDDEN.value());
                    response.getWriter().write("{\"error\": \"Feature '" + featureName + "' is currently disabled.\"}");
                    response.setContentType("application/json");
                    return false;
                }
            }
        }
        return true;
    }
}
