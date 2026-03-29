package com.ecoland.infrastructure.adapter.in.web;

import com.ecoland.domain.model.Campaign;
import com.ecoland.domain.port.in.CampaignUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/api/v1/campaigns")
public class CampaignController {

    private final CampaignUseCase campaignUseCase;

    public CampaignController(CampaignUseCase campaignUseCase) {
        this.campaignUseCase = campaignUseCase;
    }

    @GetMapping
    public ResponseEntity<List<Campaign>> getCampaigns() {
        return ResponseEntity.ok(campaignUseCase.getAllCampaigns());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Campaign> getCampaignById(@PathVariable Long id) {
        return campaignUseCase.getCampaignById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/participate")
    public ResponseEntity<?> participateInCampaign(@PathVariable Long id, Authentication authentication) {
        if (authentication == null || authentication.getName() == null || authentication.getName().isBlank()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Debes iniciar sesion para participar");
        }

        try {
            Campaign updatedCampaign = campaignUseCase.participateInCampaign(id, authentication.getName());
            return ResponseEntity.ok(updatedCampaign);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }
}
