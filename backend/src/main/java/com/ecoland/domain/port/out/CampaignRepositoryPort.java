package com.ecoland.domain.port.out;

import com.ecoland.domain.model.Campaign;
import java.util.List;
import java.util.Optional;
import com.ecoland.domain.model.CampaignCategory;

public interface CampaignRepositoryPort {
    List<Campaign> findAll();
    List<Campaign> findByCategory(CampaignCategory category);
    Optional<Campaign> findById(Long id);
    Campaign save(Campaign campaign);
    void deleteById(Long id);
}
