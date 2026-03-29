package com.ecoland.infrastructure.repository;

import com.ecoland.infrastructure.entity.CampaignEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JpaCampaignRepository extends JpaRepository<CampaignEntity, Long> {
}
