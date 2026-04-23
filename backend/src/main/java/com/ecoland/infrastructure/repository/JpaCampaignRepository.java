package com.ecoland.infrastructure.repository;

import com.ecoland.infrastructure.entity.CampaignEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JpaCampaignRepository extends JpaRepository<CampaignEntity, Long> {
    Long countByStatus(String status);

    @Query("SELECT COALESCE(SUM(c.participants), 0) FROM CampaignEntity c")
    Long sumAllParticipants();

    @Query("SELECT COUNT(c) FROM CampaignEntity c WHERE LOWER(c.status) IN :statuses")
    Long countByStatusInIgnoreCase(@Param("statuses") List<String> statuses);

    @Query("SELECT COALESCE(SUM(c.participants), 0) FROM CampaignEntity c WHERE LOWER(c.status) IN :statuses")
    Long sumParticipantsByStatusesIgnoreCase(@Param("statuses") List<String> statuses);
}
