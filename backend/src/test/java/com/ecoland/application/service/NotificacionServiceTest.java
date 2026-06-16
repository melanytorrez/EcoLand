package com.ecoland.application.service;

import com.ecoland.domain.model.Notificacion;
import com.ecoland.domain.port.out.NotificacionRepositoryPort;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class NotificacionServiceTest {

    @Mock
    private NotificacionRepositoryPort notificacionRepositoryPort;

    @InjectMocks
    private NotificacionService notificacionService;

    private Notificacion notificacionPrueba;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        notificacionPrueba = new Notificacion();
        notificacionPrueba.setId(1L);
        notificacionPrueba.setUsuarioEmail("test@ecoland.com");
        notificacionPrueba.setMensaje("Test Message");
        notificacionPrueba.setLeido(false);
    }

    @Test
    void testObtenerNotificacionesUsuario_Success() {
        // Arrange
        when(notificacionRepositoryPort.findByUsuarioEmail("test@ecoland.com"))
                .thenReturn(Arrays.asList(notificacionPrueba));

        // Act
        List<Notificacion> result = notificacionService.obtenerNotificacionesUsuario("test@ecoland.com");

        // Assert
        assertEquals(1, result.size());
        assertEquals("Test Message", result.get(0).getMensaje());
        verify(notificacionRepositoryPort, times(1)).findByUsuarioEmail("test@ecoland.com");
    }

    @Test
    void testCrearNotificacion_Success() {
        // Arrange
        when(notificacionRepositoryPort.save(any(Notificacion.class))).thenReturn(notificacionPrueba);

        // Act
        Notificacion result = notificacionService.crearNotificacion("test@ecoland.com", "Test Message");

        // Assert
        assertNotNull(result);
        verify(notificacionRepositoryPort, times(1)).save(any(Notificacion.class));
    }

    @Test
    void testMarcarComoLeida_Success() {
        // Arrange
        when(notificacionRepositoryPort.findById(1L)).thenReturn(Optional.of(notificacionPrueba));
        when(notificacionRepositoryPort.save(any(Notificacion.class))).thenReturn(notificacionPrueba);

        // Act
        notificacionService.marcarComoLeida(1L);

        // Assert
        assertTrue(notificacionPrueba.isLeido());
        verify(notificacionRepositoryPort, times(1)).findById(1L);
        verify(notificacionRepositoryPort, times(1)).save(notificacionPrueba);
    }

    @Test
    void testMarcarComoLeida_NotFound() {
        // Arrange
        when(notificacionRepositoryPort.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(NoSuchElementException.class, () -> notificacionService.marcarComoLeida(1L));
        verify(notificacionRepositoryPort, times(1)).findById(1L);
        verify(notificacionRepositoryPort, never()).save(any(Notificacion.class));
    }

    @Test
    void testEliminarNotificacion_Success() {
        // Arrange
        doNothing().when(notificacionRepositoryPort).deleteById(1L);

        // Act
        notificacionService.eliminarNotificacion(1L);

        // Assert
        verify(notificacionRepositoryPort, times(1)).deleteById(1L);
    }
}
