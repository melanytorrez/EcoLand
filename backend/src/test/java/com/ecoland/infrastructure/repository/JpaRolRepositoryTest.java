package com.ecoland.infrastructure.repository;

import com.ecoland.infrastructure.entity.RolEntity;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class JpaRolRepositoryTest {

    @Autowired
    private JpaRolRepository repository;

    @Autowired
    private EntityManager entityManager;

    @Test
    @DisplayName("Should find role by nombre")
    void shouldFindByNombre() {
        // Arrange
        RolEntity rol = new RolEntity();
        rol.setNombre("ADMIN");

        entityManager.persist(rol);
        entityManager.flush();

        // Act
        Optional<RolEntity> result = repository.findByNombre("ADMIN");

        // Assert
        assertThat(result).isPresent();
        assertThat(result.get().getNombre()).isEqualTo("ADMIN");
    }

    @Test
    @DisplayName("Should return empty when role does not exist")
    void shouldReturnEmptyWhenNotFound() {
        // Act
        Optional<RolEntity> result = repository.findByNombre("USER");

        // Assert
        assertThat(result).isEmpty();
    }

    @Test
    @DisplayName("Should not allow duplicate role names")
    void shouldNotAllowDuplicateNombre() {
        // Arrange
        RolEntity rol1 = new RolEntity();
        rol1.setNombre("ADMIN");

        RolEntity rol2 = new RolEntity();
        rol2.setNombre("ADMIN");

        entityManager.persist(rol1);
        entityManager.flush();

        // Act & Assert
        assertThatThrownBy(() -> {
            entityManager.persist(rol2);
            entityManager.flush();
        }).isInstanceOf(Exception.class);
    }
}