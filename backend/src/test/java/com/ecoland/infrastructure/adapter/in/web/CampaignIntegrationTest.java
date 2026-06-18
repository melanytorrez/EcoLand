package com.ecoland.infrastructure.adapter.in.web;

import com.ecoland.application.dto.LoginRequest;
import com.ecoland.domain.model.Campaign;
import com.ecoland.domain.model.CampaignCategory;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.fasterxml.jackson.databind.JsonNode;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("test")
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
class CampaignIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    private String adminToken;

    @BeforeEach
    void setUp() throws Exception {
        LoginRequest login = new LoginRequest();
        login.setEmail("admin@ecoland.com");
        login.setPassword("admin1234");

        MvcResult result = mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode json = objectMapper.readTree(result.getResponse().getContentAsString());
        adminToken = json.get("token").asText();
    }

    @Test
    void getCampaigns_Returns200_WithoutAuth() throws Exception {
        mockMvc.perform(get("/api/campaigns"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    void getCampaignById_Returns200_ForExistingCampaign() throws Exception {
        // El CampaignDataInitializer siembra campañas al arrancar; obtenemos la primera
        MvcResult listResult = mockMvc.perform(get("/api/campaigns"))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode campaigns = objectMapper.readTree(listResult.getResponse().getContentAsString());
        if (campaigns.size() > 0) {
            long id = campaigns.get(0).get("id").asLong();
            mockMvc.perform(get("/api/campaigns/" + id))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(id));
        }
    }

    @Test
    void createCampaign_Returns200_WhenAuthenticatedAsAdmin() throws Exception {
        Campaign campaign = new Campaign();
        campaign.setTitle("Campaña Integración Test");
        campaign.setDate("2026-08-01");
        campaign.setTime("09:00");
        campaign.setLocation("Parque Sur");
        campaign.setAddress("Av. Sur 123");
        campaign.setSpots(30);
        campaign.setParticipants(0);
        campaign.setOrganizer("Test Organizer");
        campaign.setDescription("Descripción de prueba de integración");
        campaign.setCategory(CampaignCategory.REFORESTATION);

        mockMvc.perform(post("/api/campaigns")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(campaign)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Campaña Integración Test"));
    }

    @Test
    void createCampaign_Returns4xx_WhenNotAuthenticated() throws Exception {
        Campaign campaign = new Campaign();
        campaign.setTitle("Sin Auth");
        campaign.setCategory(CampaignCategory.REFORESTATION);

        mockMvc.perform(post("/api/campaigns")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(campaign)))
                .andExpect(status().is4xxClientError());
    }
}
