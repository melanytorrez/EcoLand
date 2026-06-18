package com.ecoland.infrastructure.adapter.in.web;

import com.ecoland.application.dto.RecyclingActivityRequest;
import com.ecoland.application.service.FeatureToggleService;
import com.ecoland.application.service.RecyclingActivityService;
import com.ecoland.domain.model.RecyclingActivityStatus;
import com.ecoland.domain.port.out.UsuarioRepositoryPort;
import com.ecoland.infrastructure.entity.RecyclingActivityEntity;
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

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(RecyclingActivityController.class)
@AutoConfigureMockMvc(addFilters = false)
class RecyclingActivityControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @MockBean private RecyclingActivityService recyclingActivityService;
    @MockBean private JwtService jwtService;
    @MockBean private UsuarioRepositoryPort usuarioRepositoryPort;
    @MockBean private FeatureToggleInterceptor featureToggleInterceptor;
    @MockBean private FeatureToggleService featureToggleService;

    @BeforeEach
    void setUp() throws Exception {
        when(featureToggleInterceptor.preHandle(any(), any(), any())).thenReturn(true);
    }

    private RecyclingActivityEntity buildEntity() {
        RecyclingActivityEntity e = new RecyclingActivityEntity();
        e.setId(1L);
        e.setUsuarioEmail("user@ecoland.com");
        e.setPuntoVerdeId(1L);
        e.setPuntoVerdeNombre("Punto Verde Centro");
        e.setMaterial("plástico");
        e.setStatus(RecyclingActivityStatus.PENDING);
        e.setRegisteredAt(LocalDateTime.now());
        return e;
    }

    @Test
    void registerActivity_Returns201_WhenAuthenticated() throws Exception {
        RecyclingActivityRequest request = new RecyclingActivityRequest();
        request.setPuntoVerdeId(1L);
        request.setMaterial("plástico");

        when(recyclingActivityService.registerActivity(anyString(), anyLong(), anyString(), any(), any(), any()))
                .thenReturn(buildEntity());

        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                "user@ecoland.com", null, Collections.emptyList());

        mockMvc.perform(post("/api/v1/recycling-activities")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request))
                        .principal(auth))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.material").value("plástico"));
    }

    @Test
    void registerActivity_Returns401_WhenNotAuthenticated() throws Exception {
        RecyclingActivityRequest request = new RecyclingActivityRequest();
        request.setPuntoVerdeId(1L);
        request.setMaterial("plástico");

        mockMvc.perform(post("/api/v1/recycling-activities")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void getMyActivities_Returns200_WhenAuthenticated() throws Exception {
        when(recyclingActivityService.getMyActivities("user@ecoland.com"))
                .thenReturn(List.of(buildEntity()));

        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                "user@ecoland.com", null, Collections.emptyList());

        mockMvc.perform(get("/api/v1/recycling-activities/me").principal(auth))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].material").value("plástico"));
    }

    @Test
    void getMyActivities_Returns401_WhenNotAuthenticated() throws Exception {
        mockMvc.perform(get("/api/v1/recycling-activities/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void getMyActivities_Returns200_WithEmptyList() throws Exception {
        when(recyclingActivityService.getMyActivities("user@ecoland.com"))
                .thenReturn(Collections.emptyList());

        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                "user@ecoland.com", null, Collections.emptyList());

        mockMvc.perform(get("/api/v1/recycling-activities/me").principal(auth))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$").isEmpty());
    }
}
