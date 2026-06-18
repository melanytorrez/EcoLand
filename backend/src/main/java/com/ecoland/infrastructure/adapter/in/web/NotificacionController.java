package com.ecoland.infrastructure.adapter.in.web;

import com.ecoland.domain.model.Notificacion;
import com.ecoland.domain.port.in.NotificacionUseCase;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notificaciones")
public class NotificacionController {

    private final NotificacionUseCase notificacionUseCase;

    public NotificacionController(NotificacionUseCase notificacionUseCase) {
        this.notificacionUseCase = notificacionUseCase;
    }

    @GetMapping
    public ResponseEntity<List<Notificacion>> getMyNotifications(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<Notificacion> notifications = notificacionUseCase.obtenerNotificacionesUsuario(authentication.getName());
        return ResponseEntity.ok(notifications);
    }

    @PutMapping("/{id}/leer")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        try {
            notificacionUseCase.marcarComoLeida(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id) {
        try {
            notificacionUseCase.eliminarNotificacion(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
