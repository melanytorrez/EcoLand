package com.ecoland.application.service;

import com.ecoland.application.dto.AuthResponse;
import com.ecoland.application.dto.LoginRequest;
import com.ecoland.application.dto.RegisterRequest;
import com.ecoland.domain.model.AuditoriaLog;
import com.ecoland.domain.model.Usuario;
import com.ecoland.domain.port.in.AuthUseCase;
import com.ecoland.domain.port.out.AuditoriaRepositoryPort;
import com.ecoland.domain.port.out.UsuarioRepositoryPort;
import com.ecoland.security.JwtService;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;

@Service
public class AuthService implements AuthUseCase {

    private final UsuarioRepositoryPort usuarioRepository;
    private final AuditoriaRepositoryPort auditoriaRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UsuarioRepositoryPort usuarioRepository,
            AuditoriaRepositoryPort auditoriaRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.usuarioRepository = usuarioRepository;
        this.auditoriaRepository = auditoriaRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Override
    public AuthResponse login(LoginRequest request) {

        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
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

        // ✔ validar email duplicado
        if (usuarioRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("El email ya está registrado");
        }

        // ✔ crear usuario
        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setNombre(request.getNombre());
        nuevoUsuario.setEmail(request.getEmail());

        // ✔ contraseña encriptada
        nuevoUsuario.setPassword(passwordEncoder.encode(request.getPassword()));

        nuevoUsuario.setRoles(Collections.emptySet());

        // ✔ guardar usuario
        Usuario guardado = usuarioRepository.save(nuevoUsuario);

        // ✔ generar token
        String token = jwtService.generateToken(guardado.getEmail());

        // ✔ auditoría
        registrarAuditoria(guardado.getEmail(), "REGISTER");

        return new AuthResponse(token, guardado.getEmail(), guardado.getNombre());
    }

    private void registrarAuditoria(String email, String accion) {

        AuditoriaLog log = new AuditoriaLog();
        log.setUsuarioEmail(email);
        log.setAccion(accion);
        log.setFecha(LocalDateTime.now());

        auditoriaRepository.save(log);
    }
}