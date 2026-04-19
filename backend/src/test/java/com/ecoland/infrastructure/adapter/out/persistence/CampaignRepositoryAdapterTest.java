package com.ecoland.infrastructure.adapter.out.persistence;

import com.ecoland.domain.model.Campaign;
import com.ecoland.infrastructure.entity.CampaignEntity;
import com.ecoland.infrastructure.repository.JpaCampaignRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CampaignRepositoryAdapterTest {

    @Mock
    private JpaCampaignRepository repository;

    @InjectMocks
    private CampaignRepositoryAdapter adapter;

    private Campaign campaignDomain;
    private CampaignEntity campaignEntity;

    @BeforeEach
    void setUp() {
        campaignDomain = new Campaign();
        campaignDomain.setId(1L);
        campaignDomain.setTitle("Reforestación");
        campaignDomain.setDescription("Plantando árboles");
        campaignDomain.setRequirements(Arrays.asList("Guantes", "Agua"));
        campaignDomain.setSpots(50);
        campaignDomain.setParticipants(10);
        campaignEntity = new CampaignEntity();
        campaignEntity.setId(1L);
        campaignEntity.setTitle("Reforestación");
        campaignEntity.setDescription("Plantando árboles");
        campaignEntity.setRequirements(Arrays.asList("Guantes", "Agua"));
        campaignEntity.setSpots(50);
        campaignEntity.setParticipants(10);
    }

    @Test
    void findAll_ShouldReturnList() {
        // Arrange
        when(repository.findAll()).thenReturn(Arrays.asList(campaignEntity));

        // Act
        List<Campaign> result = adapter.findAll();

        // Assert
        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
        assertEquals("Reforestación", result.get(0).getTitle());
        verify(repository, times(1)).findAll();
    }

    @Test
    void findById_WhenExists_ShouldReturnOptionalWithCampaign() {
        // Arrange
        when(repository.findById(1L)).thenReturn(Optional.of(campaignEntity));

        // Act
        Optional<Campaign> result = adapter.findById(1L);

        // Assert
        assertTrue(result.isPresent());
        assertEquals(1L, result.get().getId());
        assertEquals("Reforestación", result.get().getTitle());
    }

    @Test
    void findById_WhenNotExists_ShouldReturnEmptyOptional() {
        // Arrange
        when(repository.findById(99L)).thenReturn(Optional.empty());

        // Act
        Optional<Campaign> result = adapter.findById(99L);

        // Assert
        assertTrue(result.isEmpty());
    }

    @Test
    void save_ShouldMapAndSaveEntity() {
        // Arrange
        when(repository.save(any(CampaignEntity.class))).thenReturn(campaignEntity);

        // Act
        Campaign result = adapter.save(campaignDomain);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Reforestación", result.getTitle());
        assertEquals(Arrays.asList("Guantes", "Agua"), result.getRequirements());

        verify(repository, times(1)).save(any(CampaignEntity.class));
    }

    @Test
    void deleteById_ShouldInvokeRepository() {
        // Act
        adapter.deleteById(1L);

        // Assert
        verify(repository, times(1)).deleteById(1L);
    }
}