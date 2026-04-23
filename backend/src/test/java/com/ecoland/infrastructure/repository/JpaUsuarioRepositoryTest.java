package com.ecoland.infrastructure.repository;

import com.ecoland.infrastructure.entity.UsuarioEntity;
import com.ecoland.infrastructure.entity.RolEntity;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class JpaUsuarioRepositoryTest {

    @Autowired
    private JpaUsuarioRepository usuarioRepository;

    @Autowired
    private EntityManager entityManager;

    @Test
    @DisplayName("Should find user by email")
    void shouldFindUserByEmail() {
        // Arrange
        RolEntity rol = new RolEntity();
        rol.setNombre("USER");
        entityManager.persist(rol);

        UsuarioEntity usuario = new UsuarioEntity();
        usuario.setNombre("Diego");
        usuario.setEmail("diego@test.com");
        usuario.setPassword("1234");
        usuario.setRoles(Set.of(rol));

        entityManager.persist(usuario);
        entityManager.flush();

        // Act
        Optional<UsuarioEntity> result = usuarioRepository.findByEmail("diego@test.com");

        // Assert
        assertThat(result).isPresent();
        assertThat(result.get().getEmail()).isEqualTo("diego@test.com");
    }

    @Test
    @DisplayName("Should return empty when email does not exist")
    void shouldReturnEmptyWhenEmailNotFound() {
        // Act
        Optional<UsuarioEntity> result = usuarioRepository.findByEmail("noexist@test.com");

        // Assert
        assertThat(result).isEmpty();
    }
}