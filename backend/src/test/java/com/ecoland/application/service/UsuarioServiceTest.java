package com.ecoland.application.service;

import com.ecoland.domain.model.Usuario;
import com.ecoland.domain.port.out.UsuarioRepositoryPort;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UsuarioServiceTest {

    @Mock
    private UsuarioRepositoryPort usuarioRepositoryPort;

    @InjectMocks
    private UsuarioService usuarioService;

    private Usuario usuarioPrueba;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        // Preparamos un objeto base para los tests
        usuarioPrueba = new Usuario();
        usuarioPrueba.setId(1L);
        usuarioPrueba.setNombre("Juan Perez");
        usuarioPrueba.setEmail("juan@ecoland.com");
    }

    @Test
    void testGetUsuarioById_Success() {
        // Arrange
        when(usuarioRepositoryPort.findById(1L)).thenReturn(Optional.of(usuarioPrueba));

        // Act
        Optional<Usuario> result = usuarioService.getUsuarioById(1L);

        // Assert
        assertTrue(result.isPresent());
        assertEquals("juan@ecoland.com", result.get().getEmail());
        verify(usuarioRepositoryPort, times(1)).findById(1L);
    }

    @Test
    void testGetUsuarioByEmail_Success() {
        // Arrange
        String email = "juan@ecoland.com";
        when(usuarioRepositoryPort.findByEmail(email)).thenReturn(Optional.of(usuarioPrueba));

        // Act
        Optional<Usuario> result = usuarioService.getUsuarioByEmail(email);

        // Assert
        assertTrue(result.isPresent());
        assertEquals(1L, result.get().getId());
        verify(usuarioRepositoryPort, times(1)).findByEmail(email);
    }

    @Test
    void testCreateUsuario_Success() {
        // Arrange
        when(usuarioRepositoryPort.save(any(Usuario.class))).thenReturn(usuarioPrueba);

        // Act
        Usuario result = usuarioService.createUsuario(new Usuario());

        // Assert
        assertNotNull(result);
        assertEquals("Juan Perez", result.getNombre());
        verify(usuarioRepositoryPort, times(1)).save(any(Usuario.class));
    }

    @Test
    void testDeleteUsuario_Success() {
        // Arrange
        Long id = 1L;
        doNothing().when(usuarioRepositoryPort).deleteById(id);

        // Act
        usuarioService.deleteUsuario(id);

        // Assert
        verify(usuarioRepositoryPort, times(1)).deleteById(id);
    }
}