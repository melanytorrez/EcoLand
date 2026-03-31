package com.ecoland.domain.port.in;

import com.ecoland.domain.model.Campaign;
import java.util.List;

public interface CampaignUseCase {
    List<Campaign> getAllCampaigns();
    Campaign getCampaignById(Long id);
    Campaign saveCampaign(Campaign campaign);
    Campaign updateCampaign(Long id, Campaign campaign);
    Campaign participateInCampaign(Long id, String userEmail);
    void deleteCampaign(Long id);
}
