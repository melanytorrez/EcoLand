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

import com.ecoland.infrastructure.config.AppConstants;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Set;
import org.springframework.transaction.annotation.Transactional;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import java.util.UUID;


@Service
@Transactional
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

        return new AuthResponse(token, usuario.getEmail(), usuario.getNombre(), resolvePrimaryRole(usuario.getRoles()), usuario.getId());
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

        return new AuthResponse(token, guardado.getEmail(), guardado.getNombre(), resolvePrimaryRole(guardado.getRoles()), guardado.getId());
    }

    @Override
    public AuthResponse loginWithGoogle(String googleTokenId) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                    // TODO: Replace with real Google Client ID
                    .setAudience(Collections.singletonList("453422657382-mpgsm4p398f0s54848p4uhmrop3uueu6.apps.googleusercontent.com"))
                    .build();

            // When testing locally without a real token or real Client ID, this will fail.
            GoogleIdToken idToken = verifier.verify(googleTokenId);
            if (idToken == null) {
                throw new IllegalArgumentException("Token de Google invalido.");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String name = (String) payload.get("name");

            Usuario usuario = usuarioRepositoryPort.findByEmail(email).orElse(null);
            
            if (usuario == null) {
                usuario = new Usuario();
                usuario.setEmail(email);
                usuario.setNombre(name != null ? name : "Usuario Google");
                usuario.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
                
                String requestedRole = "Usuario";
                Rol persistedRole = rolRepositoryPort.findByNombre(requestedRole)
                        .orElseGet(() -> rolRepositoryPort.save(new Rol(null, requestedRole)));
                usuario.setRoles(Collections.singleton(persistedRole));
                
                usuario = usuarioRepositoryPort.save(usuario);
                registrarAuditoria(usuario.getId(), "REGISTER_GOOGLE", "Registro mediante Google");
            } else {
                registrarAuditoria(usuario.getId(), "LOGIN_GOOGLE", "Inicio de sesion con Google exitoso");
            }

            String token = jwtService.generateToken(usuario.getEmail());
            return new AuthResponse(token, usuario.getEmail(), usuario.getNombre(), resolvePrimaryRole(usuario.getRoles()), usuario.getId());

        } catch (Exception e) {
            throw new RuntimeException("Error verificando token de Google: " + e.getMessage(), e);
        }
    }

    private String resolvePrimaryRole(Set<com.ecoland.domain.model.Rol> roles) {
        if (roles == null || roles.isEmpty()) {
            return AppConstants.ROLE_USER;
        }

        return roles.stream()
                .map(com.ecoland.domain.model.Rol::getNombre)
                .filter(nombre -> nombre != null && !nombre.isBlank())
                .map(String::trim)
                .map(String::toUpperCase)
                .filter(nombre -> nombre.equals(AppConstants.ROLE_ADMIN) || 
                                  nombre.equals(AppConstants.ROLE_LEADER) || 
                                  nombre.equals(AppConstants.ROLE_USER))
                .findFirst()
                .orElse(AppConstants.ROLE_USER);
    }

    private String normalizeRoleName(String role) {
        if (role == null) {
            return AppConstants.ROLE_USER;
        }

        String value = role.trim().toUpperCase();
        if (value.contains("ADMIN")) {
            return AppConstants.ROLE_ADMIN;
        }
        if (value.contains("LIDER") || value.contains("LEADER")) {
            return AppConstants.ROLE_LEADER;
        }

        return AppConstants.ROLE_USER;
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
