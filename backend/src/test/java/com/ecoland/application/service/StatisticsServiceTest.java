package com.ecoland.application.service;

import com.ecoland.application.dto.*;
import com.ecoland.domain.model.CampaignCategory;
import com.ecoland.infrastructure.entity.CampaignEntity;
import com.ecoland.infrastructure.repository.JpaCampaignRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StatisticsServiceTest {

    @Mock
    private JpaCampaignRepository campaignRepository;

    @InjectMocks
    private StatisticsService statisticsService;

    private CampaignEntity completedReforestation;
    private CampaignEntity completedRecycling;
    private CampaignEntity activeCampaign;

    @BeforeEach
    void setUp() {
        completedReforestation = new CampaignEntity();
        completedReforestation.setId(1L);
        completedReforestation.setStatus("finalizada");
        completedReforestation.setCategory(CampaignCategory.REFORESTATION);
        completedReforestation.setParticipants(50);
        completedReforestation.setDate("2026-05-10");
        completedReforestation.setLocation("Norte");

        completedRecycling = new CampaignEntity();
        completedRecycling.setId(2L);
        completedRecycling.setStatus("completado");
        completedRecycling.setCategory(CampaignCategory.RECYCLING);
        completedRecycling.setParticipants(100);
        completedRecycling.setDate("2026-06-15");
        completedRecycling.setLocation("Sur");

        activeCampaign = new CampaignEntity();
        activeCampaign.setId(3L);
        activeCampaign.setStatus("Activa");
        activeCampaign.setCategory(CampaignCategory.REFORESTATION);
        activeCampaign.setParticipants(20);
        activeCampaign.setDate("2026-07-20");
        activeCampaign.setLocation("Norte");
    }

    @Test
    void getQuickStats_ShouldReturnCorrectData() {
        when(campaignRepository.count()).thenReturn(3L);
        when(campaignRepository.countByStatus("Activa")).thenReturn(1L);
        when(campaignRepository.sumAllParticipants()).thenReturn(170L);

        QuickStatsDto result = statisticsService.getQuickStats();

        assertEquals(3L, result.getTotalCampaigns());
        assertEquals(1L, result.getActiveCampaigns());
        assertEquals(170L, result.getTotalParticipants());
    }

    @Test
    void getEnvironmentalImpact_ShouldReturnCorrectData() {
        when(campaignRepository.countByStatusInIgnoreCase(anyList())).thenReturn(2L);
        when(campaignRepository.sumParticipantsByStatusesIgnoreCase(anyList())).thenReturn(150L);

        EnvironmentalImpactDto result = statisticsService.getEnvironmentalImpact();

        assertEquals(2L, result.getCompletedCampaigns());
        assertEquals(150L, result.getPlantedTrees());
        assertEquals(150L * 21.77, result.getMitigatedCo2Kg());
    }

    @Test
    void getComprehensiveStatistics_ShouldReturnCorrectAggregatedData() {
        when(campaignRepository.count()).thenReturn(3L);
        when(campaignRepository.countByStatus("Activa")).thenReturn(1L);
        when(campaignRepository.sumAllParticipants()).thenReturn(170L);
        when(campaignRepository.countByStatusInIgnoreCase(anyList())).thenReturn(2L);
        when(campaignRepository.sumParticipantsByStatusesIgnoreCase(anyList())).thenReturn(150L);

        List<CampaignEntity> allCampaigns = Arrays.asList(completedReforestation, completedRecycling, activeCampaign);
        when(campaignRepository.findAll()).thenReturn(allCampaigns);
        
        List<CampaignEntity> completedCamps = Arrays.asList(completedReforestation, completedRecycling);
        when(campaignRepository.findByStatusInIgnoreCase(anyList())).thenReturn(completedCamps);

        ComprehensiveStatisticsDto result = statisticsService.getComprehensiveStatistics();

        assertNotNull(result);
        assertEquals(3L, result.getTotalCampaigns());
        assertEquals(1L, result.getActiveCampaigns());
        assertEquals(170L, result.getTotalParticipants());
        
        // 1. Monthly Planted Trees (Reforestation, completed) -> Should be 50 from May
        assertEquals(1, result.getMonthlyPlantedTrees().size());
        assertEquals("May", result.getMonthlyPlantedTrees().get(0).getMonth());
        assertEquals(50L, result.getMonthlyPlantedTrees().get(0).getValue());

        // 2. Residue distribution -> Based on 100 recycling participants
        assertEquals(5, result.getResidueDistribution().size());
        // Plástico: 100 * 5.0 = 500
        assertEquals(500.0, result.getResidueDistribution().get(0).getAmount());

        // 3. Zone activity -> "Norte" (2), "Sur" (1)
        assertEquals(2, result.getZoneActivity().size());
        assertEquals("Norte", result.getZoneActivity().get(0).getZone());
        assertEquals(2L, result.getZoneActivity().get(0).getActivities());

        // 4. Volunteer growth -> May (50), Jun (100), Jul (20)
        assertEquals(3, result.getVolunteerGrowth().size());
        assertEquals(50L, result.getVolunteerGrowth().get(0).getTotalVolunteers()); // May
    }
}
