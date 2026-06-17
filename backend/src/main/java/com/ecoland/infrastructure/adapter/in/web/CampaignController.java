package com.ecoland.infrastructure.adapter.in.web;

import com.ecoland.domain.model.Campaign;
import com.ecoland.domain.port.in.CampaignUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
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
    @Operation(summary = "Obtener todas las campañas", description = "Retorna una lista de todas las campañas, opcionalmente filtradas por categoría.")
    public List<Campaign> getAll(@RequestParam(required = false) com.ecoland.domain.model.CampaignCategory category) {
        if (category != null) {
            return campaignUseCase.getCampaignsByCategory(category);
        }
        return campaignUseCase.getAllCampaigns();
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
    @Operation(summary = "Crear una nueva campaña", description = "Crea una campaña. Requiere rol ADMINISTRADOR o LIDER.", security = @SecurityRequirement(name = "Bearer Authentication"))
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
