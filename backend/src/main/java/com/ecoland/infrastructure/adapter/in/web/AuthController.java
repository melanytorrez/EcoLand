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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final AuthUseCase authUseCase;

    public AuthController(AuthUseCase authUseCase) {
        this.authUseCase = authUseCase;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        logger.info("Intento de login para el usuario: {}", request.getEmail());
        try {
            AuthResponse response = authUseCase.login(request.getEmail(), request.getPassword());
            logger.info("Login exitoso para el usuario: {}", request.getEmail());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.warn("Intento de login fallido para el usuario: {} - {}", request.getEmail(), e.getMessage());
            throw e;
        }
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