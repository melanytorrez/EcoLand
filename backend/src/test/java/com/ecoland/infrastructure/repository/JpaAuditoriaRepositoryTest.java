package com.ecoland.infrastructure.repository;

import com.ecoland.infrastructure.entity.AuditoriaLogEntity;
import com.ecoland.infrastructure.entity.UsuarioEntity;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class JpaAuditoriaRepositoryTest {

    @Autowired
    private JpaAuditoriaRepository repository;

    @Autowired
    private EntityManager entityManager;

    @BeforeEach
    void cleanDatabase() {
        repository.deleteAll();
        repository.flush();
    }

    private UsuarioEntity createUsuario() {
        UsuarioEntity u = new UsuarioEntity();
        u.setNombre("Diego");
        u.setEmail("diego@test.com");
        u.setPassword("1234");
        return u;
    }

    private AuditoriaLogEntity createLog(UsuarioEntity usuario) {
        AuditoriaLogEntity log = new AuditoriaLogEntity();
        log.setAccion("CREATE");
        log.setDetalle("Creación de recurso");
        log.setFecha(LocalDateTime.now());
        log.setUsuario(usuario);
        return log;
    }

    @Test
    @DisplayName("Should save and find AuditoriaLog")
    void shouldSaveAndFind() {
        // Arrange
        UsuarioEntity usuario = createUsuario();
        entityManager.persist(usuario);

        AuditoriaLogEntity log = createLog(usuario);
        entityManager.persist(log);
        entityManager.flush();
        entityManager.clear();

        // Act
        Optional<AuditoriaLogEntity> result = repository.findById(log.getId());

        // Assert
        assertThat(result).isPresent();
        assertThat(result.get().getAccion()).isEqualTo("CREATE");
    }

    @Test
    @DisplayName("Should return all logs")
    void shouldFindAll() {
        UsuarioEntity usuario = createUsuario();
        entityManager.persist(usuario);

        entityManager.persist(createLog(usuario));
        entityManager.persist(createLog(usuario));
        entityManager.flush();

        List<AuditoriaLogEntity> result = repository.findAll();

        assertThat(result).hasSize(2);
    }

    @Test
    @DisplayName("Should allow log without usuario")
    void shouldAllowNullUsuario() {
        AuditoriaLogEntity log = new AuditoriaLogEntity();
        log.setAccion("DELETE");
        log.setDetalle("Eliminación");
        log.setFecha(LocalDateTime.now());
        log.setUsuario(null);

        entityManager.persist(log);
        entityManager.flush();

        assertThat(log.getId()).isNotNull();
    }
}