package com.ecoland.application.service;

import com.ecoland.application.dto.*;
import com.ecoland.infrastructure.entity.CampaignEntity;
import com.ecoland.domain.model.CampaignCategory;
import com.ecoland.infrastructure.repository.JpaCampaignRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Comparator;
import java.util.stream.Collectors;

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

        List<CampaignEntity> allCampaigns = campaignRepository.findAll();

        // 1. Monthly planted trees (Reforestation, completed statuses)
        List<CampaignEntity> completedCamps = campaignRepository.findByStatusInIgnoreCase(COMPLETED_STATUSES);
        Map<String, Long> treesByMonth = completedCamps.stream()
                .filter(c -> c.getCategory() == CampaignCategory.REFORESTATION)
                .collect(Collectors.groupingBy(
                        c -> extractMonthFromDate(c.getDate()),
                        Collectors.summingLong(CampaignEntity::getParticipants)
                ));
        List<MonthlyDataDto> monthlyPlantedTrees = treesByMonth.entrySet().stream()
                .map(e -> new MonthlyDataDto(e.getKey(), e.getValue()))
                .sorted(Comparator.comparing(e -> monthNameToNumber(e.getMonth())))
                .collect(Collectors.toList());

        // 2. Residue distribution (Estimated based on total participants in RECYCLING campaigns)
        long recyclingParticipants = allCampaigns.stream()
                .filter(c -> c.getCategory() == CampaignCategory.RECYCLING)
                .mapToLong(CampaignEntity::getParticipants)
                .sum();
        
        List<ResidueDataDto> residueDistribution = List.of(
                new ResidueDataDto("Plástico", recyclingParticipants * 5.0),
                new ResidueDataDto("Papel", recyclingParticipants * 3.0),
                new ResidueDataDto("Vidrio", recyclingParticipants * 2.0),
                new ResidueDataDto("Metal", recyclingParticipants * 1.5),
                new ResidueDataDto("Orgánico", recyclingParticipants * 0.5)
        );

        // 3. Zone activity distribution (grouped by location field)
        Map<String, Long> activityByLocation = allCampaigns.stream()
                .filter(c -> c.getLocation() != null && !c.getLocation().trim().isEmpty())
                .collect(Collectors.groupingBy(
                        CampaignEntity::getLocation,
                        Collectors.counting()
                ));
        List<ZoneActivityDto> zoneActivity = activityByLocation.entrySet().stream()
                .map(e -> new ZoneActivityDto(e.getKey(), e.getValue()))
                .sorted((a, b) -> Long.compare(b.getActivities(), a.getActivities()))
                .limit(5)
                .collect(Collectors.toList());

        // 4. Monthly volunteer growth
        Map<String, Long> volunteersByMonth = allCampaigns.stream()
                .collect(Collectors.groupingBy(
                        c -> extractMonthFromDate(c.getDate()),
                        Collectors.summingLong(CampaignEntity::getParticipants)
                ));
        List<MonthlyVolunteerDto> volunteerGrowth = volunteersByMonth.entrySet().stream()
                .map(e -> new MonthlyVolunteerDto(e.getKey(), e.getValue()))
                .sorted(Comparator.comparing(e -> monthNameToNumber(e.getMonth())))
                .collect(Collectors.toList());

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

    private String extractMonthFromDate(String dateStr) {
        if (dateStr == null || dateStr.length() < 7) return "Desconocido";
        // Assuming format like YYYY-MM-DD
        String monthPart = dateStr.substring(5, 7);
        switch (monthPart) {
            case "01": return "Ene";
            case "02": return "Feb";
            case "03": return "Mar";
            case "04": return "Abr";
            case "05": return "May";
            case "06": return "Jun";
            case "07": return "Jul";
            case "08": return "Ago";
            case "09": return "Sep";
            case "10": return "Oct";
            case "11": return "Nov";
            case "12": return "Dic";
            default: return "Otro";
        }
    }

    private int monthNameToNumber(String monthName) {
        switch (monthName) {
            case "Ene": return 1;
            case "Feb": return 2;
            case "Mar": return 3;
            case "Abr": return 4;
            case "May": return 5;
            case "Jun": return 6;
            case "Jul": return 7;
            case "Ago": return 8;
            case "Sep": return 9;
            case "Oct": return 10;
            case "Nov": return 11;
            case "Dic": return 12;
            default: return 99;
        }
    }
}
