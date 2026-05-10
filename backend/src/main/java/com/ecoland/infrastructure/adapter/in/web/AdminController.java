package com.ecoland.infrastructure.adapter.in.web;

import com.ecoland.domain.model.Usuario;
import com.ecoland.domain.port.in.UsuarioUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {

    private final UsuarioUseCase usuarioUseCase;

    public AdminController(UsuarioUseCase usuarioUseCase) {
        this.usuarioUseCase = usuarioUseCase;
    }

    @GetMapping("/leader-requests")
    public ResponseEntity<List<Usuario>> getPendingLeaderRequests() {
        return ResponseEntity.ok(usuarioUseCase.getPendingLeaderRequests());
    }

    @PostMapping("/leader-requests/{userId}/approve")
    public ResponseEntity<Void> approveLeaderRequest(@PathVariable Long userId) {
        try {
            usuarioUseCase.approveLeaderRequest(userId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/leader-requests/{userId}/reject")
    public ResponseEntity<Void> rejectLeaderRequest(@PathVariable Long userId) {
        try {
            usuarioUseCase.rejectLeaderRequest(userId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/users")
    public ResponseEntity<List<Usuario>> getAllUsers() {
        return ResponseEntity.ok(usuarioUseCase.getAllUsuarios());
    }
}
