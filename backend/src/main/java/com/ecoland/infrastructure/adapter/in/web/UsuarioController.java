package com.ecoland.infrastructure.adapter.in.web;

import com.ecoland.application.dto.UsuarioResponse;
import com.ecoland.application.dto.UserBadgeSummaryResponse;
import com.ecoland.application.service.BadgeService;
import com.ecoland.domain.model.Usuario;
import com.ecoland.domain.port.in.UsuarioUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;
import com.ecoland.domain.model.Campaign;

@RestController
@RequestMapping("/api/v1/usuarios")
public class UsuarioController {

    private final UsuarioUseCase usuarioUseCase;
    private final BadgeService badgeService;

    public UsuarioController(UsuarioUseCase usuarioUseCase, BadgeService badgeService) {
        this.usuarioUseCase = usuarioUseCase;
        this.badgeService = badgeService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponse> getUsuario(@PathVariable Long id) {
        return usuarioUseCase.getUsuarioById(id)
                .map(u -> ResponseEntity.ok(UsuarioResponse.fromUsuario(u)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/me")
    public ResponseEntity<UsuarioResponse> getCurrentUser(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED).build();
        }
        return usuarioUseCase.getUsuarioByEmail(authentication.getName())
                .map(u -> ResponseEntity.ok(UsuarioResponse.fromUsuario(u)))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Void> deleteUsuario(@PathVariable Long id) {
        usuarioUseCase.deleteUsuario(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<UsuarioResponse> updateUsuario(@RequestBody Usuario userDetails) {
        if (userDetails.getId() == null) {
            return ResponseEntity.badRequest().build();
        }
        return usuarioUseCase.getUsuarioById(userDetails.getId())
                .map(existingUser -> {
                    existingUser.setNombre(userDetails.getNombre());
                    Usuario updated = usuarioUseCase.createUsuario(existingUser);
                    return ResponseEntity.ok(UsuarioResponse.fromUsuario(updated));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/me/participations")
    public ResponseEntity<List<Campaign>> getMyParticipations(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(usuarioUseCase.getParticipacionesCompletas(authentication.getName()));
    }

    @GetMapping("/me/badges")
    public ResponseEntity<UserBadgeSummaryResponse> getMyBadges(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(badgeService.getBadgeSummary(authentication.getName()));
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
