package com.ecoland.infrastructure.adapter.in.web;

import com.ecoland.domain.model.PuntoVerde;
import com.ecoland.domain.port.in.PuntoVerdeUseCase;
import com.ecoland.infrastructure.security.JwtService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PuntoVerdeController.class)
@AutoConfigureMockMvc(addFilters = false)
class PuntoVerdeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PuntoVerdeUseCase puntoVerdeUseCase;

    @MockBean
    private JwtService jwtService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testGetAll_Success() throws Exception {
        PuntoVerde pv1 = new PuntoVerde();
        pv1.setId(1L);
        pv1.setNombre("Punto Central");
        pv1.setEstado("Abierto");

        when(puntoVerdeUseCase.getAllPuntosVerdes()).thenReturn(Arrays.asList(pv1));

        mockMvc.perform(get("/api/puntos-verdes"))
                .andExpect(status().isOk()) // Espera un 200 OK
                .andExpect(jsonPath("$[0].nombre").value("Punto Central"));
    }

    @Test
    void testGetById_Success() throws Exception {
        PuntoVerde pv = new PuntoVerde();
        pv.setId(1L);
        pv.setNombre("Punto Norte");

        when(puntoVerdeUseCase.getPuntoVerdeById(1L)).thenReturn(pv);

        mockMvc.perform(get("/api/puntos-verdes/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Punto Norte"));
    }

    @Test
    void testCreate_Success() throws Exception {
        PuntoVerde requestPv = new PuntoVerde();
        requestPv.setNombre("Nuevo Punto Verde");

        PuntoVerde responsePv = new PuntoVerde();
        responsePv.setId(1L);
        responsePv.setNombre("Nuevo Punto Verde");

        when(puntoVerdeUseCase.createPuntoVerde(any(PuntoVerde.class))).thenReturn(responsePv);

        mockMvc.perform(post("/api/puntos-verdes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestPv)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.nombre").value("Nuevo Punto Verde"));
    }

    @Test
    void testUpdate_Success() throws Exception {
        PuntoVerde pv = new PuntoVerde();
        pv.setId(1L);
        pv.setNombre("Punto Actualizado");

        when(puntoVerdeUseCase.updatePuntoVerde(eq(1L), any(PuntoVerde.class))).thenReturn(pv);

        mockMvc.perform(put("/api/puntos-verdes/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(pv)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Punto Actualizado"));
    }

    @Test
    void testDelete_Success() throws Exception {
        mockMvc.perform(delete("/api/puntos-verdes/1"))
                .andExpect(status().isNoContent());

        verify(puntoVerdeUseCase, times(1)).deletePuntoVerde(1L);
    }
}