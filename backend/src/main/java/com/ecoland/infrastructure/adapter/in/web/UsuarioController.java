package com.ecoland.infrastructure.adapter.in.web;

import com.ecoland.domain.model.Usuario;
import com.ecoland.domain.port.in.UsuarioUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.ecoland.domain.model.Campaign;

@RestController
@RequestMapping("/api/v1/usuarios")
public class UsuarioController {

    private final UsuarioUseCase usuarioUseCase;

    public UsuarioController(UsuarioUseCase usuarioUseCase) {
        this.usuarioUseCase = usuarioUseCase;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> getUsuario(@PathVariable Long id) {
        return usuarioUseCase.getUsuarioById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/me")
    public ResponseEntity<Usuario> getCurrentUser(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED).build();
        }
        return usuarioUseCase.getUsuarioByEmail(authentication.getName())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUsuario(@PathVariable Long id) {
        usuarioUseCase.deleteUsuario(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me/participations")
    public ResponseEntity<List<Campaign>> getMyParticipations(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(usuarioUseCase.getParticipacionesCompletas(authentication.getName()));
    }

    @PostMapping("/me/request-leader")
    public ResponseEntity<Void> requestLeader(Authentication authentication, @RequestBody Usuario promotionData) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED).build();
        }
        try {
            usuarioUseCase.requestLeaderStatus(authentication.getName(), promotionData);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
