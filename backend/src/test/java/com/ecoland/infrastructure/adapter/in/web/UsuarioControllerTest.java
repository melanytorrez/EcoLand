package com.ecoland.infrastructure.adapter.in.web;

import com.ecoland.domain.model.Usuario;
import com.ecoland.domain.port.in.UsuarioUseCase;
import com.ecoland.infrastructure.security.JwtService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UsuarioController.class)
@AutoConfigureMockMvc(addFilters = false)
class UsuarioControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UsuarioUseCase usuarioUseCase;

    @MockBean
    private JwtService jwtService;

    @Test
    void testGetUsuario_Success() throws Exception {
        // Arrange
        Usuario usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNombre("Eco Admin");
        usuario.setEmail("admin@ecoland.com");

        when(usuarioUseCase.getUsuarioById(1L)).thenReturn(Optional.of(usuario));

        // Act & Assert
        mockMvc.perform(get("/api/v1/usuarios/1"))
                .andExpect(status().isOk()) // Espera 200 OK
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.nombre").value("Eco Admin"))
                .andExpect(jsonPath("$.email").value("admin@ecoland.com"));
    }

    @Test
    void testGetUsuario_NotFound() throws Exception {
        // Arrange
        when(usuarioUseCase.getUsuarioById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        mockMvc.perform(get("/api/v1/usuarios/99"))
                .andExpect(status().isNotFound()); // Espera 404 Not Found
    }

    @Test
    void testDeleteUsuario_Success() throws Exception {
        // Act & Assert
        mockMvc.perform(delete("/api/v1/usuarios/1"))
                .andExpect(status().isNoContent()); // Espera 204 No Content

        verify(usuarioUseCase, times(1)).deleteUsuario(1L);
    }
}