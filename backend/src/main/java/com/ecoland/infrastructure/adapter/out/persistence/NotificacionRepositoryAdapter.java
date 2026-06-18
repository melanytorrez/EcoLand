package com.ecoland.infrastructure.adapter.out.persistence;

import com.ecoland.domain.model.Notificacion;
import com.ecoland.domain.port.out.NotificacionRepositoryPort;
import com.ecoland.infrastructure.entity.NotificacionEntity;
import com.ecoland.infrastructure.repository.JpaNotificacionRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class NotificacionRepositoryAdapter implements NotificacionRepositoryPort {

    private final JpaNotificacionRepository jpaNotificacionRepository;

    public NotificacionRepositoryAdapter(JpaNotificacionRepository jpaNotificacionRepository) {
        this.jpaNotificacionRepository = jpaNotificacionRepository;
    }

    @Override
    public Notificacion save(Notificacion notificacion) {
        NotificacionEntity entity = toEntity(notificacion);
        return toDomain(jpaNotificacionRepository.save(entity));
    }

    @Override
    public List<Notificacion> findByUsuarioEmail(String email) {
        return jpaNotificacionRepository.findByUsuarioEmailOrderByFechaCreacionDesc(email)
                .stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<Notificacion> findById(Long id) {
        return jpaNotificacionRepository.findById(id).map(this::toDomain);
    }

    @Override
    public void deleteById(Long id) {
        jpaNotificacionRepository.deleteById(id);
    }

    private Notificacion toDomain(NotificacionEntity entity) {
        if (entity == null) return null;
        return new Notificacion(
                entity.getId(),
                entity.getUsuarioEmail(),
                entity.getMensaje(),
                entity.isLeido(),
                entity.getFechaCreacion()
        );
    }

    private NotificacionEntity toEntity(Notificacion domain) {
        if (domain == null) return null;
        NotificacionEntity entity = new NotificacionEntity();
        entity.setId(domain.getId());
        entity.setUsuarioEmail(domain.getUsuarioEmail());
        entity.setMensaje(domain.getMensaje());
        entity.setLeido(domain.isLeido());
        entity.setFechaCreacion(domain.getFechaCreacion());
        return entity;
    }
}
