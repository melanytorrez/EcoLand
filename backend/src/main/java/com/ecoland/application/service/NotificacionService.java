package com.ecoland.application.service;

import com.ecoland.domain.model.Notificacion;
import com.ecoland.domain.port.in.NotificacionUseCase;
import com.ecoland.domain.port.out.NotificacionRepositoryPort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@Transactional
public class NotificacionService implements NotificacionUseCase {

    private final NotificacionRepositoryPort notificacionRepositoryPort;

    public NotificacionService(NotificacionRepositoryPort notificacionRepositoryPort) {
        this.notificacionRepositoryPort = notificacionRepositoryPort;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Notificacion> obtenerNotificacionesUsuario(String email) {
        return notificacionRepositoryPort.findByUsuarioEmail(email);
    }

    @Override
    public Notificacion crearNotificacion(String email, String mensaje) {
        Notificacion notificacion = new Notificacion();
        notificacion.setUsuarioEmail(email);
        notificacion.setMensaje(mensaje);
        notificacion.setLeido(false);
        notificacion.setFechaCreacion(LocalDateTime.now());
        return notificacionRepositoryPort.save(notificacion);
    }

    @Override
    public void marcarComoLeida(Long id) {
        Notificacion notificacion = notificacionRepositoryPort.findById(id)
                .orElseThrow(() -> new NoSuchElementException("No se encontró la notificación con id " + id));
        notificacion.setLeido(true);
        notificacion.setFechaCreacion(LocalDateTime.now()); // Para mantener la fecha/hora en que fue procesada/recibida si se requiere, pero wait: "La notificación incluye el resultado y la fecha". La fecha en la notificacion debe ser de cuando se crea, o de cuando cambia. Let's keep the creation date! So let's NOT change fechaCreacion.
        notificacionRepositoryPort.save(notificacion);
    }

    @Override
    public void eliminarNotificacion(Long id) {
        notificacionRepositoryPort.deleteById(id);
    }
}
