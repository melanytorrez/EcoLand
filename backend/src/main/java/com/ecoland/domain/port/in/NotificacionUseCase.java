package com.ecoland.domain.port.in;

import com.ecoland.domain.model.Notificacion;
import java.util.List;

public interface NotificacionUseCase {
    List<Notificacion> obtenerNotificacionesUsuario(String email);
    Notificacion crearNotificacion(String email, String mensaje);
    void marcarComoLeida(Long id);
    void eliminarNotificacion(Long id);
}
