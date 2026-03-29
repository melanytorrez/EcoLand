package com.ecoland.domain.port.out;

import com.ecoland.domain.model.Campaign;
import java.util.List;
import java.util.Optional;

public interface CampaignRepositoryPort {
    List<Campaign> findAll();
    Optional<Campaign> findById(Long id);
    Campaign save(Campaign campaign);
    void deleteById(Long id);
}
