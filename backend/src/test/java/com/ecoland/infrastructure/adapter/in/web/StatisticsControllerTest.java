package com.ecoland.infrastructure.adapter.in.web;

import com.ecoland.application.dto.ComprehensiveStatisticsDto;
import com.ecoland.application.dto.EnvironmentalImpactDto;
import com.ecoland.application.dto.QuickStatsDto;
import com.ecoland.application.service.FeatureToggleService;
import com.ecoland.application.service.StatisticsService;
import com.ecoland.domain.port.out.UsuarioRepositoryPort;
import com.ecoland.infrastructure.security.FeatureToggleInterceptor;
import com.ecoland.infrastructure.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(StatisticsController.class)
@AutoConfigureMockMvc(addFilters = false)
class StatisticsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private StatisticsService statisticsService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private UsuarioRepositoryPort usuarioRepositoryPort;

    @MockBean
    private FeatureToggleInterceptor featureToggleInterceptor;

    @MockBean
    private FeatureToggleService featureToggleService;

    @BeforeEach
    void setUp() throws Exception {
        when(featureToggleInterceptor.preHandle(any(), any(), any())).thenReturn(true);
    }

    @Test
    void getQuickStats_ShouldReturnStats() throws Exception {
        QuickStatsDto dto = new QuickStatsDto(10L, 4L, 250L);
        when(statisticsService.getQuickStats()).thenReturn(dto);

        mockMvc.perform(get("/api/statistics/quick"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalCampaigns").value(10))
                .andExpect(jsonPath("$.activeCampaigns").value(4))
                .andExpect(jsonPath("$.totalParticipants").value(250));
    }

    @Test
    void getEnvironmentalImpact_ShouldReturnImpact() throws Exception {
        EnvironmentalImpactDto dto = new EnvironmentalImpactDto(5L, 200L, 4354.0);
        when(statisticsService.getEnvironmentalImpact()).thenReturn(dto);

        mockMvc.perform(get("/api/statistics/environmental-impact"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.completedCampaigns").value(5))
                .andExpect(jsonPath("$.plantedTrees").value(200))
                .andExpect(jsonPath("$.mitigatedCo2Kg").value(4354.0));
    }

    @Test
    void getComprehensiveStatistics_ShouldReturnFullReport() throws Exception {
        ComprehensiveStatisticsDto dto = new ComprehensiveStatisticsDto(
                10L, 4L, 250L, 5L, 200L, 4354.0,
                Collections.emptyList(), Collections.emptyList(),
                Collections.emptyList(), Collections.emptyList(),
                600000.0, 0.2
        );
        when(statisticsService.getComprehensiveStatistics()).thenReturn(dto);

        mockMvc.perform(get("/api/statistics/comprehensive"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalCampaigns").value(10))
                .andExpect(jsonPath("$.totalParticipants").value(250))
                .andExpect(jsonPath("$.waterSavedLiters").value(600000.0));
    }
}
