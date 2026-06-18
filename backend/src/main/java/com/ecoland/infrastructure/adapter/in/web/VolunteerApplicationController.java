package com.ecoland.infrastructure.adapter.in.web;

import com.ecoland.application.dto.ErrorResponseDto;
import com.ecoland.application.dto.VolunteerApplicationRequest;
import com.ecoland.application.dto.VolunteerApplicationResponse;
import com.ecoland.domain.model.VolunteerApplication;
import com.ecoland.domain.port.in.VolunteerApplicationUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
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
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Postular como voluntario", description = "Envía una solicitud de voluntariado para una campaña específica.")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Postulación enviada exitosamente", content = @Content(schema = @Schema(implementation = VolunteerApplicationResponse.class))),
        @ApiResponse(responseCode = "400", description = "Datos inválidos", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class))),
        @ApiResponse(responseCode = "401", description = "No autorizado", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class))),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
    })
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
    @Operation(summary = "Listar postulaciones por campaña", description = "Retorna todas las postulaciones recibidas para una campaña específica.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Lista obtenida", content = @Content(array = @ArraySchema(schema = @Schema(implementation = VolunteerApplicationResponse.class)))),
        @ApiResponse(responseCode = "404", description = "Campaña no encontrada", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class))),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
    })
    public ResponseEntity<List<VolunteerApplicationResponse>> getByCampaign(@PathVariable Long campaignId) {
        return ResponseEntity.ok(
                volunteerApplicationUseCase.getApplicationsByCampaign(campaignId).stream()
                        .map(VolunteerApplicationResponse::fromDomain)
                        .toList()
        );
    }

    @GetMapping("/campaign/{campaignId}/me")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Ver mi postulación en una campaña", description = "Retorna el estado de la postulación del usuario actual para una campaña.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Postulación encontrada", content = @Content(schema = @Schema(implementation = VolunteerApplicationResponse.class))),
        @ApiResponse(responseCode = "401", description = "No autorizado", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class))),
        @ApiResponse(responseCode = "404", description = "Postulación no encontrada", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class))),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
    })
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