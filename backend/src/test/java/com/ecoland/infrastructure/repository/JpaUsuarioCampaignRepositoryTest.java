package com.ecoland.infrastructure.repository;

import com.ecoland.infrastructure.entity.UsuarioCampaignEntity;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class JpaUsuarioCampaignRepositoryTest {

    @Autowired
    private JpaUsuarioCampaignRepository repository;

    @Autowired
    private EntityManager entityManager;

    @Test
    @DisplayName("Should return true when user is already registered in campaign")
    void shouldReturnTrueIfExists() {
        // Arrange
        UsuarioCampaignEntity entity = new UsuarioCampaignEntity(
                "test@mail.com",
                1L,
                "2026-04-18"
        );

        entityManager.persist(entity);
        entityManager.flush();

        // Act
        boolean exists = repository.existsByUsuarioEmailAndCampaignId("test@mail.com", 1L);

        // Assert
        assertThat(exists).isTrue();
    }

    @Test
    @DisplayName("Should return false when user is not registered in campaign")
    void shouldReturnFalseIfNotExists() {
        // Act
        boolean exists = repository.existsByUsuarioEmailAndCampaignId("no@mail.com", 99L);

        // Assert
        assertThat(exists).isFalse();
    }

    @Test
    @DisplayName("Should not allow duplicate user-campaign registration")
    void shouldNotAllowDuplicates() {
        // Arrange
        UsuarioCampaignEntity entity1 = new UsuarioCampaignEntity(
                "test@mail.com",
                1L,
                "2026-04-18"
        );

        UsuarioCampaignEntity entity2 = new UsuarioCampaignEntity(
                "test@mail.com",
                1L,
                "2026-04-19"
        );

        entityManager.persist(entity1);
        entityManager.flush();

        // Act & Assert
        assertThatThrownBy(() -> {
            entityManager.persist(entity2);
            entityManager.flush(); // 🔥 aquí explota por unique constraint
        }).isInstanceOf(Exception.class);
    }
}