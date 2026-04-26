package com.ecoland.application.dto;

import java.util.List;

public class ComprehensiveStatisticsDto {
    private Long totalCampaigns;
    private Long activeCampaigns;
    private Long totalParticipants;
    private Long completedCampaigns;
    private Long plantedTrees;
    private Double mitigatedCo2Kg;
    private List<MonthlyDataDto> monthlyPlantedTrees;
    private List<ResidueDataDto> residueDistribution;
    private List<ZoneActivityDto> zoneActivity;
    private List<MonthlyVolunteerDto> volunteerGrowth;
    private Double waterSavedLiters;
    private Double forestAreaHectares;

    public ComprehensiveStatisticsDto(Long totalCampaigns, Long activeCampaigns, Long totalParticipants,
                                      Long completedCampaigns, Long plantedTrees, Double mitigatedCo2Kg,
                                      List<MonthlyDataDto> monthlyPlantedTrees, List<ResidueDataDto> residueDistribution,
                                      List<ZoneActivityDto> zoneActivity, List<MonthlyVolunteerDto> volunteerGrowth,
                                      Double waterSavedLiters, Double forestAreaHectares) {
        this.totalCampaigns = totalCampaigns;
        this.activeCampaigns = activeCampaigns;
        this.totalParticipants = totalParticipants;
        this.completedCampaigns = completedCampaigns;
        this.plantedTrees = plantedTrees;
        this.mitigatedCo2Kg = mitigatedCo2Kg;
        this.monthlyPlantedTrees = monthlyPlantedTrees;
        this.residueDistribution = residueDistribution;
        this.zoneActivity = zoneActivity;
        this.volunteerGrowth = volunteerGrowth;
        this.waterSavedLiters = waterSavedLiters;
        this.forestAreaHectares = forestAreaHectares;
    }

    public Long getTotalCampaigns() { return totalCampaigns; }
    public Long getActiveCampaigns() { return activeCampaigns; }
    public Long getTotalParticipants() { return totalParticipants; }
    public Long getCompletedCampaigns() { return completedCampaigns; }
    public Long getPlantedTrees() { return plantedTrees; }
    public Double getMitigatedCo2Kg() { return mitigatedCo2Kg; }
    public List<MonthlyDataDto> getMonthlyPlantedTrees() { return monthlyPlantedTrees; }
    public List<ResidueDataDto> getResidueDistribution() { return residueDistribution; }
    public List<ZoneActivityDto> getZoneActivity() { return zoneActivity; }
    public List<MonthlyVolunteerDto> getVolunteerGrowth() { return volunteerGrowth; }
    public Double getWaterSavedLiters() { return waterSavedLiters; }
    public Double getForestAreaHectares() { return forestAreaHectares; }
}
