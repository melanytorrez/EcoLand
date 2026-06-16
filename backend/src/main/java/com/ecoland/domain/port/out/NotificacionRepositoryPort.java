package com.ecoland.domain.port.out;

import com.ecoland.domain.model.Notificacion;
import java.util.List;
import java.util.Optional;

public interface NotificacionRepositoryPort {
    Notificacion save(Notificacion notificacion);
    List<Notificacion> findByUsuarioEmail(String email);
    Optional<Notificacion> findById(Long id);
    void deleteById(Long id);
}
