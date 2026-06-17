package com.ecoland.infrastructure.adapter.in.web;

import com.ecoland.application.service.FeatureToggleService;
import com.ecoland.domain.model.RutaReciclaje;
import com.ecoland.domain.port.in.RutaReciclajeUseCase;
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
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(RutaReciclajeController.class)
@AutoConfigureMockMvc(addFilters = false)
class RutaReciclajeControllerTest {

    @Autowired private MockMvc mockMvc;

    @MockBean private RutaReciclajeUseCase rutaReciclajeUseCase;
    @MockBean private JwtService jwtService;
    @MockBean private UsuarioRepositoryPort usuarioRepositoryPort;
    @MockBean private FeatureToggleInterceptor featureToggleInterceptor;
    @MockBean private FeatureToggleService featureToggleService;

    @BeforeEach
    void setUp() throws Exception {
        when(featureToggleInterceptor.preHandle(any(), any(), any())).thenReturn(true);
    }

    @Test
    void getAllRutas_Returns200_WithList() throws Exception {
        RutaReciclaje ruta = new RutaReciclaje();
        ruta.setId(1L);
        ruta.setZona("Zona Norte");
        ruta.setDiaSemana("Lunes");

        when(rutaReciclajeUseCase.getAllRutas()).thenReturn(List.of(ruta));

        mockMvc.perform(get("/api/v1/rutas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].zona").value("Zona Norte"))
                .andExpect(jsonPath("$[0].diaSemana").value("Lunes"));
    }

    @Test
    void getAllRutas_Returns200_WhenEmpty() throws Exception {
        when(rutaReciclajeUseCase.getAllRutas()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/v1/rutas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$").isEmpty());
    }
}
