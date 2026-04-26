package com.ecoland.infrastructure.repository;

import com.ecoland.infrastructure.entity.CampaignEntity;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class JpaCampaignRepositoryTest {

    @Autowired
    private JpaCampaignRepository repository;

    @Autowired
    private EntityManager entityManager;

    @BeforeEach
    void cleanDatabase() {
        repository.deleteAll();
        repository.flush();
    }

    private CampaignEntity createCampaign(String status, int participants) {
        CampaignEntity c = new CampaignEntity();
        c.setTitle("Campaña");
        c.setDate("2026-04-18");
        c.setLocation("Cochabamba");
        c.setOrganizer("EcoLand");
        c.setStatus(status);
        c.setParticipants(participants);
        return c;
    }

    @Test
    @DisplayName("Should count campaigns by status")
    void shouldCountByStatus() {
        // Arrange
        entityManager.persist(createCampaign("ACTIVE", 10));
        entityManager.persist(createCampaign("ACTIVE", 5));
        entityManager.persist(createCampaign("INACTIVE", 3));
        entityManager.flush();
        entityManager.clear();

        // Act
        Long count = repository.countByStatus("ACTIVE");

        // Assert
        assertThat(count).isEqualTo(2L);
    }

    @Test
    @DisplayName("Should return 0 when no campaigns with given status")
    void shouldReturnZeroWhenNoStatusMatch() {
        // Act
        Long count = repository.countByStatus("UNKNOWN");

        // Assert
        assertThat(count).isEqualTo(0L);
    }

    @Test
    @DisplayName("Should sum all participants")
    void shouldSumAllParticipants() {
        // Arrange
        entityManager.persist(createCampaign("ACTIVE", 10));
        entityManager.persist(createCampaign("ACTIVE", 5));
        entityManager.persist(createCampaign("INACTIVE", 3));
        entityManager.flush();
        entityManager.clear();

        // Act
        Long total = repository.sumAllParticipants();

        // Assert
        assertThat(total).isEqualTo(18L);
    }

    @Test
    @DisplayName("Should return 0 when no participants exist")
    void shouldReturnZeroWhenNoData() {
        // Act
        Long total = repository.sumAllParticipants();

        // Assert
        assertThat(total).isEqualTo(0L);
    }
}