package com.ecoland.infrastructure.adapter.in.web;

import com.ecoland.application.dto.AuthResponse;
import com.ecoland.application.dto.LoginRequest;
import com.ecoland.application.dto.RegisterRequest;
import com.ecoland.domain.port.in.AuthUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthUseCase authUseCase;

    public AuthController(AuthUseCase authUseCase) {
        this.authUseCase = authUseCase;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authUseCase.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authUseCase.login(request));
    }
}