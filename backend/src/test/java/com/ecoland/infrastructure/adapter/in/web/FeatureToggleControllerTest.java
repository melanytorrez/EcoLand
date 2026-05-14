package com.ecoland.infrastructure.adapter.in.web;

import com.ecoland.application.service.FeatureToggleService;
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

import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(FeatureToggleController.class)
@AutoConfigureMockMvc(addFilters = false)
class FeatureToggleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private FeatureToggleService featureToggleService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private UsuarioRepositoryPort usuarioRepositoryPort;

    @MockBean
    private FeatureToggleInterceptor featureToggleInterceptor;

    @BeforeEach
    void setUp() throws Exception {
        when(featureToggleInterceptor.preHandle(any(), any(), any())).thenReturn(true);
    }

    @Test
    void getAllFeatures_ShouldReturnMapOfToggles() throws Exception {
        when(featureToggleService.getAllToggles()).thenReturn(Map.of(
                "reforestacion", true,
                "reciclaje", false,
                "estadisticas", true
        ));

        mockMvc.perform(get("/api/features"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.reforestacion").value(true))
                .andExpect(jsonPath("$.reciclaje").value(false))
                .andExpect(jsonPath("$.estadisticas").value(true));
    }

    @Test
    void getAllFeatures_WhenEmpty_ShouldReturnEmptyObject() throws Exception {
        when(featureToggleService.getAllToggles()).thenReturn(Map.of());

        mockMvc.perform(get("/api/features"))
                .andExpect(status().isOk())
                .andExpect(content().string("{}"));
    }

    @Test
    void updateFeature_ShouldCallServiceAndReturn200() throws Exception {
        doNothing().when(featureToggleService).updateToggle("reforestacion", true);

        mockMvc.perform(put("/api/features/reforestacion")
                        .param("enabled", "true"))
                .andExpect(status().isOk());

        verify(featureToggleService, times(1)).updateToggle("reforestacion", true);
    }

    @Test
    void updateFeature_Disable_ShouldCallServiceWithFalse() throws Exception {
        doNothing().when(featureToggleService).updateToggle("reciclaje", false);

        mockMvc.perform(put("/api/features/reciclaje")
                        .param("enabled", "false"))
                .andExpect(status().isOk());

        verify(featureToggleService, times(1)).updateToggle("reciclaje", false);
    }
}
