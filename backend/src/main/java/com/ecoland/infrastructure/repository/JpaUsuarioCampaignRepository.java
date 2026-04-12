package com.ecoland.infrastructure.repository;

import com.ecoland.infrastructure.entity.UsuarioCampaignEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaUsuarioCampaignRepository extends JpaRepository<UsuarioCampaignEntity, Long> {
    boolean existsByUsuarioEmailAndCampaignId(String email, Long campaignId);
}
