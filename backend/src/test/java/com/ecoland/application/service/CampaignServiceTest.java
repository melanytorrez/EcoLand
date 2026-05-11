package com.ecoland.application.service;

import com.ecoland.domain.model.Campaign;
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

    private CampaignService campaignService;
    private Campaign campaign;

    @BeforeEach
    void setUp() {
        when(campaignRepositoryPort.findAll()).thenReturn(List.of(new Campaign()));
        campaignService = new CampaignService(campaignRepositoryPort, usuarioCampaignRepository, usuarioRepositoryPort);
        
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
}