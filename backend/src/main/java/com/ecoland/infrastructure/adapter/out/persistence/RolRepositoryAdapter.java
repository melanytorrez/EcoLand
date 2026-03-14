package com.ecoland.infrastructure.adapter.out.persistence;

import com.ecoland.domain.model.Rol;
import com.ecoland.domain.port.out.RolRepositoryPort;
import com.ecoland.infrastructure.entity.RolEntity;
import com.ecoland.infrastructure.repository.JpaRolRepository;
import org.springframework.stereotype.Component;
import java.util.Optional;

@Component
public class RolRepositoryAdapter implements RolRepositoryPort {

    private final JpaRolRepository jpaRolRepository;

    public RolRepositoryAdapter(JpaRolRepository jpaRolRepository) {
        this.jpaRolRepository = jpaRolRepository;
    }

    @Override
    public Optional<Rol> findByNombre(String nombre) {
        return jpaRolRepository.findByNombre(nombre).map(this::toDomain);
    }

    @Override
    public Rol save(Rol rol) {
        return toDomain(jpaRolRepository.save(toEntity(rol)));
    }

    private Rol toDomain(RolEntity entity) {
        return new Rol(entity.getId(), entity.getNombre());
    }

    private RolEntity toEntity(Rol rol) {
        return new RolEntity(rol.getId(), rol.getNombre());
    }
}
