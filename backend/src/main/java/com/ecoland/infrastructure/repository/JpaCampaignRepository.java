package com.ecoland.infrastructure.repository;

import com.ecoland.infrastructure.entity.CampaignEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaCampaignRepository extends JpaRepository<CampaignEntity, Long> {
}
