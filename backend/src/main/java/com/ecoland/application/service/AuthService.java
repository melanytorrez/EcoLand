package com.ecoland.application.service;

import com.ecoland.application.dto.AuthResponse;
import com.ecoland.domain.model.Usuario;
import com.ecoland.domain.port.in.AuthUseCase;
import com.ecoland.domain.port.out.UsuarioRepositoryPort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class AuthService implements AuthUseCase {

    private final UsuarioRepositoryPort usuarioRepositoryPort;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UsuarioRepositoryPort usuarioRepositoryPort, PasswordEncoder passwordEncoder) {
        this.usuarioRepositoryPort = usuarioRepositoryPort;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public AuthResponse login(String email, String password) {
        Usuario usuario = usuarioRepositoryPort.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!passwordEncoder.matches(password, usuario.getPassword())) {
            throw new RuntimeException("Contraseña incorrecta");
        }

        // Token generation placeholder
        String token = "jwt-token-placeholder";
        return new AuthResponse(token, usuario.getEmail(), usuario.getNombre());
    }

    @Override
    public AuthResponse register(Usuario usuario) {
        if (usuarioRepositoryPort.findByEmail(usuario.getEmail()).isPresent()) {
            throw new RuntimeException("El email ya está registrado");
        }

        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        usuario.setRoles(Collections.emptySet());

        Usuario guardado = usuarioRepositoryPort.save(usuario);

        String token = "jwt-token-placeholder";
        return new AuthResponse(token, guardado.getEmail(), guardado.getNombre());
    }
}
