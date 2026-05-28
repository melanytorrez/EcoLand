package com.ecoland.domain.port.in;

import com.ecoland.domain.model.Campaign;
import java.util.List;

public interface CampaignUseCase {
    List<Campaign> getAllCampaigns();
    List<Campaign> getCampaignsByCategory(com.ecoland.domain.model.CampaignCategory category);
    List<Campaign> getCampaignsByCreatorId(Long creatorId);
    List<Campaign> getMyCampaigns();
    List<Campaign> getPendingCampaigns();
    Campaign getCampaignById(Long id);
    Campaign saveCampaign(Campaign campaign);
    Campaign updateCampaign(Long id, Campaign campaign);
    Campaign participateInCampaign(Long id, String userEmail);
    Campaign approveCampaign(Long id, String comment);
    Campaign rejectCampaign(Long id, String comment);
    void deleteCampaign(Long id);
}
