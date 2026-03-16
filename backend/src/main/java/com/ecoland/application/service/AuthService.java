package com.ecoland.application.service;

import com.ecoland.security.JwtService;
import com.ecoland.application.dto.AuthResponse;
<<<<<<< HEAD
import com.ecoland.application.dto.LoginRequest;
import com.ecoland.application.dto.RegisterRequest;
import com.ecoland.domain.model.AuditoriaLog;
=======
>>>>>>> RamaBackLu
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
<<<<<<< HEAD
    public AuthResponse login(LoginRequest request) {

        Usuario usuario = usuarioRepositoryPort.findByEmail(request.getEmail())
=======
    public AuthResponse login(String email, String password) {
        Usuario usuario = usuarioRepositoryPort.findByEmail(email)
>>>>>>> RamaBackLu
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!passwordEncoder.matches(password, usuario.getPassword())) {
            throw new RuntimeException("Contraseña incorrecta");
        }

        String token = jwtService.generateToken(usuario.getEmail());

        registrarAuditoria(usuario.getEmail(), "LOGIN");

        return new AuthResponse(token, usuario.getEmail(), usuario.getNombre());
    }

    @Override
<<<<<<< HEAD
    public AuthResponse register(RegisterRequest request) {

        if (usuarioRepositoryPort.findByEmail(request.getEmail()).isPresent()) {
=======
    public AuthResponse register(Usuario usuario) {
        if (usuarioRepositoryPort.findByEmail(usuario.getEmail()).isPresent()) {
>>>>>>> RamaBackLu
            throw new RuntimeException("El email ya está registrado");
        }

        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        usuario.setRoles(Collections.emptySet());

        Usuario guardado = usuarioRepositoryPort.save(usuario);

<<<<<<< HEAD
        Usuario guardado = usuarioRepositoryPort.save(nuevoUsuario);

        String token = jwtService.generateToken(guardado.getEmail());

        registrarAuditoria(guardado.getEmail(), "REGISTER");

=======
        String token = "jwt-token-placeholder";
>>>>>>> RamaBackLu
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