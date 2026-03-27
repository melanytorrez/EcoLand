package com.ecoland.infrastructure.adapter.in.web;

import com.ecoland.application.dto.AuthResponse;
import com.ecoland.application.dto.LoginRequest;
import com.ecoland.application.dto.RegisterRequest;
import com.ecoland.domain.model.Rol;
import com.ecoland.domain.model.Usuario;
import com.ecoland.domain.port.in.AuthUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.Collections;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthUseCase authUseCase;

    public AuthController(AuthUseCase authUseCase) {
        this.authUseCase = authUseCase;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authUseCase.login(request.getEmail(), request.getPassword()));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        Usuario usuario = new Usuario();
        usuario.setNombre(request.getNombre());
        usuario.setEmail(request.getEmail());
        usuario.setPassword(request.getPassword());
        if (request.getRole() != null && !request.getRole().isBlank()) {
            usuario.setRoles(Collections.singleton(new Rol(null, request.getRole())));
        }
        return ResponseEntity.ok(authUseCase.register(usuario));
    }


}