package com.ecoland.application.service;

import com.ecoland.domain.model.Campaign;
import com.ecoland.domain.port.out.CampaignRepositoryPort;
import com.ecoland.infrastructure.repository.JpaUsuarioCampaignRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CampaignServiceTest {

    @Mock
    private CampaignRepositoryPort campaignRepositoryPort;

    @Mock
    private JpaUsuarioCampaignRepository usuarioCampaignRepository;

    @InjectMocks
    private CampaignService campaignService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetCampaignById_Success() {
        // Arrange
        Long campaignId = 1L;
        Campaign campaign = new Campaign();
        campaign.setId(campaignId);
        campaign.setTitle("Test Campaign");

        when(campaignRepositoryPort.findById(campaignId)).thenReturn(Optional.of(campaign));

        // Act
        Campaign result = campaignService.getCampaignById(campaignId);

        // Assert
        assertNotNull(result);
        assertEquals(campaignId, result.getId());
        assertEquals("Test Campaign", result.getTitle());
        verify(campaignRepositoryPort, times(1)).findById(campaignId);
    }

    @Test
    void testGetCampaignById_NotFound() {
        // Arrange
        Long campaignId = 99L;
        when(campaignRepositoryPort.findById(campaignId)).thenReturn(Optional.empty());

        // Act & Assert
        Exception exception = assertThrows(RuntimeException.class, () -> {
            campaignService.getCampaignById(campaignId);
        });

        assertTrue(exception.getMessage().contains("Campaign not found"));
        verify(campaignRepositoryPort, times(1)).findById(campaignId);
    }

    @Test
    void testParticipateInCampaign_Success() {
        // Arrange
        Long campaignId = 1L;
        String email = "test@eco.com";
        Campaign campaign = new Campaign();
        campaign.setId(campaignId);
        campaign.setParticipants(10);
        campaign.setSpots(20);

        when(campaignRepositoryPort.findById(campaignId)).thenReturn(Optional.of(campaign));
        when(usuarioCampaignRepository.existsByUsuarioEmailAndCampaignId(email, campaignId)).thenReturn(false);
        when(campaignRepositoryPort.save(any(Campaign.class))).thenReturn(campaign);

        // Act
        Campaign result = campaignService.participateInCampaign(campaignId, email);

        // Assert
        assertEquals(11, result.getParticipants());
        verify(usuarioCampaignRepository, times(1)).save(any());
        verify(campaignRepositoryPort, times(1)).save(campaign);
    }

    @Test
    void testParticipateInCampaign_AlreadyRegistered() {
        // Arrange
        Long id = 1L;
        String email = "test@eco.com";
        when(campaignRepositoryPort.findById(id)).thenReturn(Optional.of(new Campaign()));
        when(usuarioCampaignRepository.existsByUsuarioEmailAndCampaignId(email, id)).thenReturn(true);

        // Act & Assert
        assertThrows(IllegalStateException.class, () -> {
            campaignService.participateInCampaign(id, email);
        }, "Ya estás inscrito en esta campaña");
    }

    @Test
    void testParticipateInCampaign_NoSpots() {
        // Arrange
        Long id = 1L;
        Campaign fullCampaign = new Campaign();
        fullCampaign.setParticipants(50);
        fullCampaign.setSpots(50);

        when(campaignRepositoryPort.findById(id)).thenReturn(Optional.of(fullCampaign));

        // Act & Assert
        assertThrows(IllegalStateException.class, () -> {
            campaignService.participateInCampaign(id, "user@eco.com");
        }, "La campaña ya no tiene cupos disponibles");
    }
}
