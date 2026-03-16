package com.ecoland.application.service;

import com.ecoland.security.JwtService;
import com.ecoland.application.dto.AuthResponse;
import com.ecoland.application.dto.LoginRequest;
import com.ecoland.application.dto.RegisterRequest;
import com.ecoland.domain.model.AuditoriaLog;
import com.ecoland.domain.model.Usuario;
import com.ecoland.domain.port.in.AuthUseCase;
import com.ecoland.domain.port.out.AuditoriaRepositoryPort;
import com.ecoland.domain.port.out.UsuarioRepositoryPort;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;

@Service
public class AuthService implements AuthUseCase {

    private final UsuarioRepositoryPort usuarioRepositoryPort;
    private final AuditoriaRepositoryPort auditoriaRepositoryPort;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UsuarioRepositoryPort usuarioRepositoryPort,
            AuditoriaRepositoryPort auditoriaRepositoryPort,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.usuarioRepositoryPort = usuarioRepositoryPort;
        this.auditoriaRepositoryPort = auditoriaRepositoryPort;
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

        String token = jwtService.generateToken(usuario.getEmail());

        registrarAuditoria(usuario.getEmail(), "LOGIN");

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

        registrarAuditoria(guardado.getEmail(), "REGISTER");

        return new AuthResponse(token, guardado.getEmail(), guardado.getNombre());
    }

    private void registrarAuditoria(String email, String accion) {
        AuditoriaLog log = new AuditoriaLog();
        log.setUsuarioEmail(email);
        log.setAccion(accion);
        log.setFecha(LocalDateTime.now());

        auditoriaRepositoryPort.save(log);
    }
}