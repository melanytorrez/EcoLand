package com.ecoland.infrastructure.adapter.in.web;

import com.ecoland.application.dto.VolunteerApplicationRequest;
import com.ecoland.application.service.FeatureToggleService;
import com.ecoland.domain.model.VolunteerApplication;
import com.ecoland.domain.model.VolunteerStatus;
import com.ecoland.domain.port.in.VolunteerApplicationUseCase;
import com.ecoland.domain.port.out.UsuarioRepositoryPort;
import com.ecoland.infrastructure.security.FeatureToggleInterceptor;
import com.ecoland.infrastructure.security.JwtService;
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

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(VolunteerApplicationController.class)
@AutoConfigureMockMvc(addFilters = false)
class VolunteerApplicationControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @MockBean private VolunteerApplicationUseCase volunteerApplicationUseCase;
    @MockBean private JwtService jwtService;
    @MockBean private UsuarioRepositoryPort usuarioRepositoryPort;
    @MockBean private FeatureToggleInterceptor featureToggleInterceptor;
    @MockBean private FeatureToggleService featureToggleService;

    @BeforeEach
    void setUp() throws Exception {
        when(featureToggleInterceptor.preHandle(any(), any(), any())).thenReturn(true);
    }

    private VolunteerApplication buildApplication() {
        VolunteerApplication app = new VolunteerApplication();
        app.setId(1L);
        app.setCampaignId(1L);
        app.setUsuarioEmail("voluntario@ecoland.com");
        app.setFullName("Juan Voluntario");
        app.setAge(25);
        app.setPhone("71234567");
        app.setAvailableWeekends(true);
        app.setHasEnvironmentalExperience(false);
        app.setMotivation("Ayudar al medio ambiente");
        app.setAvailabilityHours("Mañanas");
        app.setStatus(VolunteerStatus.PENDING);
        app.setFechaPostulacion(LocalDateTime.now());
        return app;
    }

    private VolunteerApplicationRequest buildRequest() {
        VolunteerApplicationRequest req = new VolunteerApplicationRequest();
        req.setCampaignId(1L);
        req.setFullName("Juan Voluntario");
        req.setAge(25);
        req.setPhone("71234567");
        req.setAvailableWeekends(true);
        req.setHasEnvironmentalExperience(false);
        req.setMotivation("Ayudar al medio ambiente");
        req.setAvailabilityHours("Mañanas");
        return req;
    }

    @Test
    void apply_Returns201_WhenAuthenticated() throws Exception {
        when(volunteerApplicationUseCase.apply(any(VolunteerApplication.class)))
                .thenReturn(buildApplication());

        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                "voluntario@ecoland.com", null, Collections.emptyList());

        mockMvc.perform(post("/api/v1/volunteer-applications")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(buildRequest()))
                        .principal(auth))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.fullName").value("Juan Voluntario"))
                .andExpect(jsonPath("$.status").value("PENDING"));
    }

    @Test
    void getByCampaign_Returns200_WithList() throws Exception {
        when(volunteerApplicationUseCase.getApplicationsByCampaign(1L))
                .thenReturn(List.of(buildApplication()));

        mockMvc.perform(get("/api/v1/volunteer-applications/campaign/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].campaignId").value(1));
    }

    @Test
    void getByCampaign_Returns200_WhenEmpty() throws Exception {
        when(volunteerApplicationUseCase.getApplicationsByCampaign(1L))
                .thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/v1/volunteer-applications/campaign/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isEmpty());
    }

    @Test
    void getMyApplication_Returns200_WhenFound() throws Exception {
        when(volunteerApplicationUseCase.getMyApplication(1L, "voluntario@ecoland.com"))
                .thenReturn(Optional.of(buildApplication()));

        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                "voluntario@ecoland.com", null, Collections.emptyList());

        mockMvc.perform(get("/api/v1/volunteer-applications/campaign/1/me").principal(auth))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fullName").value("Juan Voluntario"));
    }

    @Test
    void getMyApplication_Returns404_WhenNotFound() throws Exception {
        when(volunteerApplicationUseCase.getMyApplication(1L, "voluntario@ecoland.com"))
                .thenReturn(Optional.empty());

        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                "voluntario@ecoland.com", null, Collections.emptyList());

        mockMvc.perform(get("/api/v1/volunteer-applications/campaign/1/me").principal(auth))
                .andExpect(status().isNotFound());
    }
}
