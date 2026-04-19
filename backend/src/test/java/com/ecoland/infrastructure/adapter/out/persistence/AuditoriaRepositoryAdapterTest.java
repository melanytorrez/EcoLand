package com.ecoland.infrastructure.adapter.out.persistence;

import com.ecoland.domain.model.AuditoriaLog;
import com.ecoland.infrastructure.entity.AuditoriaLogEntity;
import com.ecoland.infrastructure.entity.UsuarioEntity;
import com.ecoland.infrastructure.repository.JpaAuditoriaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuditoriaRepositoryAdapterTest {

    @Mock
    private JpaAuditoriaRepository jpaAuditoriaRepository;

    @InjectMocks
    private AuditoriaRepositoryAdapter auditoriaRepositoryAdapter;

    private AuditoriaLog logConUsuario;
    private AuditoriaLog logSinUsuario;
    private AuditoriaLogEntity entityConUsuario;

    @BeforeEach
    void setUp() {
        LocalDateTime fecha = LocalDateTime.now();

        logConUsuario = new AuditoriaLog(1L, "CREATE", "Registro creado", fecha, 10L);
        logSinUsuario = new AuditoriaLog(2L, "SYSTEM", "Evento de sistema", fecha, null);

        UsuarioEntity userEntity = new UsuarioEntity();
        userEntity.setId(10L);

        entityConUsuario = new AuditoriaLogEntity();
        entityConUsuario.setId(1L);
        entityConUsuario.setAccion("CREATE");
        entityConUsuario.setDetalle("Registro creado");
        entityConUsuario.setFecha(fecha);
        entityConUsuario.setUsuario(userEntity);
    }

    @Test
    void save_ShouldReturnDomainObject_WhenUserIsPresent() {
        // Arrange
        when(jpaAuditoriaRepository.save(any(AuditoriaLogEntity.class))).thenReturn(entityConUsuario);

        // Act
        AuditoriaLog result = auditoriaRepositoryAdapter.save(logConUsuario);

        // Assert
        assertNotNull(result);
        assertEquals(logConUsuario.getId(), result.getId());
        assertEquals(logConUsuario.getUsuarioId(), result.getUsuarioId());
        assertEquals("CREATE", result.getAccion());

        verify(jpaAuditoriaRepository, times(1)).save(any(AuditoriaLogEntity.class));
    }

    @Test
    void save_ShouldWorkCorrectly_WhenUserIsNull() {
        // Arrange
        AuditoriaLogEntity entitySinUsuario = new AuditoriaLogEntity();
        entitySinUsuario.setId(2L);
        entitySinUsuario.setAccion("SYSTEM");
        entitySinUsuario.setUsuario(null);

        when(jpaAuditoriaRepository.save(any(AuditoriaLogEntity.class))).thenReturn(entitySinUsuario);

        // Act
        AuditoriaLog result = auditoriaRepositoryAdapter.save(logSinUsuario);

        // Assert
        assertNotNull(result);
        assertNull(result.getUsuarioId());
        assertEquals(2L, result.getId());

        verify(jpaAuditoriaRepository).save(any(AuditoriaLogEntity.class));
    }

    @Test
    void toEntity_ShouldHandleNullUserId() {

        when(jpaAuditoriaRepository.save(argThat(entity -> entity.getUsuario() == null)))
                .thenReturn(new AuditoriaLogEntity());

        auditoriaRepositoryAdapter.save(logSinUsuario);

        verify(jpaAuditoriaRepository).save(argThat(entity -> entity.getUsuario() == null));
    }
}