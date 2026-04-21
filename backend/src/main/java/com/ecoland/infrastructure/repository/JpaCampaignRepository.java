package com.ecoland.infrastructure.repository;

import com.ecoland.infrastructure.entity.CampaignEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import com.ecoland.domain.model.CampaignCategory;

@Repository
public interface JpaCampaignRepository extends JpaRepository<CampaignEntity, Long> {
    List<CampaignEntity> findByCategory(CampaignCategory category);
    Long countByStatus(String status);
    
    @Query("SELECT COALESCE(SUM(c.participants), 0) FROM CampaignEntity c")
    Long sumAllParticipants();
}
