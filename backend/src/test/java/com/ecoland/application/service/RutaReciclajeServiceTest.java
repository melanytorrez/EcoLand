package com.ecoland.application.service;

import com.ecoland.domain.model.RutaReciclaje;
import com.ecoland.domain.port.out.RutaReciclajeRepositoryPort;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RutaReciclajeServiceTest {

    @Mock
    private RutaReciclajeRepositoryPort repositoryPort;

    @InjectMocks
    private RutaReciclajeService rutaReciclajeService;

    private RutaReciclaje ruta1;
    private RutaReciclaje ruta2;

    @BeforeEach
    void setUp() {
        ruta1 = new RutaReciclaje(1L, "Norte", "Lunes", "08:00-12:00", "Camión 01", "Ruta norte de la ciudad", List.of("-17.393,-66.157"));
        ruta2 = new RutaReciclaje(2L, "Sur", "Miércoles", "14:00-18:00", "Camión 02", "Ruta sur de la ciudad", List.of("-17.420,-66.145"));
    }

    @Test
    void getAllRutas_ShouldReturnAllRoutes() {
        when(repositoryPort.findAll()).thenReturn(Arrays.asList(ruta1, ruta2));

        List<RutaReciclaje> result = rutaReciclajeService.getAllRutas();

        assertNotNull(result);
        assertEquals(2, result.size());
        verify(repositoryPort, times(1)).findAll();
    }

    @Test
    void getAllRutas_WhenNoRoutes_ShouldReturnEmptyList() {
        when(repositoryPort.findAll()).thenReturn(Collections.emptyList());

        List<RutaReciclaje> result = rutaReciclajeService.getAllRutas();

        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(repositoryPort, times(1)).findAll();
    }

    @Test
    void getAllRutas_ShouldReturnRoutesWithCorrectFields() {
        when(repositoryPort.findAll()).thenReturn(List.of(ruta1));

        List<RutaReciclaje> result = rutaReciclajeService.getAllRutas();

        RutaReciclaje returned = result.get(0);
        assertEquals(1L, returned.getId());
        assertEquals("Norte", returned.getZona());
        assertEquals("Lunes", returned.getDiaSemana());
        assertEquals("08:00-12:00", returned.getHorario());
        assertEquals("Camión 01", returned.getVehiculoAsignado());
    }
}
