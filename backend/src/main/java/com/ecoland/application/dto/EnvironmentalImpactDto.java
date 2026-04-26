package com.ecoland.application.dto;

public class EnvironmentalImpactDto {
    private Long completedCampaigns;
    private Long plantedTrees;
    private Double mitigatedCo2Kg;

    public EnvironmentalImpactDto(Long completedCampaigns, Long plantedTrees, Double mitigatedCo2Kg) {
        this.completedCampaigns = completedCampaigns;
        this.plantedTrees = plantedTrees;
        this.mitigatedCo2Kg = mitigatedCo2Kg;
    }

    public Long getCompletedCampaigns() {
        return completedCampaigns;
    }

    public Long getPlantedTrees() {
        return plantedTrees;
    }

    public Double getMitigatedCo2Kg() {
        return mitigatedCo2Kg;
    }
}
