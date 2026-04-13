package com.ecoland.infrastructure.adapter.in.web;

import com.ecoland.domain.model.Campaign;
import com.ecoland.domain.port.in.CampaignUseCase;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/campaigns")
public class CampaignController {

    private final CampaignUseCase campaignUseCase;

    public CampaignController(CampaignUseCase campaignUseCase) {
        this.campaignUseCase = campaignUseCase;
    }

    @GetMapping
    public List<Campaign> getAll() {
        return campaignUseCase.getAllCampaigns();
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
    public Campaign create(@RequestBody Campaign campaign) {
        return campaignUseCase.saveCampaign(campaign);
    }

    @PutMapping("/{id}")
    public Campaign update(@PathVariable Long id, @RequestBody Campaign campaign) {
        return campaignUseCase.updateCampaign(id, campaign);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        campaignUseCase.deleteCampaign(id);
    }
}
