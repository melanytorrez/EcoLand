package com.ecoland.infrastructure.repository;

import com.ecoland.infrastructure.entity.NotificacionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JpaNotificacionRepository extends JpaRepository<NotificacionEntity, Long> {
    List<NotificacionEntity> findByUsuarioEmailOrderByFechaCreacionDesc(String email);
}
