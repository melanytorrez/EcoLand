package com.ecoland.application.service;

import com.ecoland.infrastructure.entity.FeatureToggleEntity;
import com.ecoland.infrastructure.repository.FeatureToggleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Collections;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FeatureToggleServiceTest {

    @Mock
    private FeatureToggleRepository repository;

    @InjectMocks
    private FeatureToggleService featureToggleService;

    private FeatureToggleEntity enabledToggle;
    private FeatureToggleEntity disabledToggle;

    @BeforeEach
    void setUp() {
        enabledToggle = new FeatureToggleEntity("reforestacion", true);
        disabledToggle = new FeatureToggleEntity("reciclaje", false);
    }

    // --- isEnabled ---

    @Test
    void isEnabled_WhenFeatureExists_AndEnabled_ShouldReturnTrue() {
        when(repository.findByFeatureName("reforestacion")).thenReturn(Optional.of(enabledToggle));

        boolean result = featureToggleService.isEnabled("reforestacion");

        assertTrue(result);
    }

    @Test
    void isEnabled_WhenFeatureExists_AndDisabled_ShouldReturnFalse() {
        when(repository.findByFeatureName("reciclaje")).thenReturn(Optional.of(disabledToggle));

        boolean result = featureToggleService.isEnabled("reciclaje");

        assertFalse(result);
    }

    @Test
    void isEnabled_WhenFeatureDoesNotExist_ShouldReturnFalse() {
        when(repository.findByFeatureName("unknown")).thenReturn(Optional.empty());

        boolean result = featureToggleService.isEnabled("unknown");

        assertFalse(result);
    }

    @Test
    void isEnabled_WhenFeatureNameIsNull_ShouldReturnFalse() {
        boolean result = featureToggleService.isEnabled(null);

        assertFalse(result);
        verify(repository, never()).findByFeatureName(any());
    }

    @Test
    void isEnabled_WhenFeatureNameIsBlank_ShouldReturnFalse() {
        boolean result = featureToggleService.isEnabled("   ");

        assertFalse(result);
        verify(repository, never()).findByFeatureName(any());
    }

    // --- getAllToggles ---

    @Test
    void getAllToggles_ShouldReturnMapOfAllFeatures() {
        when(repository.findAll()).thenReturn(Arrays.asList(enabledToggle, disabledToggle));

        Map<String, Boolean> result = featureToggleService.getAllToggles();

        assertEquals(2, result.size());
        assertTrue(result.get("reforestacion"));
        assertFalse(result.get("reciclaje"));
    }

    @Test
    void getAllToggles_WhenEmpty_ShouldReturnEmptyMap() {
        when(repository.findAll()).thenReturn(Collections.emptyList());

        Map<String, Boolean> result = featureToggleService.getAllToggles();

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    // --- updateToggle ---

    @Test
    void updateToggle_WhenFeatureExists_ShouldUpdateIt() {
        when(repository.findByFeatureName("reforestacion")).thenReturn(Optional.of(enabledToggle));
        when(repository.save(any(FeatureToggleEntity.class))).thenReturn(enabledToggle);

        featureToggleService.updateToggle("reforestacion", false);

        verify(repository, times(1)).save(argThat(entity -> !entity.isEnabled()));
    }

    @Test
    void updateToggle_WhenFeatureDoesNotExist_ShouldCreateNewToggle() {
        when(repository.findByFeatureName("nueva")).thenReturn(Optional.empty());
        when(repository.save(any(FeatureToggleEntity.class))).thenAnswer(i -> i.getArguments()[0]);

        featureToggleService.updateToggle("nueva", true);

        verify(repository, times(1)).save(argThat(entity ->
                entity.getFeatureName().equals("nueva") && entity.isEnabled()
        ));
    }
}
