package com.ecoland.domain.port.in;

import com.ecoland.domain.model.Campaign;

import java.util.List;
import java.util.Optional;

public interface CampaignUseCase {
	List<Campaign> getAllCampaigns();
	Optional<Campaign> getCampaignById(Long id);
	Campaign participateInCampaign(Long campaignId, String userEmail);
}
