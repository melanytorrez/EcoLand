package com.ecoland.application.service;

import com.ecoland.domain.model.Usuario;
import com.ecoland.domain.model.EstadoSolicitud;
import com.ecoland.domain.model.Rol;
import com.ecoland.domain.model.Notificacion;
import com.ecoland.domain.port.out.UsuarioRepositoryPort;
import com.ecoland.domain.port.out.CampaignRepositoryPort;
import com.ecoland.infrastructure.repository.JpaUsuarioCampaignRepository;
import com.ecoland.domain.port.out.RolRepositoryPort;
import com.ecoland.domain.port.out.NotificacionRepositoryPort;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.HashSet;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UsuarioServiceTest {

    @Mock
    private UsuarioRepositoryPort usuarioRepositoryPort;

    @Mock
    private CampaignRepositoryPort campaignRepositoryPort;

    @Mock
    private JpaUsuarioCampaignRepository usuarioCampaignRepository;

    @Mock
    private RolRepositoryPort rolRepositoryPort;

    @Mock
    private NotificacionRepositoryPort notificacionRepositoryPort;

    @InjectMocks
    private UsuarioService usuarioService;

    private Usuario usuarioPrueba;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        // Preparamos un objeto base para los tests
        usuarioPrueba = new Usuario();
        usuarioPrueba.setId(1L);
        usuarioPrueba.setNombre("Juan Perez");
        usuarioPrueba.setEmail("juan@ecoland.com");
        usuarioPrueba.setRoles(new HashSet<>());
    }

    @Test
    void testGetUsuarioById_Success() {
        // Arrange
        when(usuarioRepositoryPort.findById(1L)).thenReturn(Optional.of(usuarioPrueba));

        // Act
        Optional<Usuario> result = usuarioService.getUsuarioById(1L);

        // Assert
        assertTrue(result.isPresent());
        assertEquals("juan@ecoland.com", result.get().getEmail());
        verify(usuarioRepositoryPort, times(1)).findById(1L);
    }

    @Test
    void testGetUsuarioByEmail_Success() {
        // Arrange
        String email = "juan@ecoland.com";
        when(usuarioRepositoryPort.findByEmail(email)).thenReturn(Optional.of(usuarioPrueba));

        // Act
        Optional<Usuario> result = usuarioService.getUsuarioByEmail(email);

        // Assert
        assertTrue(result.isPresent());
        assertEquals(1L, result.get().getId());
        verify(usuarioRepositoryPort, times(1)).findByEmail(email);
    }

    @Test
    void testCreateUsuario_Success() {
        // Arrange
        when(usuarioRepositoryPort.save(any(Usuario.class))).thenReturn(usuarioPrueba);

        // Act
        Usuario result = usuarioService.createUsuario(new Usuario());

        // Assert
        assertNotNull(result);
        assertEquals("Juan Perez", result.getNombre());
        verify(usuarioRepositoryPort, times(1)).save(any(Usuario.class));
    }

    @Test
    void testDeleteUsuario_Success() {
        // Arrange
        Long id = 1L;
        doNothing().when(usuarioRepositoryPort).deleteById(id);

        // Act
        usuarioService.deleteUsuario(id);

        // Assert
        verify(usuarioRepositoryPort, times(1)).deleteById(id);
    }

    @Test
    void testApproveLeaderRequest_Success() {
        // Arrange
        usuarioPrueba.setEstadoSolicitud(EstadoSolicitud.PENDING);
        when(usuarioRepositoryPort.findById(1L)).thenReturn(Optional.of(usuarioPrueba));
        
        Rol leaderRol = new Rol(2L, "LIDER");
        when(rolRepositoryPort.findByNombre("LIDER")).thenReturn(Optional.of(leaderRol));
        when(usuarioRepositoryPort.save(any(Usuario.class))).thenReturn(usuarioPrueba);

        // Act
        usuarioService.approveLeaderRequest(1L);

        // Assert
        assertEquals(EstadoSolicitud.APPROVED, usuarioPrueba.getEstadoSolicitud());
        assertTrue(usuarioPrueba.getRoles().contains(leaderRol));
        verify(usuarioRepositoryPort, times(1)).save(usuarioPrueba);
        verify(notificacionRepositoryPort, times(1)).save(any(Notificacion.class));
    }

    @Test
    void testRejectLeaderRequest_Success() {
        // Arrange
        usuarioPrueba.setEstadoSolicitud(EstadoSolicitud.PENDING);
        when(usuarioRepositoryPort.findById(1L)).thenReturn(Optional.of(usuarioPrueba));
        when(usuarioRepositoryPort.save(any(Usuario.class))).thenReturn(usuarioPrueba);

        // Act
        usuarioService.rejectLeaderRequest(1L);

        // Assert
        assertEquals(EstadoSolicitud.REJECTED, usuarioPrueba.getEstadoSolicitud());
        verify(usuarioRepositoryPort, times(1)).save(usuarioPrueba);
        verify(notificacionRepositoryPort, times(1)).save(any(Notificacion.class));
    }
}