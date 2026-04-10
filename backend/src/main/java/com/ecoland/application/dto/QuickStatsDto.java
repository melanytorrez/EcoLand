package com.ecoland.application.dto;

public class QuickStatsDto {
    private Long totalCampaigns;
    private Long activeCampaigns;
    private Long totalParticipants;

    public QuickStatsDto(Long totalCampaigns, Long activeCampaigns, Long totalParticipants) {
        this.totalCampaigns = totalCampaigns;
        this.activeCampaigns = activeCampaigns;
        this.totalParticipants = totalParticipants;
    }

    public Long getTotalCampaigns() {
        return totalCampaigns;
    }

    public Long getActiveCampaigns() {
        return activeCampaigns;
    }

    public Long getTotalParticipants() {
        return totalParticipants;
    }
}
