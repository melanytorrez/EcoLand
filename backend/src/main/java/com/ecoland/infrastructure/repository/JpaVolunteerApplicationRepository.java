package com.ecoland.infrastructure.repository;

import com.ecoland.infrastructure.entity.VolunteerApplicationEntity;
import com.ecoland.domain.model.VolunteerStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JpaVolunteerApplicationRepository extends JpaRepository<VolunteerApplicationEntity, Long> {

    List<VolunteerApplicationEntity> findByCampaignId(Long campaignId);

    Optional<VolunteerApplicationEntity> findByUsuarioEmailAndCampaignId(String email, Long campaignId);

    boolean existsByUsuarioEmailAndCampaignId(String email, Long campaignId);

    List<VolunteerApplicationEntity> findByStatus(VolunteerStatus status);
}
