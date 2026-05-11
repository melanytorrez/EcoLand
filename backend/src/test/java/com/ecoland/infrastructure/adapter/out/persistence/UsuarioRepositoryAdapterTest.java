package com.ecoland.infrastructure.adapter.out.persistence;

import com.ecoland.domain.model.Rol;
import com.ecoland.domain.model.Usuario;
import com.ecoland.domain.model.EstadoSolicitud;
import com.ecoland.infrastructure.entity.RolEntity;
import com.ecoland.infrastructure.entity.UsuarioEntity;
import com.ecoland.infrastructure.repository.JpaUsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsuarioRepositoryAdapterTest {

    @Mock
    private JpaUsuarioRepository jpaUsuarioRepository;

    @InjectMocks
    private UsuarioRepositoryAdapter adapter;

    private Usuario usuarioDomain;
    private UsuarioEntity usuarioEntity;
    private Rol rolDomain;
    private RolEntity rolEntity;

    @BeforeEach
    void setUp() {
        rolDomain = new Rol(1L, "ROLE_USER");
        rolEntity = new RolEntity(1L, "ROLE_USER");

        Set<Rol> rolesDomain = new HashSet<>();
        rolesDomain.add(rolDomain);

        Set<RolEntity> rolesEntity = new HashSet<>();
        rolesEntity.add(rolEntity);

        usuarioDomain = new Usuario(1L, "Test User", "test@ecoland.com", "password123", rolesDomain, EstadoSolicitud.NONE);

        usuarioEntity = new UsuarioEntity();
        usuarioEntity.setId(1L);
        usuarioEntity.setNombre("Test User");
        usuarioEntity.setEmail("test@ecoland.com");
        usuarioEntity.setPassword("password123");
        usuarioEntity.setRoles(rolesEntity);
    }

    @Test
    void findById_WhenExists_ShouldReturnUser() {
        when(jpaUsuarioRepository.findById(1L)).thenReturn(Optional.of(usuarioEntity));

        Optional<Usuario> result = adapter.findById(1L);

        assertTrue(result.isPresent());
        assertEquals("test@ecoland.com", result.get().getEmail());
        assertEquals(1, result.get().getRoles().size());
        verify(jpaUsuarioRepository).findById(1L);
    }

    @Test
    void findByEmail_WhenExists_ShouldReturnUser() {
        when(jpaUsuarioRepository.findByEmail("test@ecoland.com")).thenReturn(Optional.of(usuarioEntity));

        Optional<Usuario> result = adapter.findByEmail("test@ecoland.com");

        assertTrue(result.isPresent());
        assertEquals(1L, result.get().getId());
        verify(jpaUsuarioRepository).findByEmail("test@ecoland.com");
    }

    @Test
    void save_WithRoles_ShouldMapAndSave() {
        when(jpaUsuarioRepository.save(any(UsuarioEntity.class))).thenReturn(usuarioEntity);

        Usuario result = adapter.save(usuarioDomain);

        assertNotNull(result);
        assertEquals(1, result.getRoles().size());
        verify(jpaUsuarioRepository).save(any(UsuarioEntity.class));
    }

    @Test
    void save_WithoutRoles_ShouldHandleNullRolesInMapping() {
        usuarioDomain.setRoles(null);

        UsuarioEntity entitySinRoles = new UsuarioEntity();
        entitySinRoles.setRoles(null);

        when(jpaUsuarioRepository.save(any(UsuarioEntity.class))).thenReturn(entitySinRoles);

        Usuario result = adapter.save(usuarioDomain);

        assertNotNull(result);
        assertTrue(result.getRoles().isEmpty());
        verify(jpaUsuarioRepository).save(argThat(entity -> entity.getRoles() == null));
    }

    @Test
    void deleteById_ShouldInvokeRepository() {
        adapter.deleteById(1L);
        verify(jpaUsuarioRepository, times(1)).deleteById(1L);
    }

    @Test
    void toDomain_ShouldHandleEmptyRoles() {
        usuarioEntity.setRoles(Collections.emptySet());
        when(jpaUsuarioRepository.findById(1L)).thenReturn(Optional.of(usuarioEntity));

        Optional<Usuario> result = adapter.findById(1L);

        assertTrue(result.isPresent());
        assertTrue(result.get().getRoles().isEmpty());
    }
}