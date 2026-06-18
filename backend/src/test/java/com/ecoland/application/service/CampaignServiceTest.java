package com.ecoland.application.service;

import com.ecoland.domain.model.Campaign;
import com.ecoland.domain.model.Usuario;
import com.ecoland.domain.port.out.CampaignRepositoryPort;
import com.ecoland.domain.port.out.UsuarioRepositoryPort;
import com.ecoland.infrastructure.repository.JpaUsuarioCampaignRepository;
import com.ecoland.infrastructure.entity.UsuarioCampaignEntity;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CampaignServiceTest {

    @Mock
    private CampaignRepositoryPort campaignRepositoryPort;

    @Mock
    private JpaUsuarioCampaignRepository usuarioCampaignRepository;

    @Mock
    private UsuarioRepositoryPort usuarioRepositoryPort;

    @Mock
    private BadgeService badgeService;

    private CampaignService campaignService;
    private Campaign campaign;

    @BeforeEach
    void setUp() {
        when(campaignRepositoryPort.findAll()).thenReturn(List.of(new Campaign()));
        campaignService = new CampaignService(campaignRepositoryPort, usuarioCampaignRepository, usuarioRepositoryPort, badgeService);
        
        // Mock Security Context for Admin
        SecurityContext securityContext = mock(SecurityContext.class);
        Authentication authentication = mock(Authentication.class);
        lenient().doReturn(Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMINISTRADOR")))
            .when(authentication).getAuthorities();
        lenient().when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        clearInvocations(campaignRepositoryPort);

        campaign = new Campaign();
        campaign.setId(1L);
        campaign.setTitle("Original Title");
        campaign.setParticipants(10);
        campaign.setSpots(20);
    }

    @Test
    void getAllCampaigns_ShouldReturnList() {
        when(campaignRepositoryPort.findAll()).thenReturn(Arrays.asList(campaign));

        List<Campaign> result = campaignService.getAllCampaigns();

        assertEquals(1, result.size());
        verify(campaignRepositoryPort, times(1)).findAll();
    }

    @Test
    void getCampaignById_Success() {
        when(campaignRepositoryPort.findById(1L)).thenReturn(Optional.of(campaign));

        Campaign result = campaignService.getCampaignById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
    }

    @Test
    void getCampaignById_NotFound_ShouldThrowException() {
        when(campaignRepositoryPort.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> campaignService.getCampaignById(99L));
    }

    @Test
    void saveCampaign_Success() {
        when(campaignRepositoryPort.save(any(Campaign.class))).thenReturn(campaign);

        Campaign result = campaignService.saveCampaign(campaign);

        assertNotNull(result);
        verify(campaignRepositoryPort, times(1)).save(campaign);
    }

    @Test
    void saveCampaign_Error_ShouldThrowException() {
        when(campaignRepositoryPort.save(any())).thenThrow(new RuntimeException("DB Error"));

        assertThrows(RuntimeException.class, () -> campaignService.saveCampaign(campaign));
    }

    @Test
    void updateCampaign_Success() {
        // Arrange
        Campaign updatedInfo = new Campaign();
        updatedInfo.setTitle("New Title");
        updatedInfo.setSpots(30);

        when(campaignRepositoryPort.findById(1L)).thenReturn(Optional.of(campaign));
        when(campaignRepositoryPort.save(any())).thenAnswer(i -> i.getArguments()[0]);

        // Act
        Campaign result = campaignService.updateCampaign(1L, updatedInfo);

        // Assert
        assertEquals("New Title", result.getTitle());
        assertEquals(30, result.getSpots());
        verify(campaignRepositoryPort, times(1)).save(any(Campaign.class));
    }

    @Test
    void participateInCampaign_Success() {
        String email = "user@test.com";
        when(campaignRepositoryPort.findById(1L)).thenReturn(Optional.of(campaign));
        when(usuarioCampaignRepository.existsByUsuarioEmailAndCampaignId(email, 1L)).thenReturn(false);
        when(campaignRepositoryPort.save(any())).thenAnswer(i -> i.getArguments()[0]);

        Campaign result = campaignService.participateInCampaign(1L, email);

        assertEquals(11, result.getParticipants());
        verify(usuarioCampaignRepository, times(1)).save(any(UsuarioCampaignEntity.class));
        verify(campaignRepositoryPort, times(1)).save(any(Campaign.class));
        verify(badgeService, times(1)).evaluateAndAssignBadges(email);
    }

    @Test
    void participateInCampaign_AlreadyRegistered_ShouldThrowException() {
        String email = "user@test.com";
        when(campaignRepositoryPort.findById(1L)).thenReturn(Optional.of(campaign));
        when(usuarioCampaignRepository.existsByUsuarioEmailAndCampaignId(email, 1L)).thenReturn(true);

        assertThrows(IllegalStateException.class, () -> campaignService.participateInCampaign(1L, email));
    }

    @Test
    void participateInCampaign_NoSpots_ShouldThrowException() {
        campaign.setParticipants(20);
        campaign.setSpots(20);
        when(campaignRepositoryPort.findById(1L)).thenReturn(Optional.of(campaign));

        assertThrows(IllegalStateException.class, () -> campaignService.participateInCampaign(1L, "any@test.com"));
    }

    @Test
    void deleteCampaign_Success() {
        when(campaignRepositoryPort.findById(1L)).thenReturn(Optional.of(campaign));
        doNothing().when(campaignRepositoryPort).deleteById(1L);

        assertDoesNotThrow(() -> campaignService.deleteCampaign(1L));
        verify(campaignRepositoryPort, times(1)).deleteById(1L);
    }

    @Test
    void deleteCampaign_Error_ShouldThrowException() {
        when(campaignRepositoryPort.findById(1L)).thenReturn(Optional.of(campaign));
        doThrow(new RuntimeException("Delete Error")).when(campaignRepositoryPort).deleteById(1L);

        assertThrows(RuntimeException.class, () -> campaignService.deleteCampaign(1L));
    }

    // --- approveCampaign ---

    @Test
    void approveCampaign_SetsStatusActivaAndComment() {
        when(campaignRepositoryPort.findById(1L)).thenReturn(Optional.of(campaign));
        when(campaignRepositoryPort.save(any())).thenAnswer(i -> i.getArguments()[0]);

        Campaign result = campaignService.approveCampaign(1L, "Campaña aprobada");

        assertEquals("ACTIVA", result.getStatus());
        assertEquals("Campaña aprobada", result.getModerationComment());
        verify(campaignRepositoryPort).save(any(Campaign.class));
    }

    @Test
    void approveCampaign_ThrowsException_WhenNotFound() {
        when(campaignRepositoryPort.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> campaignService.approveCampaign(99L, "ok"));
    }

    // --- rejectCampaign ---

    @Test
    void rejectCampaign_SetsStatusRechazadaAndComment() {
        when(campaignRepositoryPort.findById(1L)).thenReturn(Optional.of(campaign));
        when(campaignRepositoryPort.save(any())).thenAnswer(i -> i.getArguments()[0]);

        Campaign result = campaignService.rejectCampaign(1L, "No cumple requisitos");

        assertEquals("RECHAZADA", result.getStatus());
        assertEquals("No cumple requisitos", result.getModerationComment());
    }

    @Test
    void rejectCampaign_ThrowsIllegalArgument_WhenCommentIsBlank() {
        assertThrows(IllegalArgumentException.class, () -> campaignService.rejectCampaign(1L, ""));
    }

    @Test
    void rejectCampaign_ThrowsException_WhenNotFound() {
        when(campaignRepositoryPort.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> campaignService.rejectCampaign(99L, "motivo"));
    }

    // --- getMyCampaigns ---

    @Test
    void getMyCampaigns_ReturnsCampaignsForCurrentUser() {
        // SecurityContext ya está mockeado como ADMIN en setUp
        // Necesitamos que el principal tenga un email y que usuarioRepositoryPort lo resuelva
        Authentication auth = mock(Authentication.class);
        SecurityContext ctx = mock(SecurityContext.class);
        when(ctx.getAuthentication()).thenReturn(auth);
        lenient().when(auth.getPrincipal()).thenReturn("lider@ecoland.com");
        lenient().doReturn(Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMINISTRADOR")))
                .when(auth).getAuthorities();
        SecurityContextHolder.setContext(ctx);

        Usuario usuario = new Usuario();
        usuario.setId(5L);
        when(usuarioRepositoryPort.findByEmail("lider@ecoland.com")).thenReturn(Optional.of(usuario));
        when(campaignRepositoryPort.findByCreatorId(5L)).thenReturn(List.of(campaign));

        List<Campaign> result = campaignService.getMyCampaigns();

        assertEquals(1, result.size());
        verify(campaignRepositoryPort).findByCreatorId(5L);
    }

    // --- getPendingCampaigns ---

    @Test
    void getPendingCampaigns_ReturnsOnlyPendientes() {
        Campaign pendiente = new Campaign();
        pendiente.setId(2L);
        pendiente.setStatus("PENDIENTE");

        when(campaignRepositoryPort.findByStatus("PENDIENTE")).thenReturn(List.of(pendiente));

        List<Campaign> result = campaignService.getPendingCampaigns();

        assertEquals(1, result.size());
        assertEquals("PENDIENTE", result.get(0).getStatus());
        verify(campaignRepositoryPort).findByStatus("PENDIENTE");
    }
}
