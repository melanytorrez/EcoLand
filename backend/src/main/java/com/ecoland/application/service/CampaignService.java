package com.ecoland.application.service;

import com.ecoland.domain.model.Campaign;
import com.ecoland.domain.port.in.CampaignUseCase;
import com.ecoland.domain.port.out.CampaignRepositoryPort;
import com.ecoland.infrastructure.entity.UsuarioCampaignEntity;
import com.ecoland.infrastructure.repository.JpaUsuarioCampaignRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class CampaignService implements CampaignUseCase {

    private static final Logger logger = LoggerFactory.getLogger(CampaignService.class);

    private final CampaignRepositoryPort campaignRepositoryPort;
    private final JpaUsuarioCampaignRepository usuarioCampaignRepository;

    public CampaignService(CampaignRepositoryPort campaignRepositoryPort, JpaUsuarioCampaignRepository usuarioCampaignRepository) {
        this.campaignRepositoryPort = campaignRepositoryPort;
        this.usuarioCampaignRepository = usuarioCampaignRepository;
        seedData();
    }

    @Override
    public List<Campaign> getAllCampaigns() {
        logger.info("Solicitud para obtener todas las campañas");
        return campaignRepositoryPort.findAll();
    }

    @Override
    public Campaign getCampaignById(Long id) {
        logger.info("Solicitud para obtener la campaña con id: {}", id);
        return campaignRepositoryPort.findById(id)
                .orElseThrow(() -> {
                    logger.error("Error al obtener campaña: No se encontró la campaña con id {}", id);
                    return new RuntimeException("Campaign not found with id " + id);
                });
    }

    @Override
    public Campaign saveCampaign(Campaign campaign) {
        logger.info("Solicitud para crear nueva campaña con título: {}", campaign.getTitle());
        try {
            Campaign savedCampaign = campaignRepositoryPort.save(campaign);
            logger.info("Campaña creada exitosamente con id: {}", savedCampaign.getId());
            return savedCampaign;
        } catch (Exception e) {
            logger.error("Error al crear la campaña: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Override
    public Campaign updateCampaign(Long id, Campaign campaign) {
        logger.info("Solicitud para actualizar la campaña con id: {}", id);
        try {
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

            Campaign updatedCampaign = campaignRepositoryPort.save(existingCampaign);
            logger.info("Campaña con id: {} actualizada exitosamente", id);
            return updatedCampaign;
        } catch (Exception e) {
            logger.error("Error al actualizar la campaña con id {}: {}", id, e.getMessage(), e);
            throw e;
        }
    }

    @Override
    public Campaign participateInCampaign(Long id, String userEmail) {
        logger.info("Usuario {} solicita inscribirse en la campaña con id: {}", userEmail, id);
        try {
            Campaign campaign = getCampaignById(id);

            if (usuarioCampaignRepository.existsByUsuarioEmailAndCampaignId(userEmail, id)) {
                logger.error("Error al inscribir usuario {}: Ya está en la campaña {}", userEmail, id);
                throw new IllegalStateException("Ya estás inscrito en esta campaña");
            }

            if (campaign.getParticipants() >= campaign.getSpots()) {
                logger.error("Error al inscribir usuario {}: La campaña {} ya no tiene cupos disponibles", userEmail,
                        id);
                throw new IllegalStateException("La campaña ya no tiene cupos disponibles");
            }

            UsuarioCampaignEntity relacion = new UsuarioCampaignEntity(userEmail, id, LocalDateTime.now().toString());
            usuarioCampaignRepository.save(relacion);

            campaign.setParticipants(campaign.getParticipants() + 1);
            Campaign updatedCampaign = campaignRepositoryPort.save(campaign);
            logger.info("Usuario {} inscrito exitosamente en la campaña con id: {}. Participantes actuales: {}",
                    userEmail, id, updatedCampaign.getParticipants());
            return updatedCampaign;
        } catch (Exception e) {
            logger.error("Error al inscribir al usuario {} en la campaña con id {}: {}", userEmail, id, e.getMessage(),
                    e);
            throw e;
        }
    }

    @Override
    public void deleteCampaign(Long id) {
        logger.info("Solicitud para eliminar la campaña con id: {}", id);
        try {
            campaignRepositoryPort.deleteById(id);
            logger.info("Campaña con id: {} eliminada exitosamente", id);
        } catch (Exception e) {
            logger.error("Error al eliminar la campaña con id {}: {}", id, e.getMessage(), e);
            throw e;
        }
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
