package com.ecoland.infrastructure.adapter.in.web;

import com.ecoland.application.dto.ErrorResponseDto;
import com.ecoland.domain.model.Campaign;
import com.ecoland.domain.port.in.CampaignUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/campaigns")
@Tag(name = "Campaigns", description = "Endpoints para la gestión de campañas ambientales")
public class CampaignController {

    private final CampaignUseCase campaignUseCase;

    public CampaignController(CampaignUseCase campaignUseCase) {
        this.campaignUseCase = campaignUseCase;
    }

    @GetMapping
    @Operation(summary = "Obtener todas las campañas", description = "Retorna una lista de todas las campañas de reforestación registradas.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Lista de campañas obtenida exitosamente", content = @Content(array = @ArraySchema(schema = @Schema(implementation = Campaign.class)))),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
    })
    public ResponseEntity<List<Campaign>> getAll(@RequestParam(required = false) com.ecoland.domain.model.CampaignCategory category) {
        if (category != null) {
            return ResponseEntity.ok(campaignUseCase.getCampaignsByCategory(category));
        }
        return ResponseEntity.ok(campaignUseCase.getAllCampaigns());
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('LIDER')")
    public List<Campaign> getMyCampaigns() {
        return campaignUseCase.getMyCampaigns();
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public List<Campaign> getPendingCampaigns() {
        return campaignUseCase.getPendingCampaigns();
    }

    @GetMapping("/{id}")
    public Campaign getById(@PathVariable Long id) {
        return campaignUseCase.getCampaignById(id);
    }

    @PostMapping("/{id}/participate")
    public ResponseEntity<?> participate(@PathVariable Long id, Authentication authentication) {
        if (authentication == null || authentication.getName() == null || authentication.getName().isBlank()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Debes iniciar sesion para participar en una campana");
        }

        try {
            Campaign updatedCampaign = campaignUseCase.participateInCampaign(id, authentication.getName());
            return ResponseEntity.ok(updatedCampaign);
        } catch (IllegalStateException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'LIDER')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Crear nueva campaña", description = "Registra una nueva campaña de reforestación. Requiere rol de Administrador o Líder.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Campaña creada exitosamente", content = @Content(schema = @Schema(implementation = Campaign.class))),
        @ApiResponse(responseCode = "400", description = "Datos de campaña inválidos", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class))),
        @ApiResponse(responseCode = "401", description = "No autorizado", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class))),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
    })
    public Campaign create(@RequestBody Campaign campaign) {
        return campaignUseCase.saveCampaign(campaign);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'LIDER')")
    public Campaign update(@PathVariable Long id, @RequestBody Campaign campaign) {
        return campaignUseCase.updateCampaign(id, campaign);
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<?> approve(@PathVariable Long id, @RequestParam(required = false) String comment) {
        try {
            Campaign approved = campaignUseCase.approveCampaign(id, comment);
            return ResponseEntity.ok(approved);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<?> reject(@PathVariable Long id, @RequestParam(required = false) String comment) {
        try {
            Campaign rejected = campaignUseCase.rejectCampaign(id, comment);
            return ResponseEntity.ok(rejected);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'LIDER')")
    public void delete(@PathVariable Long id) {
        campaignUseCase.deleteCampaign(id);
    }
}
