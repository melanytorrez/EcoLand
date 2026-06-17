package com.ecoland.infrastructure.adapter.in.web;

import com.ecoland.application.dto.VolunteerApplicationRequest;
import com.ecoland.application.dto.VolunteerApplicationResponse;
import com.ecoland.domain.model.VolunteerApplication;
import com.ecoland.domain.port.in.VolunteerApplicationUseCase;
import jakarta.validation.Valid;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/volunteer-applications")
@Tag(name = "Voluntariado", description = "Gestión de postulaciones para voluntarios")
public class VolunteerApplicationController {

    private final VolunteerApplicationUseCase volunteerApplicationUseCase;

    public VolunteerApplicationController(VolunteerApplicationUseCase volunteerApplicationUseCase) {
        this.volunteerApplicationUseCase = volunteerApplicationUseCase;
    }

    @PostMapping
    public ResponseEntity<VolunteerApplicationResponse> apply(@Valid @RequestBody VolunteerApplicationRequest request,
                                                              Authentication authentication) {
        if (authentication == null || authentication.getName() == null || authentication.getName().isBlank()) {
            throw new IllegalStateException("Debes iniciar sesión para postularte");
        }

        VolunteerApplication application = new VolunteerApplication();
        application.setCampaignId(request.getCampaignId());
        application.setUsuarioEmail(authentication.getName());
        application.setFullName(request.getFullName());
        application.setAge(request.getAge());
        application.setPhone(request.getPhone());
        application.setAvailableWeekends(request.getAvailableWeekends());
        application.setHasEnvironmentalExperience(request.getHasEnvironmentalExperience());
        application.setExperienceDetails(request.getExperienceDetails());
        application.setMotivation(request.getMotivation());
        application.setAvailabilityHours(request.getAvailabilityHours());

        VolunteerApplication saved = volunteerApplicationUseCase.apply(application);
        return ResponseEntity.status(HttpStatus.CREATED).body(VolunteerApplicationResponse.fromDomain(saved));
    }

    @GetMapping("/campaign/{campaignId}")
    public ResponseEntity<List<VolunteerApplicationResponse>> getByCampaign(@PathVariable Long campaignId) {
        return ResponseEntity.ok(
                volunteerApplicationUseCase.getApplicationsByCampaign(campaignId).stream()
                        .map(VolunteerApplicationResponse::fromDomain)
                        .toList()
        );
    }

    @GetMapping("/campaign/{campaignId}/me")
    public ResponseEntity<VolunteerApplicationResponse> getMyApplication(@PathVariable Long campaignId,
                                                                         Authentication authentication) {
        if (authentication == null || authentication.getName() == null || authentication.getName().isBlank()) {
            throw new IllegalStateException("Debes iniciar sesión para consultar tu postulación");
        }

        return volunteerApplicationUseCase.getMyApplication(campaignId, authentication.getName())
                .map(application -> ResponseEntity.ok(VolunteerApplicationResponse.fromDomain(application)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}