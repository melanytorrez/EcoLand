package com.ecoland.infrastructure.adapter.out.persistence;

import com.ecoland.domain.model.AuditoriaLog;
import com.ecoland.domain.model.Usuario;
import com.ecoland.domain.model.Rol;
import com.ecoland.domain.port.out.AuditoriaRepositoryPort;
import com.ecoland.infrastructure.entity.AuditoriaLogEntity;
import com.ecoland.infrastructure.entity.UsuarioEntity;
import com.ecoland.infrastructure.repository.JpaAuditoriaRepository;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class AuditoriaRepositoryAdapter implements AuditoriaRepositoryPort {

    private final JpaAuditoriaRepository jpaAuditoriaRepository;

    public AuditoriaRepositoryAdapter(JpaAuditoriaRepository jpaAuditoriaRepository) {
        this.jpaAuditoriaRepository = jpaAuditoriaRepository;
    }

    @Override
    public AuditoriaLog save(AuditoriaLog log) {
        return toDomain(jpaAuditoriaRepository.save(toEntity(log)));
    }

    private AuditoriaLog toDomain(AuditoriaLogEntity entity) {
        Long usuarioId = entity.getUsuario() != null ? entity.getUsuario().getId() : null;
        return new AuditoriaLog(entity.getId(), entity.getAccion(), entity.getDetalle(), entity.getFecha(), usuarioId);
    }

    private AuditoriaLogEntity toEntity(AuditoriaLog log) {
        AuditoriaLogEntity entity = new AuditoriaLogEntity();
        entity.setId(log.getId());
        entity.setAccion(log.getAccion());
        entity.setDetalle(log.getDetalle());
        entity.setFecha(log.getFecha());
        
        if (log.getUsuarioId() != null) {
            UsuarioEntity userEntity = new UsuarioEntity();
            userEntity.setId(log.getUsuarioId());
            entity.setUsuario(userEntity);
        }
        
        return entity;
    }
}
