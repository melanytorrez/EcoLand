package com.ecoland.application.service;

import com.ecoland.application.dto.*;
import com.ecoland.infrastructure.repository.JpaCampaignRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class StatisticsService {

    // Approximation: a mature tree can mitigate around 21.77 kg of CO2 per year.
    private static final double CO2_KG_PER_TREE_PER_YEAR = 21.77;

    private static final List<String> COMPLETED_STATUSES = List.of(
            "finalizada",
            "completada",
            "completado",
            "finalizado"
    );

    private final JpaCampaignRepository campaignRepository;

    public StatisticsService(JpaCampaignRepository campaignRepository) {
        this.campaignRepository = campaignRepository;
    }

    public QuickStatsDto getQuickStats() {
        Long total = campaignRepository.count();
        Long active = campaignRepository.countByStatus("Activa");
        Long participants = campaignRepository.sumAllParticipants();
        return new QuickStatsDto(total, active, participants);
    }

    public EnvironmentalImpactDto getEnvironmentalImpact() {
        Long completedCampaigns = campaignRepository.countByStatusInIgnoreCase(COMPLETED_STATUSES);
        Long plantedTrees = campaignRepository.sumParticipantsByStatusesIgnoreCase(COMPLETED_STATUSES);
        Double mitigatedCo2Kg = plantedTrees * CO2_KG_PER_TREE_PER_YEAR;

        return new EnvironmentalImpactDto(completedCampaigns, plantedTrees, mitigatedCo2Kg);
    }

    public ComprehensiveStatisticsDto getComprehensiveStatistics() {
        Long totalCampaigns = campaignRepository.count();
        Long activeCampaigns = campaignRepository.countByStatus("Activa");
        Long totalParticipants = campaignRepository.sumAllParticipants();
        Long completedCampaigns = campaignRepository.countByStatusInIgnoreCase(COMPLETED_STATUSES);
        Long plantedTrees = campaignRepository.sumParticipantsByStatusesIgnoreCase(COMPLETED_STATUSES);
        Double mitigatedCo2Kg = plantedTrees * CO2_KG_PER_TREE_PER_YEAR;

        // Monthly planted trees data (simulated with realistic pattern)
        List<MonthlyDataDto> monthlyPlantedTrees = generateMonthlyPlantedData();

        // Residue distribution (percentages by material type)
        List<ResidueDataDto> residueDistribution = List.of(
                new ResidueDataDto("Plástico", 35.0),
                new ResidueDataDto("Papel", 25.0),
                new ResidueDataDto("Vidrio", 20.0),
                new ResidueDataDto("Metal", 15.0),
                new ResidueDataDto("Orgánico", 5.0)
        );

        // Zone activity distribution
        List<ZoneActivityDto> zoneActivity = List.of(
                new ZoneActivityDto("Norte", 175L),
                new ZoneActivityDto("Sur", 145L),
                new ZoneActivityDto("Este", 95L),
                new ZoneActivityDto("Oeste", 115L),
                new ZoneActivityDto("Centro", 210L)
        );

        // Monthly volunteer growth
        List<MonthlyVolunteerDto> volunteerGrowth = generateMonthlyVolunteerData();

        // Calculate additional metrics
        Double waterSavedLiters = totalParticipants * 2400.0; // 2400 liters per volunteer
        Double forestAreaHectares = plantedTrees / 1000.0; // Approximation: ~1000 trees per hectare

        return new ComprehensiveStatisticsDto(
                totalCampaigns,
                activeCampaigns,
                totalParticipants,
                completedCampaigns,
                plantedTrees,
                mitigatedCo2Kg,
                monthlyPlantedTrees,
                residueDistribution,
                zoneActivity,
                volunteerGrowth,
                waterSavedLiters,
                forestAreaHectares
        );
    }

    private List<MonthlyDataDto> generateMonthlyPlantedData() {
        return List.of(
                new MonthlyDataDto("Ene", 890L),
                new MonthlyDataDto("Feb", 1200L),
                new MonthlyDataDto("Mar", 1050L),
                new MonthlyDataDto("Abr", 1500L),
                new MonthlyDataDto("May", 1300L),
                new MonthlyDataDto("Jun", 1650L)
        );
    }

    private List<MonthlyVolunteerDto> generateMonthlyVolunteerData() {
        return List.of(
                new MonthlyVolunteerDto("Ene", 1450L),
                new MonthlyVolunteerDto("Feb", 1620L),
                new MonthlyVolunteerDto("Mar", 1700L),
                new MonthlyVolunteerDto("Abr", 1820L),
                new MonthlyVolunteerDto("May", 1920L),
                new MonthlyVolunteerDto("Jun", 1950L)
        );
    }
}
