package com.ecoland.application.service;

import com.ecoland.application.dto.AuthResponse;
import com.ecoland.domain.exception.EmailAlreadyExistsException;
import com.ecoland.domain.model.AuditoriaLog;
import com.ecoland.domain.model.Rol;
import com.ecoland.domain.model.Usuario;
import com.ecoland.domain.port.out.AuditoriaRepositoryPort;
import com.ecoland.domain.port.out.RolRepositoryPort;
import com.ecoland.domain.port.out.UsuarioRepositoryPort;
import com.ecoland.infrastructure.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Collections;
import java.util.HashSet;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AuthServiceTest {

    @Mock private UsuarioRepositoryPort usuarioRepositoryPort;
    @Mock private RolRepositoryPort rolRepositoryPort;
    @Mock private AuditoriaRepositoryPort auditoriaRepositoryPort;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    private Usuario testUsuario;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Preparar un usuario de prueba común
        testUsuario = new Usuario();
        testUsuario.setId(1L);
        testUsuario.setNombre("Eco User");
        testUsuario.setEmail("test@ecoland.com");
        testUsuario.setPassword("encoded_password");
        testUsuario.setRoles(new HashSet<>(Collections.singletonList(new Rol(1L, "Usuario"))));
    }

    // --- TESTS DE LOGIN ---

    @Test
    void testLogin_Success() {
        // Arrange
        String rawPassword = "password123";
        when(usuarioRepositoryPort.findByEmail(testUsuario.getEmail())).thenReturn(Optional.of(testUsuario));
        when(passwordEncoder.matches(rawPassword, testUsuario.getPassword())).thenReturn(true);
        when(jwtService.generateToken(testUsuario.getEmail())).thenReturn("mocked_token");

        // Act
        AuthResponse response = authService.login(testUsuario.getEmail(), rawPassword);

        // Assert
        assertNotNull(response);
        assertEquals("mocked_token", response.getToken());
        assertEquals(testUsuario.getEmail(), response.getEmail());
        verify(auditoriaRepositoryPort, times(1)).save(any(AuditoriaLog.class));
    }

    @Test
    void testLogin_UserNotFound() {
        // Arrange
        when(usuarioRepositoryPort.findByEmail(anyString())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> authService.login("fail@test.com", "pass"));
    }

    @Test
    void testLogin_WrongPassword() {
        // Arrange
        when(usuarioRepositoryPort.findByEmail(testUsuario.getEmail())).thenReturn(Optional.of(testUsuario));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(false);

        // Act & Assert
        assertThrows(RuntimeException.class, () -> authService.login(testUsuario.getEmail(), "wrong_pass"));
    }

    // --- TESTS DE REGISTRO ---

    @Test
    void testRegister_Success() {
        // Arrange
        Usuario nuevoUsuario = new Usuario(null, "Nuevo", "nuevo@eco.com", "pass", null);
        Rol rolPersistido = new Rol(1L, "Usuario");

        when(usuarioRepositoryPort.findByEmail(anyString())).thenReturn(Optional.empty());
        when(rolRepositoryPort.findByNombre(anyString())).thenReturn(Optional.of(rolPersistido));
        when(passwordEncoder.encode(anyString())).thenReturn("hashed_pass");
        when(usuarioRepositoryPort.save(any(Usuario.class))).thenReturn(testUsuario);
        when(jwtService.generateToken(anyString())).thenReturn("new_token");

        // Act
        AuthResponse response = authService.register(nuevoUsuario);

        // Assert
        assertNotNull(response);
        verify(usuarioRepositoryPort).save(nuevoUsuario);
        verify(auditoriaRepositoryPort).save(any(AuditoriaLog.class));
    }

    @Test
    void testRegister_EmailAlreadyExists() {
        // Arrange
        when(usuarioRepositoryPort.findByEmail(testUsuario.getEmail())).thenReturn(Optional.of(testUsuario));

        // Act & Assert
        assertThrows(EmailAlreadyExistsException.class, () -> authService.register(testUsuario));
    }
}