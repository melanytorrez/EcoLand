package com.ecoland.application.service;

import com.ecoland.domain.model.Campaign;
import com.ecoland.domain.port.out.CampaignRepositoryPort;
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
}
