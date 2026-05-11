package com.ecoland.application.service;

import com.ecoland.domain.model.PuntoVerde;
import com.ecoland.domain.port.out.PuntoVerdeRepositoryPort;
import com.ecoland.domain.port.out.UsuarioRepositoryPort;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

class PuntoVerdeServiceTest {

    @Mock
    private PuntoVerdeRepositoryPort puntoVerdeRepositoryPort;

    @Mock
    private UsuarioRepositoryPort usuarioRepositoryPort;

    private PuntoVerdeService puntoVerdeService;

    private PuntoVerde puntoTest;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        puntoVerdeService = new PuntoVerdeService(puntoVerdeRepositoryPort, usuarioRepositoryPort);

        // Mock Security Context for Admin
        SecurityContext securityContext = mock(SecurityContext.class);
        Authentication authentication = mock(Authentication.class);
        lenient().doReturn(Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMINISTRADOR")))
                .when(authentication).getAuthorities();
        lenient().when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        puntoTest = new PuntoVerde();
        puntoTest.setId(1L);
        puntoTest.setNombre("Punto Central");
        puntoTest.setEstado("Activo");
        puntoTest.setZona("Norte");
    }

    @Test
    void testGetAllPuntosVerdes() {
        // Arrange
        when(puntoVerdeRepositoryPort.findAll()).thenReturn(Arrays.asList(puntoTest));

        // Act
        List<PuntoVerde> result = puntoVerdeService.getAllPuntosVerdes();

        // Assert
        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
        verify(puntoVerdeRepositoryPort, times(1)).findAll();
    }

    @Test
    void testGetPuntoVerdeById_Success() {
        // Arrange
        when(puntoVerdeRepositoryPort.findById(1L)).thenReturn(Optional.of(puntoTest));

        // Act
        PuntoVerde result = puntoVerdeService.getPuntoVerdeById(1L);

        // Assert
        assertNotNull(result);
        assertEquals("Punto Central", result.getNombre());
    }

    @Test
    void testGetPuntoVerdeById_NotFound() {
        // Arrange
        when(puntoVerdeRepositoryPort.findById(anyLong())).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> puntoVerdeService.getPuntoVerdeById(99L));
        assertEquals("Punto Verde no encontrado", exception.getMessage());
    }

    @Test
    void testCreatePuntoVerde() {
        // Arrange
        when(puntoVerdeRepositoryPort.save(any(PuntoVerde.class))).thenReturn(puntoTest);

        // Act
        PuntoVerde result = puntoVerdeService.createPuntoVerde(new PuntoVerde());

        // Assert
        assertNotNull(result);
        verify(puntoVerdeRepositoryPort, times(1)).save(any(PuntoVerde.class));
    }

    @Test
    void testUpdatePuntoVerde_Success() {
        // Arrange
        PuntoVerde puntoActualizado = new PuntoVerde();
        puntoActualizado.setNombre("Nombre Editado");

        when(puntoVerdeRepositoryPort.findById(1L)).thenReturn(Optional.of(puntoTest));
        when(puntoVerdeRepositoryPort.save(any(PuntoVerde.class))).thenReturn(puntoActualizado);

        // Act
        PuntoVerde result = puntoVerdeService.updatePuntoVerde(1L, puntoActualizado);

        // Assert
        assertEquals(1L, result.getId());
        assertEquals("Nombre Editado", result.getNombre());
    }

    @Test
    void testDeletePuntoVerde_Success() {
        // Arrange
        when(puntoVerdeRepositoryPort.findById(1L)).thenReturn(Optional.of(puntoTest));
        doNothing().when(puntoVerdeRepositoryPort).deleteById(1L);

        // Act
        puntoVerdeService.deletePuntoVerde(1L);

        // Assert
        verify(puntoVerdeRepositoryPort, times(1)).deleteById(1L);
    }

    @Test
    void testUpdatePuntoVerde_NotFound() {
        // Arrange
        when(puntoVerdeRepositoryPort.findById(anyLong())).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> puntoVerdeService.updatePuntoVerde(99L, new PuntoVerde()));
        assertEquals("Punto Verde no encontrado", ex.getMessage());
    }

    @Test
    void testDeletePuntoVerde_NotFound() {
        // Arrange
        when(puntoVerdeRepositoryPort.findById(anyLong())).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException ex = assertThrows(RuntimeException.class, () -> puntoVerdeService.deletePuntoVerde(99L));
        assertEquals("Punto Verde no encontrado", ex.getMessage());
    }

    @Test
    void testIsActivo_VariousStates() {
        PuntoVerde p = new PuntoVerde();

        p.setEstado("abierto");
        assertTrue(p.isActivo());

        p.setEstado("ACTIVO");
        assertTrue(p.isActivo());

        p.setEstado("cerrado");
        assertFalse(p.isActivo());

        p.setEstado(null);
        assertFalse(p.isActivo());
    }

    @Test
    void testGetAllPuntosVerdes_Empty() {
        // Arrange
        when(puntoVerdeRepositoryPort.findAll()).thenReturn(List.of());

        // Act
        List<PuntoVerde> result = puntoVerdeService.getAllPuntosVerdes();

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());
    }
}