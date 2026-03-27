package com.ecoland.application.service;

import com.ecoland.domain.exception.EmailAlreadyExistsException;
import com.ecoland.infrastructure.security.JwtService;
import com.ecoland.application.dto.AuthResponse;
import com.ecoland.domain.model.AuditoriaLog;
import com.ecoland.domain.model.Rol;
import com.ecoland.domain.model.Usuario;
import com.ecoland.domain.port.in.AuthUseCase;
import com.ecoland.domain.port.out.AuditoriaRepositoryPort;
import com.ecoland.domain.port.out.RolRepositoryPort;
import com.ecoland.domain.port.out.UsuarioRepositoryPort;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Set;

@Service
public class AuthService implements AuthUseCase {

    private final UsuarioRepositoryPort usuarioRepositoryPort;
    private final RolRepositoryPort rolRepositoryPort;
    private final AuditoriaRepositoryPort auditoriaRepositoryPort;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UsuarioRepositoryPort usuarioRepositoryPort,
            RolRepositoryPort rolRepositoryPort,
            AuditoriaRepositoryPort auditoriaRepositoryPort,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.usuarioRepositoryPort = usuarioRepositoryPort;
        this.rolRepositoryPort = rolRepositoryPort;
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

        return new AuthResponse(token, usuario.getEmail(), usuario.getNombre(), resolvePrimaryRole(usuario.getRoles()));
    }

    @Override
    public AuthResponse register(Usuario usuario) {
        if (usuarioRepositoryPort.findByEmail(usuario.getEmail()).isPresent()) {
            throw new EmailAlreadyExistsException("El email ya está registrado");
        }

        String requestedRole = resolvePrimaryRole(usuario.getRoles());
        String normalizedRole = normalizeRoleName(requestedRole);
        Rol persistedRole = rolRepositoryPort.findByNombre(normalizedRole)
                .orElseGet(() -> rolRepositoryPort.save(new Rol(null, normalizedRole)));
        usuario.setRoles(Collections.singleton(persistedRole));

        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));

        Usuario guardado = usuarioRepositoryPort.save(usuario);

        String token = jwtService.generateToken(guardado.getEmail());

        registrarAuditoria(guardado.getId(), "REGISTER", "Registro de nuevo usuario");

        return new AuthResponse(token, guardado.getEmail(), guardado.getNombre(), resolvePrimaryRole(guardado.getRoles()));
    }

    private String resolvePrimaryRole(Set<com.ecoland.domain.model.Rol> roles) {
        if (roles == null || roles.isEmpty()) {
            return "Usuario";
        }

        return roles.stream()
                .map(com.ecoland.domain.model.Rol::getNombre)
                .filter(nombre -> nombre != null && !nombre.isBlank())
                .findFirst()
                .orElse("Usuario");
    }

    private String normalizeRoleName(String role) {
        if (role == null) {
            return "Usuario";
        }

        String value = role.trim().toLowerCase();
        if (value.contains("admin")) {
            return "Admin";
        }

        return "Usuario";
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
