package com.ecoland.infrastructure.repository;

import com.ecoland.infrastructure.entity.UsuarioEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;
import com.ecoland.domain.model.EstadoSolicitud;

public interface JpaUsuarioRepository extends JpaRepository<UsuarioEntity, Long> {
    Optional<UsuarioEntity> findByEmail(String email);
    List<UsuarioEntity> findByEstadoSolicitud(EstadoSolicitud estadoSolicitud);
}
