package com.ecoland.infrastructure.adapter.out.persistence;

import com.ecoland.domain.model.RutaReciclaje;
import com.ecoland.infrastructure.entity.RutaReciclajeEntity;
import com.ecoland.infrastructure.repository.JpaRutaReciclajeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RutaReciclajeRepositoryAdapterTest {

    @Mock
    private JpaRutaReciclajeRepository repository;

    @InjectMocks
    private RutaReciclajeRepositoryAdapter adapter;

    private RutaReciclajeEntity entity1;
    private RutaReciclajeEntity entity2;

    @BeforeEach
    void setUp() {
        entity1 = new RutaReciclajeEntity();
        entity1.setId(1L);
        entity1.setZona("Norte");
        entity1.setDiaSemana("Lunes");
        entity1.setHorario("08:00-12:00");
        entity1.setVehiculoAsignado("Camión 01");
        entity1.setDescripcion("Ruta norte");
        entity1.setCoordenadas(List.of("-17.39,-66.15"));

        entity2 = new RutaReciclajeEntity();
        entity2.setId(2L);
        entity2.setZona("Sur");
        entity2.setDiaSemana("Miércoles");
        entity2.setHorario("14:00-18:00");
        entity2.setVehiculoAsignado("Camión 02");
        entity2.setDescripcion("Ruta sur");
        entity2.setCoordenadas(List.of("-17.42,-66.14"));
    }

    @Test
    void findAll_ShouldReturnMappedDomainObjects() {
        when(repository.findAll()).thenReturn(Arrays.asList(entity1, entity2));

        List<RutaReciclaje> result = adapter.findAll();

        assertEquals(2, result.size());
        assertEquals("Norte", result.get(0).getZona());
        assertEquals("Sur", result.get(1).getZona());
        verify(repository, times(1)).findAll();
    }

    @Test
    void findAll_WhenEmpty_ShouldReturnEmptyList() {
        when(repository.findAll()).thenReturn(Collections.emptyList());

        List<RutaReciclaje> result = adapter.findAll();

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void findAll_ShouldMapAllFieldsCorrectly() {
        when(repository.findAll()).thenReturn(List.of(entity1));

        List<RutaReciclaje> result = adapter.findAll();

        RutaReciclaje domain = result.get(0);
        assertEquals(1L, domain.getId());
        assertEquals("Norte", domain.getZona());
        assertEquals("Lunes", domain.getDiaSemana());
        assertEquals("08:00-12:00", domain.getHorario());
        assertEquals("Camión 01", domain.getVehiculoAsignado());
        assertEquals("Ruta norte", domain.getDescripcion());
        assertNotNull(domain.getCoordenadas());
        assertEquals(1, domain.getCoordenadas().size());
    }

    @Test
    void save_ShouldMapAndPersistRuta() {
        RutaReciclaje domain = new RutaReciclaje(null, "Centro", "Viernes", "09:00-13:00", "Camión 03", "Ruta centro", List.of("-17.38,-66.16"));

        RutaReciclajeEntity savedEntity = new RutaReciclajeEntity();
        savedEntity.setId(3L);
        savedEntity.setZona("Centro");
        savedEntity.setDiaSemana("Viernes");
        savedEntity.setHorario("09:00-13:00");
        savedEntity.setVehiculoAsignado("Camión 03");
        savedEntity.setDescripcion("Ruta centro");
        savedEntity.setCoordenadas(List.of("-17.38,-66.16"));

        when(repository.save(any(RutaReciclajeEntity.class))).thenReturn(savedEntity);

        RutaReciclaje result = adapter.save(domain);

        assertNotNull(result);
        assertEquals(3L, result.getId());
        assertEquals("Centro", result.getZona());
        verify(repository, times(1)).save(any(RutaReciclajeEntity.class));
    }
}
