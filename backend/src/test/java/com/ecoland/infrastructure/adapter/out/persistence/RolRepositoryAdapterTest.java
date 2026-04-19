package com.ecoland.infrastructure.adapter.out.persistence;

import com.ecoland.domain.model.Rol;
import com.ecoland.infrastructure.entity.RolEntity;
import com.ecoland.infrastructure.repository.JpaRolRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RolRepositoryAdapterTest {

    @Mock
    private JpaRolRepository jpaRolRepository;

    @InjectMocks
    private RolRepositoryAdapter adapter;

    private Rol rolDomain;
    private RolEntity rolEntity;

    @BeforeEach
    void setUp() {
        rolDomain = new Rol(1L, "ROLE_USER");
        rolEntity = new RolEntity(1L, "ROLE_USER");
    }

    @Test
    void findByNombre_WhenExists_ShouldReturnMappedRol() {
        // Arrange
        when(jpaRolRepository.findByNombre("ROLE_USER")).thenReturn(Optional.of(rolEntity));

        // Act
        Optional<Rol> result = adapter.findByNombre("ROLE_USER");

        // Assert
        assertTrue(result.isPresent());
        assertEquals(1L, result.get().getId());
        assertEquals("ROLE_USER", result.get().getNombre());
        verify(jpaRolRepository, times(1)).findByNombre("ROLE_USER");
    }

    @Test
    void findByNombre_WhenNotExists_ShouldReturnEmpty() {
        // Arrange
        when(jpaRolRepository.findByNombre("ROLE_ADMIN")).thenReturn(Optional.empty());

        // Act
        Optional<Rol> result = adapter.findByNombre("ROLE_ADMIN");

        // Assert
        assertTrue(result.isEmpty());
    }

    @Test
    void save_ShouldMapAndReturnSavedRol() {
        // Arrange
        when(jpaRolRepository.save(any(RolEntity.class))).thenReturn(rolEntity);

        // Act
        Rol result = adapter.save(rolDomain);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("ROLE_USER", result.getNombre());

        verify(jpaRolRepository).save(argThat(entity ->
                entity.getNombre().equals("ROLE_USER")
        ));
    }
}