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

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(RutaReciclajeController.class)
@AutoConfigureMockMvc(addFilters = false)
class RutaReciclajeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private RutaReciclajeUseCase useCase;

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
    void getAllRutas_ShouldReturnAllRoutes() throws Exception {
        RutaReciclaje r1 = new RutaReciclaje(1L, "Norte", "Lunes", "08:00-12:00", "Camión 01", "Ruta norte", List.of("-17.39,-66.15"));
        RutaReciclaje r2 = new RutaReciclaje(2L, "Sur", "Miércoles", "14:00-18:00", "Camión 02", "Ruta sur", List.of("-17.42,-66.14"));

        when(useCase.getAllRutas()).thenReturn(Arrays.asList(r1, r2));

        mockMvc.perform(get("/api/v1/rutas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].zona").value("Norte"))
                .andExpect(jsonPath("$[1].zona").value("Sur"));
    }

    @Test
    void getAllRutas_WhenEmpty_ShouldReturnEmptyList() throws Exception {
        when(useCase.getAllRutas()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/v1/rutas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isEmpty());
    }

    @Test
    void getAllRutas_ShouldReturnCorrectRouteFields() throws Exception {
        RutaReciclaje ruta = new RutaReciclaje(1L, "Centro", "Viernes", "09:00-13:00", "Camión 03", "Ruta centro", List.of("-17.38,-66.16"));

        when(useCase.getAllRutas()).thenReturn(List.of(ruta));

        mockMvc.perform(get("/api/v1/rutas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].zona").value("Centro"))
                .andExpect(jsonPath("$[0].diaSemana").value("Viernes"))
                .andExpect(jsonPath("$[0].horario").value("09:00-13:00"))
                .andExpect(jsonPath("$[0].vehiculoAsignado").value("Camión 03"));
    }
}
