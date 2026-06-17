package com.ecoland.application.service;

import com.ecoland.domain.model.Campaign;
import com.ecoland.domain.model.EstadoSolicitud;
import com.ecoland.domain.model.Rol;
import com.ecoland.domain.model.Usuario;
import com.ecoland.domain.port.out.CampaignRepositoryPort;
import com.ecoland.domain.port.out.RolRepositoryPort;
import com.ecoland.domain.port.out.UsuarioRepositoryPort;
import com.ecoland.infrastructure.entity.UsuarioCampaignEntity;
import com.ecoland.infrastructure.repository.JpaUsuarioCampaignRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
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

    // --- Tests de solicitud de liderazgo ---

    @Test
    void testRequestLeaderStatus_UpdatesEstadoAndSavesUsuario() {
        usuarioPrueba.setEstadoSolicitud(EstadoSolicitud.NONE);
        when(usuarioRepositoryPort.findByEmail(usuarioPrueba.getEmail())).thenReturn(Optional.of(usuarioPrueba));
        when(usuarioRepositoryPort.save(any(Usuario.class))).thenReturn(usuarioPrueba);

        Usuario promotionData = new Usuario();
        promotionData.setMotivation("Quiero liderar");
        promotionData.setPlans("Plantar árboles");
        promotionData.setExperience("5 años en ecología");
        promotionData.setCommitment("Total");
        promotionData.setContact("71234567");
        promotionData.setZone("Norte");
        promotionData.setOrganization("EcoGreen");

        usuarioService.requestLeaderStatus(usuarioPrueba.getEmail(), promotionData);

        verify(usuarioRepositoryPort).save(argThat(u -> u.getEstadoSolicitud() == EstadoSolicitud.PENDING));
    }

    @Test
    void testRequestLeaderStatus_WhenRejectedBefore_AllowsNewRequest() {
        usuarioPrueba.setEstadoSolicitud(EstadoSolicitud.REJECTED);
        when(usuarioRepositoryPort.findByEmail(usuarioPrueba.getEmail())).thenReturn(Optional.of(usuarioPrueba));
        when(usuarioRepositoryPort.save(any(Usuario.class))).thenReturn(usuarioPrueba);

        usuarioService.requestLeaderStatus(usuarioPrueba.getEmail(), new Usuario());

        verify(usuarioRepositoryPort).save(argThat(u -> u.getEstadoSolicitud() == EstadoSolicitud.PENDING));
    }

    @Test
    void testRequestLeaderStatus_ThrowsException_WhenUserNotFound() {
        when(usuarioRepositoryPort.findByEmail(anyString())).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> usuarioService.requestLeaderStatus("noexiste@test.com", new Usuario()));
    }

    @Test
    void testApproveLeaderRequest_SetsRolLiderAndEstadoApproved() {
        usuarioPrueba.setEstadoSolicitud(EstadoSolicitud.PENDING);
        usuarioPrueba.setRoles(new HashSet<>(Collections.singletonList(new Rol(1L, "USUARIO"))));
        Rol rolLider = new Rol(2L, "LIDER");

        when(usuarioRepositoryPort.findById(1L)).thenReturn(Optional.of(usuarioPrueba));
        when(rolRepositoryPort.findByNombre("LIDER")).thenReturn(Optional.of(rolLider));
        when(usuarioRepositoryPort.save(any(Usuario.class))).thenReturn(usuarioPrueba);

        usuarioService.approveLeaderRequest(1L);

        verify(usuarioRepositoryPort).save(argThat(u ->
                u.getEstadoSolicitud() == EstadoSolicitud.APPROVED &&
                u.getRoles().contains(rolLider)));
    }

    @Test
    void testApproveLeaderRequest_ThrowsException_WhenUserNotFound() {
        when(usuarioRepositoryPort.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> usuarioService.approveLeaderRequest(99L));
    }

    @Test
    void testRejectLeaderRequest_SetsEstadoRejected() {
        usuarioPrueba.setEstadoSolicitud(EstadoSolicitud.PENDING);
        when(usuarioRepositoryPort.findById(1L)).thenReturn(Optional.of(usuarioPrueba));
        when(usuarioRepositoryPort.save(any(Usuario.class))).thenReturn(usuarioPrueba);

        usuarioService.rejectLeaderRequest(1L);

        verify(usuarioRepositoryPort).save(argThat(u -> u.getEstadoSolicitud() == EstadoSolicitud.REJECTED));
    }

    @Test
    void testGetPendingLeaderRequests_ReturnsList() {
        when(usuarioRepositoryPort.findByEstadoSolicitud(EstadoSolicitud.PENDING))
                .thenReturn(List.of(usuarioPrueba));

        List<Usuario> result = usuarioService.getPendingLeaderRequests();

        assertEquals(1, result.size());
        verify(usuarioRepositoryPort).findByEstadoSolicitud(EstadoSolicitud.PENDING);
    }

    @Test
    void testGetAllUsuarios_ReturnsList() {
        when(usuarioRepositoryPort.findAll()).thenReturn(List.of(usuarioPrueba));

        List<Usuario> result = usuarioService.getAllUsuarios();

        assertEquals(1, result.size());
        verify(usuarioRepositoryPort).findAll();
    }

    @Test
    void testGetParticipacionesCompletas_ReturnsCampaignList() {
        UsuarioCampaignEntity relacion = new UsuarioCampaignEntity();
        relacion.setCampaignId(10L);
        relacion.setUsuarioEmail(usuarioPrueba.getEmail());

        Campaign campaign = new Campaign();
        campaign.setId(10L);
        campaign.setTitle("Campaña Test");

        when(usuarioCampaignRepository.findByUsuarioEmail(usuarioPrueba.getEmail()))
                .thenReturn(List.of(relacion));
        when(campaignRepositoryPort.findById(10L)).thenReturn(Optional.of(campaign));

        List<Campaign> result = usuarioService.getParticipacionesCompletas(usuarioPrueba.getEmail());

        assertEquals(1, result.size());
        assertEquals("Campaña Test", result.get(0).getTitle());
    }

    @Test
    void testGetParticipacionesCompletas_FiltersOutMissingCampaigns() {
        UsuarioCampaignEntity relacion = new UsuarioCampaignEntity();
        relacion.setCampaignId(99L);
        relacion.setUsuarioEmail(usuarioPrueba.getEmail());

        when(usuarioCampaignRepository.findByUsuarioEmail(usuarioPrueba.getEmail()))
                .thenReturn(List.of(relacion));
        when(campaignRepositoryPort.findById(99L)).thenReturn(Optional.empty());

        List<Campaign> result = usuarioService.getParticipacionesCompletas(usuarioPrueba.getEmail());

        assertTrue(result.isEmpty());
    }
}