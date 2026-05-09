package com.ecoland.infrastructure.adapter.out.persistence;

import com.ecoland.domain.model.RutaReciclaje;
import com.ecoland.domain.port.out.RutaReciclajeRepositoryPort;
import com.ecoland.infrastructure.entity.RutaReciclajeEntity;
import com.ecoland.infrastructure.repository.JpaRutaReciclajeRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class RutaReciclajeRepositoryAdapter implements RutaReciclajeRepositoryPort {

    private final JpaRutaReciclajeRepository repository;

    public RutaReciclajeRepositoryAdapter(JpaRutaReciclajeRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<RutaReciclaje> findAll() {
        return repository.findAll().stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public RutaReciclaje save(RutaReciclaje ruta) {
        RutaReciclajeEntity entity = toEntity(ruta);
        return toDomain(repository.save(entity));
    }

    private RutaReciclaje toDomain(RutaReciclajeEntity entity) {
        return new RutaReciclaje(
                entity.getId(),
                entity.getZona(),
                entity.getDiaSemana(),
                entity.getHorario(),
                entity.getVehiculoAsignado(),
                entity.getDescripcion(),
                entity.getCoordenadas()
        );
    }

    private RutaReciclajeEntity toEntity(RutaReciclaje domain) {
        RutaReciclajeEntity entity = new RutaReciclajeEntity();
        entity.setId(domain.getId());
        entity.setZona(domain.getZona());
        entity.setDiaSemana(domain.getDiaSemana());
        entity.setHorario(domain.getHorario());
        entity.setVehiculoAsignado(domain.getVehiculoAsignado());
        entity.setDescripcion(domain.getDescripcion());
        entity.setCoordenadas(domain.getCoordenadas());
        return entity;
    }
}
