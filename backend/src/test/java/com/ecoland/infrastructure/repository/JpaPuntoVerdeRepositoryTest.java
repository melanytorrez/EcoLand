package com.ecoland.infrastructure.repository;

import com.ecoland.infrastructure.entity.PuntoVerdeEntity;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class JpaPuntoVerdeRepositoryTest {

    @Autowired
    private JpaPuntoVerdeRepository repository;

    @Autowired
    private EntityManager entityManager;

    @Test
    @DisplayName("Should save and find PuntoVerde by id")
    void shouldSaveAndFindById() {
        // Arrange
        PuntoVerdeEntity punto = new PuntoVerdeEntity();
        punto.setNombre("Punto Verde 1");
        punto.setDireccion("Av. Siempre Viva 123");
        punto.setZona("Norte");
        punto.setEstado("activo");

        entityManager.persist(punto);
        entityManager.flush();

        // Act
        Optional<PuntoVerdeEntity> result = repository.findById(punto.getId());

        // Assert
        assertThat(result).isPresent();
        assertThat(result.get().getNombre()).isEqualTo("Punto Verde 1");
    }

    @Test
    @DisplayName("Should return all PuntoVerde")
    void shouldFindAll() {
        PuntoVerdeEntity p1 = new PuntoVerdeEntity();
        p1.setNombre("P1");
        p1.setDireccion("Dir1");
        p1.setZona("Zona1");
        p1.setEstado("activo");

        PuntoVerdeEntity p2 = new PuntoVerdeEntity();
        p2.setNombre("P2");
        p2.setDireccion("Dir2");
        p2.setZona("Zona2");
        p2.setEstado("activo");

        entityManager.persist(p1);
        entityManager.persist(p2);
        entityManager.flush();

        List<PuntoVerdeEntity> result = repository.findAll();

        assertThat(result).hasSize(2);
    }

    @Test
    @DisplayName("Should return empty when id does not exist")
    void shouldReturnEmptyWhenNotFound() {
        // Act
        Optional<PuntoVerdeEntity> result = repository.findById(999L);

        // Assert
        assertThat(result).isEmpty();
    }
}