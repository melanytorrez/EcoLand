package com.ecoland.application.service;

import com.ecoland.application.dto.AuthResponse;
import com.ecoland.application.dto.LoginRequest;
import com.ecoland.application.dto.RegisterRequest;
import com.ecoland.domain.model.Usuario;
import com.ecoland.domain.port.in.AuthUseCase;
import com.ecoland.domain.port.out.UsuarioRepositoryPort;
import com.ecoland.security.JwtService;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class AuthService implements AuthUseCase {

    private final UsuarioRepositoryPort usuarioRepositoryPort;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UsuarioRepositoryPort usuarioRepositoryPort, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.usuarioRepositoryPort = usuarioRepositoryPort;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepositoryPort.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
            throw new RuntimeException("Contraseña incorrecta");
        }

        // Token generation placeholder
        String token = jwtService.generateToken(usuario.getEmail());
        return new AuthResponse(token, usuario.getEmail(), usuario.getNombre());
    }

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (usuarioRepositoryPort.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("El email ya está registrado");
        }

        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setNombre(request.getNombre());
        nuevoUsuario.setEmail(request.getEmail());
        nuevoUsuario.setPassword(passwordEncoder.encode(request.getPassword()));
        nuevoUsuario.setRoles(Collections.emptySet());

        Usuario guardado = usuarioRepositoryPort.save(nuevoUsuario);
        
        String token = jwtService.generateToken(guardado.getEmail());
        return new AuthResponse(token, guardado.getEmail(), guardado.getNombre());
    }
}
