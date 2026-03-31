package com.ecoland.application.service;

import com.ecoland.domain.model.Campaign;
import com.ecoland.domain.port.in.CampaignUseCase;
import com.ecoland.domain.port.out.CampaignRepositoryPort;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class CampaignService implements CampaignUseCase {

    private final CampaignRepositoryPort campaignRepositoryPort;

    public CampaignService(CampaignRepositoryPort campaignRepositoryPort) {
        this.campaignRepositoryPort = campaignRepositoryPort;
        seedData();
    }

    @Override
    public List<Campaign> getAllCampaigns() {
        return campaignRepositoryPort.findAll();
    }

    @Override
    public Campaign getCampaignById(Long id) {
        return campaignRepositoryPort.findById(id)
                .orElseThrow(() -> new RuntimeException("Campaign not found with id " + id));
    }

    @Override
    public Campaign saveCampaign(Campaign campaign) {
        return campaignRepositoryPort.save(campaign);
    }

    @Override
    public Campaign updateCampaign(Long id, Campaign campaign) {
        Campaign existingCampaign = getCampaignById(id);

        existingCampaign.setImage(campaign.getImage());
        existingCampaign.setTitle(campaign.getTitle());
        existingCampaign.setDate(campaign.getDate());
        existingCampaign.setTime(campaign.getTime());
        existingCampaign.setLocation(campaign.getLocation());
        existingCampaign.setAddress(campaign.getAddress());
        existingCampaign.setSpots(campaign.getSpots());
        existingCampaign.setParticipants(campaign.getParticipants());
        existingCampaign.setOrganizer(campaign.getOrganizer());
        existingCampaign.setOrganizerContact(campaign.getOrganizerContact());
        existingCampaign.setStatus(campaign.getStatus());
        existingCampaign.setDescription(campaign.getDescription());
        existingCampaign.setRequirements(campaign.getRequirements());

        return campaignRepositoryPort.save(existingCampaign);
    }

    @Override
    public void deleteCampaign(Long id) {
        campaignRepositoryPort.deleteById(id);
    }

    private void seedData() {
        if (campaignRepositoryPort.findAll().isEmpty()) {
            Campaign c1 = new Campaign();
            c1.setTitle("Reforestación en el Parque Central");
            c1.setImage(
                    "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2026&auto=format&fit=crop");
            c1.setDate("2026-04-15");
            c1.setTime("09:00");
            c1.setLocation("Parque Central, Ciudad");
            c1.setAddress("Av. de las Américas 123");
            c1.setSpots(50);
            c1.setParticipants(12);
            c1.setOrganizer("EcoLand Team");
            c1.setStatus("Activa");
            c1.setDescription("Únete a nosotros para plantar más de 200 árboles nativos.");
            c1.setRequirements(Arrays.asList("Guantes de trabajo", "Agua personal", "Ropa cómoda"));
            campaignRepositoryPort.save(c1);

            Campaign c2 = new Campaign();
            c2.setTitle("Siembra un Árbol, Siembra Futuro");
            c2.setImage(
                    "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=2070&auto=format&fit=crop");
            c2.setDate("2026-05-20");
            c2.setTime("10:30");
            c2.setLocation("Reserva Natural Norte");
            c2.setAddress("KM 15 Carretera al Norte");
            c2.setSpots(100);
            c2.setParticipants(45);
            c2.setOrganizer("Comunidad EcoSostenible");
            c2.setStatus("Activa");
            c2.setDescription("Campaña masiva de reforestación para recuperar el pulmón de la zona norte.");
            c2.setRequirements(Arrays.asList("Pala pequeña", "Protector solar"));
            campaignRepositoryPort.save(c2);
        }
    }
}
