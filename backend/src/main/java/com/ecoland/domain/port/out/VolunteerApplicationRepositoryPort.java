package com.ecoland.domain.port.out;

import com.ecoland.domain.model.VolunteerApplication;
import com.ecoland.domain.model.VolunteerStatus;
import java.util.List;
import java.util.Optional;

/**
 * Puerto de salida para la persistencia de postulaciones de voluntariado.
 */
public interface VolunteerApplicationRepositoryPort {

    VolunteerApplication save(VolunteerApplication application);

    Optional<VolunteerApplication> findById(Long id);

    List<VolunteerApplication> findByCampaignId(Long campaignId);

    Optional<VolunteerApplication> findByEmailAndCampaignId(String email, Long campaignId);

    boolean existsByEmailAndCampaignId(String email, Long campaignId);

    List<VolunteerApplication> findByStatus(VolunteerStatus status);
}
