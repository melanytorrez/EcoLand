package com.ecoland.infrastructure.adapter.in.web;

import com.ecoland.domain.model.Campaign;
import com.ecoland.domain.port.in.CampaignUseCase;
import com.ecoland.domain.port.out.UsuarioRepositoryPort;
import com.ecoland.infrastructure.security.JwtService;
import com.ecoland.infrastructure.security.FeatureToggleInterceptor;
import com.ecoland.application.service.FeatureToggleService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CampaignController.class)
@AutoConfigureMockMvc(addFilters = false)
class CampaignControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CampaignUseCase campaignUseCase;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private UsuarioRepositoryPort usuarioRepositoryPort;

    @MockBean
    private FeatureToggleInterceptor featureToggleInterceptor;

    @MockBean
    private FeatureToggleService featureToggleService;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() throws Exception {
        when(featureToggleInterceptor.preHandle(any(), any(), any())).thenReturn(true);
    }

    @Test
    void testGetAll_Success() throws Exception {
        Campaign c1 = new Campaign();
        c1.setId(1L);
        c1.setTitle("Reforestacion Tunari");

        when(campaignUseCase.getAllCampaigns()).thenReturn(Arrays.asList(c1));

        mockMvc.perform(get("/api/campaigns"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Reforestacion Tunari"));
    }

    @Test
    void testGetById_Success() throws Exception {
        Campaign campaign = new Campaign();
        campaign.setId(1L);
        campaign.setTitle("Limpieza Laguna");

        when(campaignUseCase.getCampaignById(1L)).thenReturn(campaign);

        mockMvc.perform(get("/api/campaigns/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Limpieza Laguna"));
    }

    @Test
    void testParticipate_Success() throws Exception {
        Campaign campaign = new Campaign();
        campaign.setId(1L);

        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                "test@ecoland.com", null, Collections.emptyList());

        when(campaignUseCase.participateInCampaign(eq(1L), eq("test@ecoland.com"))).thenReturn(campaign);

        mockMvc.perform(post("/api/campaigns/1/participate")
                        .principal(auth))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L));
    }

    @Test
    void testParticipate_Unauthorized_WhenNoUser() throws Exception {
        mockMvc.perform(post("/api/campaigns/1/participate"))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("Debes iniciar sesion para participar en una campana"));
    }

    @Test
    void testParticipate_Conflict() throws Exception {
        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                "test@ecoland.com", null, Collections.emptyList());

        when(campaignUseCase.participateInCampaign(anyLong(), anyString()))
                .thenThrow(new IllegalStateException("Ya estas participando en esta campana"));

        mockMvc.perform(post("/api/campaigns/1/participate")
                        .principal(auth))
                .andExpect(status().isConflict())
                .andExpect(content().string("Ya estas participando en esta campana"));
    }

    @Test
    void testCreate_Success() throws Exception {
        Campaign campaign = new Campaign();
        campaign.setTitle("Nueva Campaña");

        when(campaignUseCase.saveCampaign(any(Campaign.class))).thenReturn(campaign);

        mockMvc.perform(post("/api/campaigns")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(campaign)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Nueva Campaña"));
    }

    @Test
    void testUpdate_Success() throws Exception {
        Campaign campaign = new Campaign();
        campaign.setId(1L);
        campaign.setTitle("Título Actualizado");

        when(campaignUseCase.updateCampaign(eq(1L), any(Campaign.class))).thenReturn(campaign);

        mockMvc.perform(put("/api/campaigns/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(campaign)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Título Actualizado"));
    }

    @Test
    void testDelete_Success() throws Exception {
        mockMvc.perform(delete("/api/campaigns/1"))
                .andExpect(status().isOk());

        verify(campaignUseCase, times(1)).deleteCampaign(1L);
    }
}