package com.ecoland.infrastructure.adapter.out.persistence;

import com.ecoland.domain.model.PuntoVerde;
import com.ecoland.domain.model.PuntoVerdeHorario;
import com.ecoland.infrastructure.entity.PuntoVerdeEntity;
import com.ecoland.infrastructure.entity.PuntoVerdeHorarioEntity;
import com.ecoland.infrastructure.repository.JpaPuntoVerdeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PuntoVerdeRepositoryAdapterTest {

    @Mock
    private JpaPuntoVerdeRepository jpaRepository;

    @InjectMocks
    private PuntoVerdeRepositoryAdapter adapter;

    private PuntoVerde puntoVerdeDomain;
    private PuntoVerdeEntity puntoVerdeEntity;

    @BeforeEach
    void setUp() {
        PuntoVerdeHorario horario = new PuntoVerdeHorario();
        horario.setId(1L);
        horario.setDiaSemana("LUNES");
        horario.setHoraApertura(LocalTime.of(8, 0));
        horario.setHoraCierre(LocalTime.of(18, 0));

        puntoVerdeDomain = new PuntoVerde();
        puntoVerdeDomain.setId(1L);
        puntoVerdeDomain.setNombre("Punto Ecológico");
        puntoVerdeDomain.setDireccion("Calle Falsa 123");
        puntoVerdeDomain.setZona("Norte");
        puntoVerdeDomain.setEstado("Abierto");
        puntoVerdeDomain.setTiposMaterial(Arrays.asList("Plástico", "Papel"));
        puntoVerdeDomain.setHorarios(Collections.singletonList(horario));

        PuntoVerdeHorarioEntity horarioEntity = new PuntoVerdeHorarioEntity();
        horarioEntity.setId(1L);
        horarioEntity.setDiaSemana("LUNES");
        horarioEntity.setHoraApertura(LocalTime.of(8, 0));
        horarioEntity.setHoraCierre(LocalTime.of(18, 0));

        puntoVerdeEntity = new PuntoVerdeEntity();
        puntoVerdeEntity.setId(1L);
        puntoVerdeEntity.setNombre("Punto Ecológico");
        puntoVerdeEntity.setDireccion("Calle Falsa 123");
        puntoVerdeEntity.setZona("Norte");
        puntoVerdeEntity.setEstado("Abierto");
        puntoVerdeEntity.setTiposMaterial(Arrays.asList("Plástico", "Papel"));
        puntoVerdeEntity.setHorarios(Collections.singletonList(horarioEntity));
        horarioEntity.setPuntoVerde(puntoVerdeEntity);
    }

    @Test
    void findAll_ShouldReturnMappedDomainList() {
        when(jpaRepository.findAll()).thenReturn(Arrays.asList(puntoVerdeEntity));

        List<PuntoVerde> result = adapter.findAll();

        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
        assertEquals("Punto Ecológico", result.get(0).getNombre());
        assertEquals(1, result.get(0).getHorarios().size());
        verify(jpaRepository).findAll();
    }

    @Test
    void findById_WhenFound_ShouldReturnOptional() {
        when(jpaRepository.findById(1L)).thenReturn(Optional.of(puntoVerdeEntity));

        Optional<PuntoVerde> result = adapter.findById(1L);

        assertTrue(result.isPresent());
        assertEquals(1L, result.get().getId());
        assertEquals("LUNES", result.get().getHorarios().get(0).getDiaSemana());
    }

    @Test
    void findById_WhenNotFound_ShouldReturnEmpty() {
        when(jpaRepository.findById(99L)).thenReturn(Optional.empty());

        Optional<PuntoVerde> result = adapter.findById(99L);

        assertTrue(result.isEmpty());
    }

    @Test
    void save_WithHorarios_ShouldMapAndSaveCorrectly() {
        when(jpaRepository.save(any(PuntoVerdeEntity.class))).thenReturn(puntoVerdeEntity);

        PuntoVerde result = adapter.save(puntoVerdeDomain);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals(1, result.getHorarios().size());
        verify(jpaRepository).save(argThat(entity ->
                entity.getHorarios() != null &&
                        entity.getHorarios().get(0).getPuntoVerde() == entity
        ));
    }

    @Test
    void save_WithoutHorarios_ShouldHandleNullGracefully() {
        puntoVerdeDomain.setHorarios(null);
        PuntoVerdeEntity entitySinHorarios = new PuntoVerdeEntity();
        entitySinHorarios.setHorarios(null);

        when(jpaRepository.save(any(PuntoVerdeEntity.class))).thenReturn(entitySinHorarios);

        PuntoVerde result = adapter.save(puntoVerdeDomain);

        assertNull(result.getHorarios());
        verify(jpaRepository).save(argThat(entity -> entity.getHorarios() == null));
    }

    @Test
    void deleteById_ShouldInvokeRepository() {
        adapter.deleteById(1L);
        verify(jpaRepository, times(1)).deleteById(1L);
    }
}