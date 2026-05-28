package com.ecoland.application.service;

import com.ecoland.domain.model.Campaign;
import com.ecoland.domain.model.CampaignCategory;
import com.ecoland.domain.model.VolunteerApplication;
import com.ecoland.domain.model.VolunteerStatus;
import com.ecoland.domain.port.in.VolunteerApplicationUseCase;
import com.ecoland.domain.port.out.CampaignRepositoryPort;
import com.ecoland.domain.port.out.VolunteerApplicationRepositoryPort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
@Transactional
public class VolunteerApplicationService implements VolunteerApplicationUseCase {

    private final VolunteerApplicationRepositoryPort volunteerApplicationRepositoryPort;
    private final CampaignRepositoryPort campaignRepositoryPort;

    public VolunteerApplicationService(VolunteerApplicationRepositoryPort volunteerApplicationRepositoryPort,
                                       CampaignRepositoryPort campaignRepositoryPort) {
        this.volunteerApplicationRepositoryPort = volunteerApplicationRepositoryPort;
        this.campaignRepositoryPort = campaignRepositoryPort;
    }

    @Override
    public VolunteerApplication apply(VolunteerApplication application) {
        Campaign campaign = getCampaignOrThrow(application.getCampaignId());

        if (campaign.getCategory() != null && campaign.getCategory() != CampaignCategory.REFORESTATION) {
            throw new IllegalStateException("Solo puedes postularte a campañas de reforestación");
        }

        if (volunteerApplicationRepositoryPort.existsByEmailAndCampaignId(application.getUsuarioEmail(), application.getCampaignId())) {
            throw new IllegalStateException("Ya existe una postulación para esta campaña");
        }

        if (campaign.getParticipants() >= campaign.getSpots()) {
            throw new IllegalStateException("La campaña ya no tiene cupos disponibles");
        }

        application.setStatus(VolunteerStatus.PENDING);
        application.setFechaPostulacion(LocalDateTime.now());
        application.setAdminNotes(null);
        return volunteerApplicationRepositoryPort.save(application);
    }

    @Override
    public List<VolunteerApplication> getApplicationsByCampaign(Long campaignId) {
        return volunteerApplicationRepositoryPort.findByCampaignId(campaignId);
    }

    @Override
    public List<VolunteerApplication> getApplicationsByStatus(VolunteerStatus status) {
        return volunteerApplicationRepositoryPort.findByStatus(status);
    }

    @Override
    public Optional<VolunteerApplication> getMyApplication(Long campaignId, String email) {
        return volunteerApplicationRepositoryPort.findByEmailAndCampaignId(email, campaignId);
    }

    @Override
    public VolunteerApplication approveApplication(Long applicationId) {
        VolunteerApplication application = volunteerApplicationRepositoryPort.findById(applicationId)
                .orElseThrow(() -> new NoSuchElementException("No se encontró la postulación con id " + applicationId));

        if (application.getStatus() != VolunteerStatus.PENDING) {
            throw new IllegalStateException("Solo se pueden aprobar postulaciones pendientes");
        }

        Campaign campaign = getCampaignOrThrow(application.getCampaignId());
        if (campaign.getParticipants() >= campaign.getSpots()) {
            throw new IllegalStateException("La campaña ya no tiene cupos disponibles");
        }

        application.setStatus(VolunteerStatus.ACCEPTED);
        VolunteerApplication savedApplication = volunteerApplicationRepositoryPort.save(application);

        campaign.setParticipants(campaign.getParticipants() + 1);
        campaignRepositoryPort.save(campaign);

        return savedApplication;
    }

    @Override
    public VolunteerApplication rejectApplication(Long applicationId, String adminNotes) {
        VolunteerApplication application = volunteerApplicationRepositoryPort.findById(applicationId)
                .orElseThrow(() -> new NoSuchElementException("No se encontró la postulación con id " + applicationId));

        if (application.getStatus() != VolunteerStatus.PENDING) {
            throw new IllegalStateException("Solo se pueden rechazar postulaciones pendientes");
        }

        application.setStatus(VolunteerStatus.REJECTED);
        application.setAdminNotes(adminNotes);
        return volunteerApplicationRepositoryPort.save(application);
    }

    private Campaign getCampaignOrThrow(Long campaignId) {
        return campaignRepositoryPort.findById(campaignId)
                .orElseThrow(() -> new NoSuchElementException("No se encontró la campaña con id " + campaignId));
    }
}