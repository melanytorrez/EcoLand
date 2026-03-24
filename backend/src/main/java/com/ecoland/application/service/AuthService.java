package com.ecoland.application.service;

import com.ecoland.domain.exception.EmailAlreadyExistsException;
import com.ecoland.infrastructure.security.JwtService;
import com.ecoland.application.dto.AuthResponse;
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
    public AuthResponse login(String email, String password) {
        Usuario usuario = usuarioRepositoryPort.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!passwordEncoder.matches(password, usuario.getPassword())) {
            throw new RuntimeException("Contraseña incorrecta");
        }

        String token = jwtService.generateToken(usuario.getEmail());

        registrarAuditoria(usuario.getId(), "LOGIN", "Inicio de sesión exitoso");

        return new AuthResponse(token, usuario.getEmail(), usuario.getNombre());
    }

    @Override
    public AuthResponse register(Usuario usuario) {
        if (usuarioRepositoryPort.findByEmail(usuario.getEmail()).isPresent()) {
            throw new EmailAlreadyExistsException("El email ya está registrado");
        }

        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        // Asignar roles por defecto si es necesario, o mantener vacío como estaba
        if (usuario.getRoles() == null) {
            usuario.setRoles(Collections.emptySet());
        }

        Usuario guardado = usuarioRepositoryPort.save(usuario);

        String token = jwtService.generateToken(guardado.getEmail());

        registrarAuditoria(guardado.getId(), "REGISTER", "Registro de nuevo usuario");

        return new AuthResponse(token, guardado.getEmail(), guardado.getNombre());
    }

    private void registrarAuditoria(Long usuarioId, String accion, String detalle) {
        AuditoriaLog log = new AuditoriaLog();
        log.setUsuarioId(usuarioId);
        log.setAccion(accion);
        log.setDetalle(detalle);
        log.setFecha(LocalDateTime.now());

        auditoriaRepositoryPort.save(log);
    }
}