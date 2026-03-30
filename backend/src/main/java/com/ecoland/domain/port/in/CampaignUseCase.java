package com.ecoland.domain.port.in;

import com.ecoland.domain.model.Campaign;
import java.util.List;

public interface CampaignUseCase {
    List<Campaign> getAllCampaigns();
}
